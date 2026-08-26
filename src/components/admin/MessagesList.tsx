"use client";

import { useState, useTransition } from "react";

import { Badge } from "@/components/shadcnui/badge";
import { Button } from "@/components/shadcnui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
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
import { deleteMessage, setMessageRead } from "@/server/actions/admin/messages";
import { toast } from "@/components/shadcnui/toast";
import { Mail, MailOpen, Trash2 } from "lucide-react";

export type AdminMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  read: boolean;
  delivered: boolean;
  createdAt: string;
};

export function MessagesList({ messages }: { messages: AdminMessage[] }) {
  const [pending, startTransition] = useTransition();
  const [toDelete, setToDelete] = useState<AdminMessage | null>(null);

  function toggleRead(message: AdminMessage) {
    startTransition(async () => {
      const result = await setMessageRead(message.id, !message.read);
      if (result.ok) {
        toast.add({
          type: "success",
          title: message.read ? "Marked as unread" : "Marked as read",
        });
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
    if (!toDelete) return;
    const target = toDelete;
    setToDelete(null);
    startTransition(async () => {
      const result = await deleteMessage(target.id);
      if (result.ok) {
        toast.add({
          type: "success",
          title: "Message deleted",
        });
      } else {
        toast.add({
          type: "error",
          title: "Delete failed",
          description: result.error,
        });
      }
    });
  }

  if (messages.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No messages yet. The contact form writes here and mirrors to Discord.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <Card key={message.id}>
          <CardHeader className="flex-row flex-wrap items-center gap-2 space-y-0">
            <Badge variant={message.read ? "secondary" : "default"}>
              {message.read ? "read" : "new"}
            </Badge>
            <CardTitle className="text-sm">{message.subject}</CardTitle>
            <span className="text-muted-foreground ml-auto text-xs">
              {new Date(message.createdAt).toLocaleString()}
            </span>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">{message.name}</span>{" "}
              <span className="text-muted-foreground">
                &lt;{message.email}&gt;
              </span>
            </p>
            <p className="text-muted-foreground text-sm whitespace-pre-wrap">
              {message.body}
            </p>
            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                variant="outline"
                disabled={pending}
                onClick={() => toggleRead(message)}>
                {message.read ?
                  <>
                    Mark as unread
                    <Mail
                      data-icon="inline-end"
                      className="transition-transform duration-200 group-hover/button:not-disabled:translate-x-0.5"
                    />
                  </>
                : <>
                    Mark as read
                    <MailOpen
                      data-icon="inline-end"
                      className="transition-transform duration-200 group-hover/button:not-disabled:translate-x-0.5"
                    />
                  </>
                }
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={pending}
                onClick={() => setToDelete(message)}>
                Delete
                <Trash2
                  data-icon="inline-end"
                  className="transition-transform duration-200 group-hover/button:not-disabled:scale-110"
                />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <AlertDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this message?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes &ldquo;{toDelete?.subject}&rdquo;.
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
