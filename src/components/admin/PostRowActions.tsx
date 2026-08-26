"use client";

import Link from "next/link";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/shadcnui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shadcnui/alert-dialog";
import { deletePost, setPostStatus } from "@/server/actions/admin/posts";
import { toast } from "@/components/shadcnui/toast";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";

export function PostRowActions({
  id,
  published,
}: {
  id: string;
  published: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function togglePublished() {
    startTransition(async () => {
      const result = await setPostStatus(id, !published);
      if (result.ok) {
        toast.add({
          type: "success",
          title: published ? "Post unpublished" : "Post published",
        });
        router.refresh();
      } else {
        toast.add({
          type: "error",
          title: "Update failed",
          description: result.error,
        });
      }
    });
  }

  function confirmDelete() {
    setConfirming(false);
    startTransition(async () => {
      const result = await deletePost(id);
      if (result.ok) {
        toast.add({
          type: "success",
          title: "Post deleted",
        });
        router.refresh();
      } else {
        toast.add({
          type: "error",
          title: "Delete failed",
          description: result.error,
        });
      }
    });
  }

  return (
    <div className="inline-flex justify-end gap-1">
      <Button
        size="xs"
        variant="outline"
        disabled={pending}
        onClick={togglePublished}>
        {published ? "Unpublish" : "Publish"}
        {published ?
          <EyeOff
            data-icon="inline-end"
            className="transition-transform duration-200 group-hover/button:not-disabled:scale-110"
          />
        : <Eye
            data-icon="inline-end"
            className="transition-transform duration-200 group-hover/button:not-disabled:scale-110"
          />
        }
      </Button>
      <Button
        size="xs"
        variant="outline"
        nativeButton={false}
        render={<Link href={`/admin/posts/${id}` as Route} />}>
        Edit
        <Pencil
          data-icon="inline-end"
          className="transition-transform duration-200 group-hover/button:not-disabled:-rotate-12"
        />
      </Button>
      <Button
        size="xs"
        variant="destructive"
        disabled={pending}
        onClick={() => setConfirming(true)}>
        Delete
        <Trash2
          data-icon="inline-end"
          className="transition-transform duration-200 group-hover/button:not-disabled:scale-110"
        />
      </Button>

      <AlertDialog
        open={confirming}
        onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
