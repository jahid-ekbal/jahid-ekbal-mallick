import prisma from "@/lib/dbClient/prisma";
import { ephemeralMessage } from "./responses";

export async function handleListBlogs() {
  const posts = await prisma.post.findMany({
    orderBy: { seq: "desc" },
    take: 25,
    select: { seq: true, title: true, status: true },
  });

  if (posts.length === 0) {
    return ephemeralMessage(
      "📭 No blog posts yet. Use `/newblog` to compose your first draft.",
    );
  }

  const published = posts.filter((p) => p.status === "PUBLISHED").length;
  const lines = posts.map(
    (p) =>
      `\`#${p.seq}\` ${p.status === "PUBLISHED" ? "🟢" : "🟡"} **${p.title}**`,
  );

  return ephemeralMessage(
    [
      `📚 **Blog posts** (${published} published / ${posts.length} total${posts.length >= 25 ? "+, newest 25 shown" : ""})`,
      "",
      ...lines,
    ].join("\n"),
  );
}
