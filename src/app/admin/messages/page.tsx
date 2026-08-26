import prisma from "@/lib/dbClient/prisma";
import { MessagesList } from "@/components/admin/MessagesList";

export default async function AdminMessagesPage() {
  const messages = await prisma.message.findMany({
    orderBy: [{ read: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
        <p className="text-muted-foreground text-sm">
          Contact form submissions, newest first.
        </p>
      </div>
      <MessagesList
        messages={messages.map((message) => ({
          id: message.id,
          name: message.name,
          email: message.email,
          subject: message.subject,
          body: message.body,
          read: message.read,
          delivered: message.delivered,
          createdAt: message.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
