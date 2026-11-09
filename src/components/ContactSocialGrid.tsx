"use client";

import { useState } from "react";
import { ArrowUpRight, Copy, Mail, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import {
  DiscordIcon,
  GitHubIcon,
  LinkedInIcon,
  TelegramIcon,
  WhatsAppIcon,
  XIcon,
} from "@/components/icons";
import { Card, CardContent } from "@/components/shadcnui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/shadcnui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcnui/dialog";
import { toast } from "@/components/shadcnui/toast";
import type { Socials } from "@/lib/data";

type SocialEntry = {
  key: keyof Socials | "email";
  label: string;
  handle: string;
  href: string;
  Icon: React.ComponentType<{
    width?: number;
    height?: number;
    className?: string;
    size?: number;
  }>;
};

type Props = {
  socials: Socials;
  email?: string | null;
};

const handleFor = (
  key: keyof Socials | "email",
  href: string,
  email?: string | null,
) => {
  if (key === "email") return email ?? href;
  if (key === "discord") return "Discord user link";
  if (key === "github") return "@jahid-ekbal";
  if (key === "linkedin") return "jahid-developer";
  if (key === "twitter") return "@JAHIDEKBAL01";
  if (key === "whatsapp") return "WhatsApp chat";
  if (key === "telegram") return "@jahidekbal";
  return href.replace(/^https?:\/\//, "");
};

export default function ContactSocialGrid({ socials, email }: Props) {
  const [qr, setQr] = useState<{ href: string; label: string } | null>(null);

  const entries: SocialEntry[] = [
    {
      key: "github",
      label: "GitHub",
      handle: handleFor("github", socials.github ?? ""),
      href: socials.github ?? "",
      Icon: GitHubIcon,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      handle: handleFor("linkedin", socials.linkedin ?? ""),
      href: socials.linkedin ?? "",
      Icon: LinkedInIcon,
    },
    {
      key: "twitter",
      label: "X",
      handle: handleFor("twitter", socials.twitter ?? ""),
      href: socials.twitter ?? "",
      Icon: XIcon,
    },
    {
      key: "discord",
      label: "Discord",
      handle: handleFor("discord", socials.discord ?? ""),
      href: socials.discord ?? "",
      Icon: DiscordIcon,
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      handle: handleFor("whatsapp", socials.whatsapp ?? ""),
      href: socials.whatsapp ?? "",
      Icon: WhatsAppIcon,
    },
    {
      key: "telegram",
      label: "Telegram",
      handle: handleFor("telegram", socials.telegram ?? ""),
      href: socials.telegram ?? "",
      Icon: TelegramIcon,
    },
  ].filter((e) => Boolean(e.href)) as SocialEntry[];

  if (email) {
    entries.push({
      key: "email",
      label: "Email",
      handle: handleFor("email", `mailto:${email}`, email),
      href: `mailto:${email}`,
      Icon: Mail,
    });
  }

  if (entries.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No contact links configured yet. Reach me at the email in the header.
      </p>
    );
  }

  const handleCopy = async (href: string, label: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(href);
      } else {
        const ta = document.createElement("textarea");
        ta.value = href;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      toast.add({
        type: "success",
        title: "Copied",
        description: `${label} link copied to clipboard.`,
      });
    } catch {
      toast.add({
        type: "error",
        title: "Copy failed",
        description: "Could not copy link. Please copy manually.",
      });
    }
  };

  const handleGo = (href: string) => {
    if (href.startsWith("mailto:")) {
      window.location.href = href;
    } else {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {entries.map(({ key, label, handle, href, Icon }) => {
          const isEmail = href.startsWith("mailto:");
          return (
            <div key={key}>
              <ContextMenu>
                <ContextMenuTrigger
                  className="focus-visible:ring-ring block rounded-xl focus-visible:ring-2 focus-visible:outline-none"
                  render={
                    <a
                      href={href}
                      target={isEmail ? undefined : "_blank"}
                      rel={isEmail ? undefined : "noopener noreferrer"}
                      aria-label={`Open ${label} in a new tab`}
                    />
                  }>
                  <Card className="hover:border-ring/50 aspect-square cursor-pointer p-0 transition-all select-none hover:shadow-md">
                    <CardContent className="flex h-full flex-col items-center justify-center gap-3 p-4">
                      <span className="bg-muted group-hover:bg-accent flex size-14 items-center justify-center rounded-xl transition-colors">
                        <Icon
                          width={28}
                          height={28}
                          className="text-foreground"
                        />
                      </span>
                      <span className="text-sm font-medium tracking-tight">
                        {label}
                      </span>
                      <span className="text-muted-foreground max-w-full truncate px-2 text-xs">
                        {handle}
                      </span>
                      <span className="flex min-h-11 items-center gap-2">
                        <button
                          type="button"
                          aria-label={`Copy ${label} link`}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            void handleCopy(href, label);
                          }}
                          className="focus-visible:ring-ring inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-xs font-medium underline underline-offset-2 focus-visible:ring-2 focus-visible:outline-none">
                          <Copy size={14} />
                          Copy
                        </button>
                        <button
                          type="button"
                          aria-label={`Show QR code for ${label}`}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            setQr({ href, label });
                          }}
                          className="focus-visible:ring-ring inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-xs font-medium underline underline-offset-2 focus-visible:ring-2 focus-visible:outline-none">
                          <QrCode size={14} />
                          QR
                        </button>
                      </span>
                    </CardContent>
                  </Card>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-48">
                  <ContextMenuItem onClick={() => handleGo(href)}>
                    Go to {label}
                    <ArrowUpRight className="ml-auto" />
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => void handleCopy(href, label)}>
                    Copy link
                    <Copy className="ml-auto" />
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => setQr({ href, label })}>
                    Show QR
                    <QrCode className="ml-auto" />
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </div>
          );
        })}
      </div>

      <Dialog
        open={!!qr}
        onOpenChange={(open) => !open && setQr(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{qr?.label} QR code</DialogTitle>
            <DialogDescription className="break-all">
              {qr?.href}
            </DialogDescription>
          </DialogHeader>
          {qr && (
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="rounded-lg bg-white p-4">
                <QRCodeSVG
                  value={qr.href}
                  size={200}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
              <p className="text-muted-foreground text-center text-xs break-all">
                Scan to open {qr.label}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
