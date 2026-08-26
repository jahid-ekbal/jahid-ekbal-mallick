export interface DiscordUser {
  id: string;
  username: string;
  global_name?: string | null;
}

export interface InteractionOption {
  name: string;
  type: number;
  value?: string | number | boolean;
}

export interface ModalTextInput {
  type: number;
  custom_id: string;
  value: string;
}

export interface ActionRow {
  type: number;
  components: (ModalTextInput | ButtonComponent)[];
}

export interface ButtonComponent {
  type: number;
  style: number;
  label: string;
  custom_id: string;
}

export interface InteractionData {
  id: string;
  name: string;
  options?: InteractionOption[];
  custom_id?: string;
  components?: ActionRow[];
}

export interface Interaction {
  id: string;
  token: string;
  application_id: string;
  type: number;
  data?: InteractionData;
  user?: DiscordUser;
  member?: { user: DiscordUser };
}

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
  components?: ActionRow[];
  flags?: number;
}

export interface ModalPayload {
  custom_id: string;
  title: string;
  components: ActionRow[];
}

export interface InteractionResponse {
  type: number;
  data?: MessagePayload | ModalPayload;
}
