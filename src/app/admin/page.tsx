import Link from "next/link";
import type { Route } from "next";

import prisma from "@/lib/dbClient/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import { Badge } from "@/components/shadcnui/badge";

export default async function AdminOverviewPage() {
  const [
    projectCount,
    publishedProjects,
    postCount,
    publishedPosts,
    messageCount,
    unreadMessages,
    visitorCount,
    recentMessages,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.message.count(),
    prisma.message.count({ where: { read: false } }),
    prisma.visitorSession.count(),
    prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, subject: true, read: true },
    }),
  ]);

  const stats = [
    {
      label: "Projects",
      value: `${publishedProjects}/${projectCount}`,
      hint: "published / total",
      href: "/admin/projects",
    },
    {
      label: "Blog posts",
      value: `${publishedPosts}/${postCount}`,
      hint: "published / total",
      href: "/admin/posts",
    },
    {
      label: "Unread messages",
      value: String(unreadMessages),
      hint: `${messageCount} total`,
      href: "/admin/messages",
    },
    {
      label: "Visitors",
      value: String(visitorCount),
      hint: "all time",
      href: "/admin/analytics",
    },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-muted-foreground text-sm">
          Everything on the public site is managed from here.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href as Route}>
            <Card className="hover:border-ring transition-colors">
              <CardHeader>
                <CardTitle className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{stat.value}</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {stat.hint}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Latest contact messages</CardTitle>
          <Link
            href="/admin/messages"
            className="text-muted-foreground hover:text-foreground text-xs">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {recentMessages.length === 0 ?
            <p className="text-muted-foreground text-sm">
              No contact messages yet.
            </p>
          : <ul className="divide-border divide-y">
              {recentMessages.map((message) => (
                <li
                  key={message.id}
                  className="flex items-center gap-3 py-2">
                  <Badge variant={message.read ? "secondary" : "default"}>
                    {message.read ? "read" : "new"}
                  </Badge>
                  <span className="truncate text-sm font-medium">
                    {message.name}
                  </span>
                  <span className="text-muted-foreground truncate text-sm">
                    {message.subject}
                  </span>
                </li>
              ))}
            </ul>
          }
        </CardContent>
      </Card>
    </div>
  );
}
