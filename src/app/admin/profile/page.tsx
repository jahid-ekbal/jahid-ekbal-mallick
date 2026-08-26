import prisma from "@/lib/dbClient/prisma";
import { ProfileForm } from "@/components/admin/ProfileForm";

export default async function AdminProfilePage() {
  const row = await prisma.profile.findUnique({ where: { id: "main" } });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-muted-foreground text-sm">
          Drives the home, about, resume and contact pages.
        </p>
      </div>
      <ProfileForm
        initial={
          row ?
            {
              name: row.name,
              headline: row.headline,
              tagline: row.tagline,
              bio: row.bio,
              location: row.location,
              email: row.email,
              avatarUrl: row.avatarUrl ?? "",
              resumeUrl: row.resumeUrl ?? "",
              socials: JSON.parse(row.socials),
              skills: JSON.parse(row.skills).map(
                (group: { category: string; items: string[] }) => ({
                  category: group.category,
                  items: group.items.join(", "),
                }),
              ),
              experiences: JSON.parse(row.experiences),
              education: JSON.parse(row.education),
            }
          : undefined
        }
      />
    </div>
  );
}
