"use client";

import { useEffect, useState } from "react";

const roles = [
  "Full-Stack Developer",
  "React and Next.js builder",
  "UI and UX crafter",
  "Digital creator",
];

export default function Typewriter() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!mounted || reduced) return;
    const current = roles[index % roles.length];
    const speed = deleting ? 32 : 64;
    let inner: ReturnType<typeof setTimeout> | undefined;
    const timer = setTimeout(() => {
      if (!deleting && text === current) {
        inner = setTimeout(() => setDeleting(true), 1400);
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
    return () => {
      clearTimeout(timer);
      if (inner) clearTimeout(inner);
    };
  }, [text, index, deleting, reduced, mounted]);

  const display = !mounted || reduced ? roles[0] : text;

  return (
    <span aria-live="off">
      <span className="sr-only">{roles[index % roles.length]}</span>
      <span aria-hidden>
        {display}
        <span
          aria-hidden
          className="animate-pulse">
          |
        </span>
      </span>
    </span>
  );
}
