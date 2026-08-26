import { getOptionValue } from "../utils";
import type { Interaction } from "../types";
import { ephemeralMessage } from "./responses";

export function parseIdOption(interaction: Interaction): number | null {
  const raw = getOptionValue(interaction, "id");
  if (raw === undefined) return null;
  const seq = Number.parseInt(raw, 10);
  return Number.isInteger(seq) && seq > 0 ? seq : null;
}

export function postNotFound(seq: number) {
  return ephemeralMessage(
    `⚠️ No post with ID \`${seq}\`. Run \`/listblogs\` to see valid IDs.`,
  );
}
