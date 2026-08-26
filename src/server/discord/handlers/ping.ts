import { ephemeralMessage } from "./responses";

export async function handlePing(): Promise<
  ReturnType<typeof ephemeralMessage>
> {
  return ephemeralMessage("🏓 Pong! Portfolio bot is online.");
}
