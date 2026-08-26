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
import {
  deleteProject,
  setProjectPublished,
} from "@/server/actions/admin/projects";
import { toast } from "@/components/shadcnui/toast";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";

export function ProjectRowActions({
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
      const result = await setProjectPublished(id, !published);
      if (result.ok) {
        toast.add({
          type: "success",
          title: published ? "Project unpublished" : "Project published",
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
      const result = await deleteProject(id);
      if (result.ok) {
        toast.add({
          type: "success",
          title: "Project deleted",
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
        render={<Link href={`/admin/projects/${id}` as Route} />}>
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
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the project and its public page.
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
