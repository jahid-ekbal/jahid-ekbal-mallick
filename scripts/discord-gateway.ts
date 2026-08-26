/**
 * Local development companion for the portfolio bot.
 *
 * Receives INTERACTION_CREATE events over the Discord Gateway and routes them
 * through the exact same handleInteraction() used by the production webhook,
 * then delivers responses via the REST interaction callback endpoint.
 *
 * Discord delivers interactions over EITHER the gateway OR the configured
 * Interactions Endpoint URL (mutually exclusive). For this script to receive
 * anything, the Interactions Endpoint URL must be empty in the Dev Portal.
 * After deploying to Vercel, set the endpoint URL again and this sidecar
 * simply stops receiving events.
 *
 * Runs automatically alongside `next dev` via `bun dev`. Exits quietly when
 * DISCORD_BOT_TOKEN is not configured so a fresh clone still boots cleanly.
 */

import { getDiscordConfig } from "../src/server/discord/env";
import { handleInteraction } from "../src/server/discord/router";
import { sendInteractionCallback } from "../src/server/discord/rest";
import type { Interaction } from "../src/server/discord/types";
import { InteractionResponseFlags } from "discord-interactions";

const GATEWAY_URL = "wss://gateway.discord.gg/?v=10&encoding=json";

const OP_DISPATCH = 0;
const OP_HEARTBEAT = 1;
const OP_IDENTIFY = 2;
const OP_RESUME = 6;
const OP_RECONNECT = 7;
const OP_INVALID_SESSION = 9;
const OP_HELLO = 10;
const OP_HEARTBEAT_ACK = 11;

interface GatewayPayload {
  op: number;
  t?: string | null;
  s?: number | null;
  d?: unknown;
}

interface HelloData {
  heartbeat_interval: number;
}

interface ReadyData {
  session_id: string;
  user: { username: string };
}

const config = getDiscordConfig();
if (!config || !process.env.DISCORD_BOT_TOKEN?.trim()) {
  console.log(
    "[bot] DISCORD_* env vars incomplete - gateway sidecar idle (webhook-only mode).",
  );
  process.exit(0);
}

const botToken = process.env.DISCORD_BOT_TOKEN.trim();

let socket: WebSocket | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let awaitingHeartbeatAck = false;
let sessionId: string | null = null;
let lastSeq: number | null = null;
let reconnectAttempts = 0;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let shuttingDown = false;

function log(message: string) {
  console.log(`[bot] ${message}`);
}

function send(payload: object) {
  socket?.send(JSON.stringify(payload));
}

function stopHeartbeat() {
  if (heartbeatTimer !== null) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

function startHeartbeat(intervalMs: number) {
  stopHeartbeat();
  awaitingHeartbeatAck = false;
  heartbeatTimer = setInterval(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    if (awaitingHeartbeatAck) {
      log("heartbeat ACK missing - reconnecting");
      socket.close(4000, "heartbeat timeout");
      return;
    }
    awaitingHeartbeatAck = true;
    send({ op: OP_HEARTBEAT, d: lastSeq });
  }, intervalMs);
}

function identify() {
  send({
    op: OP_IDENTIFY,
    d: {
      token: botToken,
      intents: 0,
      properties: {
        os: process.platform,
        browser: "portfolio-bot",
        device: "portfolio-bot",
      },
    },
  });
}

function resume() {
  send({
    op: OP_RESUME,
    d: { token: botToken, session_id: sessionId, seq: lastSeq },
  });
}

async function deliverInteraction(interaction: Interaction) {
  const startedAt = Date.now();
  try {
    const response = await handleInteraction(interaction);
    const sent = await sendInteractionCallback(
      interaction.id,
      interaction.token,
      response,
    );
    if (!sent) {
      log(`failed to respond to interaction ${interaction.id}`);
    } else {
      log(
        `handled interaction ${interaction.id} (${interaction.type}) in ${Date.now() - startedAt}ms`,
      );
    }
  } catch (error) {
    console.error("[bot] interaction crashed:", error);
    await sendInteractionCallback(interaction.id, interaction.token, {
      type: 4,
      data: {
        content:
          "💥 Something went wrong on the server. Try again in a moment.",
        flags: InteractionResponseFlags.EPHEMERAL,
      },
    }).catch(() => undefined);
  }
}

function scheduleReconnect() {
  if (shuttingDown || reconnectTimer !== null) return;
  reconnectAttempts += 1;
  const delay = Math.min(1000 * 2 ** reconnectAttempts, 30_000);
  log(`reconnecting in ${delay}ms (attempt ${reconnectAttempts})`);
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connect();
  }, delay);
}

function handleMessage(event: MessageEvent) {
  let payload: GatewayPayload;
  try {
    payload = JSON.parse(String(event.data)) as GatewayPayload;
  } catch {
    return;
  }

  if (typeof payload.s === "number") {
    lastSeq = payload.s;
  }

  switch (payload.op) {
    case OP_HELLO:
      startHeartbeat((payload.d as HelloData).heartbeat_interval);
      if (sessionId && lastSeq !== null) {
        log("resuming gateway session");
        resume();
      } else {
        identify();
      }
      break;
    case OP_HEARTBEAT_ACK:
      awaitingHeartbeatAck = false;
      break;
    case OP_DISPATCH:
      if (payload.t === "READY") {
        const ready = payload.d as ReadyData;
        sessionId = ready.session_id;
        reconnectAttempts = 0;
        log(`gateway connected as ${ready.user.username}`);
        log("slash commands are live locally (endpoint URL must be empty)");
      } else if (payload.t === "RESUMED") {
        reconnectAttempts = 0;
        log("gateway session resumed");
      } else if (payload.t === "INTERACTION_CREATE") {
        void deliverInteraction(payload.d as Interaction);
      }
      break;
    case OP_RECONNECT:
      log("server requested reconnect");
      socket?.close(4000, "reconnect requested");
      break;
    case OP_INVALID_SESSION:
      if (payload.d !== true) sessionId = null;
      log("invalid session - starting fresh");
      socket?.close(4000, "invalid session");
      break;
    default:
      break;
  }
}

function connect() {
  socket = new WebSocket(GATEWAY_URL);

  socket.onmessage = handleMessage;

  socket.onopen = () => log("gateway socket open");

  socket.onclose = (event) => {
    stopHeartbeat();
    if (event.code === 4004) {
      log("authentication failed (bad token) - sidecar stopping");
      process.exit(1);
    }
    socket = null;
    if (!shuttingDown) scheduleReconnect();
  };

  socket.onerror = () => {
    // onclose always follows onerror; nothing to do here
  };
}

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    shuttingDown = true;
    stopHeartbeat();
    if (reconnectTimer !== null) clearTimeout(reconnectTimer);
    socket?.close(1000, "shutdown");
    process.exit(0);
  });
}

log("starting gateway sidecar");
connect();
