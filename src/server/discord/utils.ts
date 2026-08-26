import type { ActionRow, Interaction } from "./types";

export function slugify(input: string): string {
  const slug = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || "post";
}

export function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function getOptionValue(
  interaction: Interaction,
  name: string,
): string | undefined {
  const option = interaction.data?.options?.find((o) => o.name === name);
  if (option === undefined || option.value === undefined) return undefined;
  return String(option.value);
}

export function getModalValues(
  interaction: Interaction,
): Record<string, string> {
  const values: Record<string, string> = {};
  for (const row of interaction.data?.components ?? []) {
    for (const component of row.components ?? []) {
      if ("value" in component) {
        values[component.custom_id] = component.value ?? "";
      }
    }
  }
  return values;
}

export function parseTags(raw: string): string[] {
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const part of raw.split(",")) {
    const tag = part.trim();
    const key = tag.toLowerCase();
    if (!tag || seen.has(key) || tags.length >= 8) continue;
    seen.add(key);
    tags.push(tag);
  }
  return tags;
}

export function truncate(input: string, maxLength: number): string {
  return input.length <= maxLength ?
      input
    : `${input.slice(0, maxLength - 1)}…`;
}

export function actionRow(
  component: ActionRow["components"][number],
): ActionRow {
  return { type: 18, components: [component] };
}
