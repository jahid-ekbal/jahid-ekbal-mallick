export interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface EmbedPayload {
  title?: string;
  description?: string;
  color?: number;
  fields?: EmbedField[];
  footer?: { text: string };
  timestamp?: string;
}

export interface MessagePayload {
  content?: string;
  embeds?: EmbedPayload[];
}
