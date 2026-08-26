import { PostForm } from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New post</h1>
        <p className="text-muted-foreground text-sm">
          Markdown supported. Publishing makes it live at /blog/&lt;slug&gt;.
        </p>
      </div>
      <PostForm />
    </div>
  );
}
