"use client";

import { useState } from "react";
import { ArrowUpRight, Copy, Mail, MoreVertical, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import {
  DiscordIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TelegramIcon,
  WhatsAppIcon,
  XIcon,
  YouTubeIcon,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcnui/dropdown-menu";
import { toast } from "@/components/shadcnui/toast";
import type { Socials } from "@/lib/data";

type SocialEntry = {
  key: keyof Socials | "email";
  label: string;
  href: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type Props = {
  socials: Socials;
  email?: string | null;
};

export default function ContactSocialGrid({ socials, email }: Props) {
  const [qr, setQr] = useState<{ href: string; label: string } | null>(null);

  const entries: SocialEntry[] = [
    {
      key: "github",
      label: "GitHub",
      href: socials.github ?? "",
      Icon: GitHubIcon,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      href: socials.linkedin ?? "",
      Icon: LinkedInIcon,
    },
    { key: "twitter", label: "X", href: socials.twitter ?? "", Icon: XIcon },
    {
      key: "instagram",
      label: "Instagram",
      href: socials.instagram ?? "",
      Icon: InstagramIcon,
    },
    {
      key: "youtube",
      label: "YouTube",
      href: socials.youtube ?? "",
      Icon: YouTubeIcon,
    },
    {
      key: "discord",
      label: "Discord",
      href: socials.discord ?? "",
      Icon: DiscordIcon,
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      href: socials.whatsapp ?? "",
      Icon: WhatsAppIcon,
    },
    {
      key: "telegram",
      label: "Telegram",
      href: socials.telegram ?? "",
      Icon: TelegramIcon,
    },
  ].filter((e) => Boolean(e.href)) as SocialEntry[];

  if (email) {
    entries.push({
      key: "email",
      label: "Email",
      href: `mailto:${email}`,
      Icon: Mail as unknown as React.ComponentType<
        React.SVGProps<SVGSVGElement>
      >,
    });
  }

  if (entries.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No contact links configured yet.
      </p>
    );
  }

  const handleCopy = async (href: string, label: string) => {
    try {
      await navigator.clipboard.writeText(href);
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
        {entries.map(({ key, label, href, Icon }) => {
          const isEmail = href.startsWith("mailto:");
          return (
            <div
              key={key}
              className="group relative">
              <ContextMenu>
                <ContextMenuTrigger
                  className="focus-visible:ring-ring block rounded-xl focus-visible:ring-2 focus-visible:outline-none"
                  render={
                    <a
                      href={href}
                      target={isEmail ? undefined : "_blank"}
                      rel={isEmail ? undefined : "noopener noreferrer"}
                      aria-label={`${label} — click to open, right-click for more options`}
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
                      <span className="text-muted-foreground hidden max-w-full truncate px-2 text-[10px] break-all sm:block">
                        {href
                          .replace(/^https?:\/\//, "")
                          .replace(/^mailto:/, "")}
                      </span>
                    </CardContent>
                  </Card>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-48">
                  <ContextMenuItem onClick={() => handleGo(href)}>
                    Go to {label}
                    <ArrowUpRight className="ml-auto" />
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleCopy(href, label)}>
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

              {/* Mobile fallback: visible ••• button — same actions as context menu */}
              <div className="absolute top-2 right-2 md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    aria-label={`More options for ${label}`}
                    className="bg-background/80 border-border text-muted-foreground hover:text-foreground hover:bg-accent focus-visible:ring-ring inline-flex size-7 items-center justify-center rounded-md border shadow-sm backdrop-blur-sm focus-visible:ring-2 focus-visible:outline-none"
                    onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="size-3.5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48">
                    <DropdownMenuItem onClick={() => handleGo(href)}>
                      Go to {label}
                      <ArrowUpRight className="ml-auto" />
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCopy(href, label)}>
                      Copy link
                      <Copy className="ml-auto" />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setQr({ href, label })}>
                      Show QR
                      <QrCode className="ml-auto" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
