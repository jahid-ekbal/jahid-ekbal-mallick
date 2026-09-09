"use client";

import { useEffect, useState } from "react";

const roles = [
  "Full-Stack Developer",
  "React and Next.js builder",
  "UI and UX crafter",
  "Digital creator",
];

export default function Typewriter() {
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [text, setText] = useState(() => (reduced ? roles[0] : ""));
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const current = roles[index % roles.length];
    const speed = deleting ? 32 : 64;
    const timer = setTimeout(() => {
      if (!deleting && text === current) {
        setTimeout(() => setDeleting(true), 1400);
        return;
      }
      if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => i + 1);
        return;
      }
      setText(
        deleting ?
          current.slice(0, text.length - 1)
        : current.slice(0, text.length + 1),
      );
    }, speed);
    return () => clearTimeout(timer);
  }, [text, index, deleting, reduced]);

  return (
    <span aria-live="polite">
      {text}
      <span
        aria-hidden
        className="animate-pulse">
        |
      </span>
    </span>
  );
}
