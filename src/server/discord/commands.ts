import type { ActionRow, ModalPayload } from "./types";

export interface CommandOptionDefinition {
  name: string;
  description: string;
  type: number;
  required?: boolean;
  min_value?: number;
  max_value?: number;
}

export interface CommandDefinition {
  name: string;
  description: string;
  type: number;
  options?: CommandOptionDefinition[];
}

export const OPTION_TYPE_STRING = 3;
export const OPTION_TYPE_INTEGER = 4;

export const COMMAND_DEFINITIONS: CommandDefinition[] = [
  { name: "help", description: "Show every portfolio bot command", type: 1 },
  { name: "newblog", description: "Compose a new blog post draft", type: 1 },
  {
    name: "editblog",
    description: "Edit an existing blog post",
    type: 1,
    options: [
      {
        name: "id",
        description: "Post ID shown by /listblogs",
        type: OPTION_TYPE_INTEGER,
        required: true,
      },
    ],
  },
  {
    name: "publish",
    description: "Publish a draft post to the live site",
    type: 1,
    options: [
      {
        name: "id",
        description: "Post ID shown by /listblogs",
        type: OPTION_TYPE_INTEGER,
        required: true,
      },
    ],
  },
  {
    name: "unpublish",
    description: "Move a published post back to drafts",
    type: 1,
    options: [
      {
        name: "id",
        description: "Post ID shown by /listblogs",
        type: OPTION_TYPE_INTEGER,
        required: true,
      },
    ],
  },
  {
    name: "deleteblog",
    description: "Delete a blog post permanently (asks to confirm)",
    type: 1,
    options: [
      {
        name: "id",
        description: "Post ID shown by /listblogs",
        type: OPTION_TYPE_INTEGER,
        required: true,
      },
    ],
  },
  {
    name: "listblogs",
    description: "List all blog posts with their IDs and status",
    type: 1,
  },
  {
    name: "addrepo",
    description: "Import a GitHub repository as a project",
    type: 1,
    options: [
      {
        name: "url",
        description: "Repo URL (https://github.com/owner/repo) or owner/repo",
        type: OPTION_TYPE_STRING,
        required: true,
      },
      {
        name: "category",
        description:
          "Optional category override, e.g. Web, AI, Mobile (auto-detects if empty)",
        type: OPTION_TYPE_STRING,
        required: false,
      },
    ],
  },
  {
    name: "messages",
    description: "Show the latest contact form submissions",
    type: 1,
    options: [
      {
        name: "count",
        description: "How many messages to show (default 5)",
        type: OPTION_TYPE_INTEGER,
        min_value: 1,
        max_value: 10,
      },
    ],
  },
  {
    name: "ping",
    description: "Check that the portfolio bot is alive",
    type: 1,
  },
];

export const MODAL_CUSTOM_IDS = {
  newBlog: "portfolio:newblog",
  editBlogPrefix: "portfolio:editblog:",
} as const;

export const BUTTON_CUSTOM_IDS = {
  deleteConfirmPrefix: "portfolio:delconfirm:",
  deleteCancelPrefix: "portfolio:delcancel:",
} as const;

export const BLOG_FIELD_IDS = {
  title: "blog_title",
  excerpt: "blog_excerpt",
  tags: "blog_tags",
  coverUrl: "blog_cover_url",
  content: "blog_content",
} as const;

export interface BlogModalPrefills {
  postSeq?: number;
  title?: string;
  excerpt?: string;
  tags?: string;
  coverUrl?: string;
  content?: string;
}

function textInput(params: {
  customId: string;
  label: string;
  style: number;
  required: boolean;
  maxLength: number;
  value?: string;
  placeholder?: string;
}) {
  return {
    type: 4,
    custom_id: params.customId,
    style: params.style,
    label: params.label,
    min_length: params.required ? 1 : 0,
    max_length: params.maxLength,
    required: params.required,
    ...(params.value ? { value: params.value } : {}),
    ...(params.placeholder ? { placeholder: params.placeholder } : {}),
  };
}

function row(component: ActionRow["components"][number]): ActionRow {
  return { type: 18, components: [component] };
}

export function buildBlogModal(prefills: BlogModalPrefills = {}): ModalPayload {
  return {
    custom_id:
      prefills.postSeq ?
        `${MODAL_CUSTOM_IDS.editBlogPrefix}${prefills.postSeq}`
      : MODAL_CUSTOM_IDS.newBlog,
    title:
      prefills.postSeq ? `Edit Post #${prefills.postSeq}` : "New Blog Post",
    components: [
      row(
        textInput({
          customId: BLOG_FIELD_IDS.title,
          label: "Title",
          style: 1,
          required: true,
          maxLength: 120,
          value: prefills.title,
        }),
      ),
      row(
        textInput({
          customId: BLOG_FIELD_IDS.excerpt,
          label: "Excerpt",
          style: 1,
          required: true,
          maxLength: 200,
          value: prefills.excerpt,
          placeholder: "One or two sentences for previews and SEO",
        }),
      ),
      row(
        textInput({
          customId: BLOG_FIELD_IDS.tags,
          label: "Tags",
          style: 1,
          required: false,
          maxLength: 120,
          value: prefills.tags,
          placeholder: "react, nextjs, career",
        }),
      ),
      row(
        textInput({
          customId: BLOG_FIELD_IDS.coverUrl,
          label: "Cover Image URL",
          style: 1,
          required: false,
          maxLength: 500,
          value: prefills.coverUrl,
          placeholder: "https://example.com/cover.png",
        }),
      ),
      row(
        textInput({
          customId: BLOG_FIELD_IDS.content,
          label: "Content (Markdown)",
          style: 2,
          required: true,
          maxLength: 4000,
          value: prefills.content,
        }),
      ),
    ],
  };
}
