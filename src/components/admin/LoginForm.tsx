"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";

import { Button } from "@/components/shadcnui/button";
import { Input } from "@/components/shadcnui/input";
import { toast } from "@/components/shadcnui/toast";
import { requestLoginCode, verifyLoginCode } from "@/server/actions/login";

const CODE_PATTERN = /^[A-Z0-9]{6}$/;
const OTP_TTL_MS = 3 * 60 * 1000; // mirrors auth.ts expiresIn: 180

function secondsLeft(untilEpochMs: number, now: number): number {
  return Math.max(0, Math.ceil((untilEpochMs - now) / 1000));
}

export function LoginForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [issued, setIssued] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  /** epoch ms until which resending is blocked */
  const [resendAllowedAt, setResendAllowedAt] = useState(0);
  /** epoch ms when the issued code stops being valid */
  const [codeExpiresAt, setCodeExpiresAt] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  // One lightweight ticker drives both countdowns.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (issued) inputRef.current?.focus();
  }, [issued]);

  const resendIn = secondsLeft(resendAllowedAt, now);
  const codeValidFor = secondsLeft(codeExpiresAt, now);

  function applyServerCooldown(cooldownMs: number) {
    setResendAllowedAt(Date.now() + cooldownMs);
    setCodeExpiresAt(Date.now() + OTP_TTL_MS);
    setIssued(true);
    setCode("");
  }

  async function handleRequestCode(): Promise<boolean> {
    setSending(true);
    try {
      const result = await requestLoginCode();
      if (!result.ok) {
        toast.add({
          type: "error",
          title: "Could not send code",
          description: result.error,
        });
        return false;
      }
      applyServerCooldown(result.cooldownMs);
      toast.add({
        type: "success",
        title: "Code sent",
        description: "Check your Discord DMs - it expires in 3 minutes.",
      });
      return true;
    } finally {
      setSending(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!CODE_PATTERN.test(code)) {
      toast.add({
        type: "error",
        title: "Incomplete code",
        description: "Enter all 6 characters.",
      });
      inputRef.current?.focus();
      return;
    }
    setVerifying(true);
    try {
      const result = await verifyLoginCode({ code });
      if (!result.ok) {
        toast.add({
          type: "error",
          title: "Sign in failed",
          description: result.error,
        });
        return;
      }
      toast.add({
        type: "success",
        title: "Welcome back",
        description: "Signing you in...",
      });
      router.push("/admin" as Route);
      router.refresh();
    } finally {
      setVerifying(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-5">
      {!issued ?
        <>
          <p className="text-muted-foreground text-center text-sm">
            We&apos;ll send a 6-character login code to your Discord DMs.
          </p>
          <Button
            type="button"
            onClick={() => void handleRequestCode()}
            disabled={sending || resendIn > 0}
            className="w-full">
            {sending ?
              "Sending..."
            : resendIn > 0 ?
              `Resend available in ${resendIn}s`
            : "Send login code"}
          </Button>
        </>
      : <>
          <div className="space-y-2 text-center">
            <label
              htmlFor="otp-code"
              className="block text-sm font-medium">
              Login code
            </label>
            <Input
              ref={inputRef}
              id="otp-code"
              name="code"
              value={code}
              onChange={(event) =>
                setCode(event.target.value.toUpperCase().slice(0, 6))
              }
              inputMode="text"
              autoComplete="one-time-code"
              autoCapitalize="characters"
              spellCheck={false}
              maxLength={6}
              placeholder="••••••"
              aria-invalid={Boolean(code) && !CODE_PATTERN.test(code)}
              className="h-14 border-border bg-card text-center font-mono text-2xl font-semibold tracking-[0.45em]"
            />
            <p className="text-muted-foreground text-xs">
              {codeValidFor > 0 ?
                <>Code expires in {formatCountdown(codeValidFor)}</>
              : <span className="text-destructive">
                  Code expired - request a new one.
                </span>}
            </p>
          </div>

          <Button
            type="submit"
            disabled={verifying || !CODE_PATTERN.test(code)}
            className="w-full">
            {verifying ? "Verifying..." : "Sign in"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => void handleRequestCode()}
            disabled={sending || resendIn > 0}
            className="w-full">
            {sending ? "Resending..."
            : resendIn > 0 ?
              `Resend code in ${resendIn}s`
            : "Resend code"}
          </Button>
        </>
      }
    </form>
  );
}

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ?
    `${minutes}:${String(seconds).padStart(2, "0")}`
  : `${seconds}s`;
}

