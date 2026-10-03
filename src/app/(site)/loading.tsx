"use client";

import { useEffect, useState } from "react";

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/shadcnui/progress";

const Loading = () => {
  const [value, setValue] = useState(12);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(50);
      return;
    }
    const timer = setInterval(() => {
      setValue((v) => (v >= 92 ? 12 : v + Math.floor(Math.random() * 16) + 6));
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="mx-auto w-full max-w-5xl px-6 py-14 sm:py-16"
      role="status"
      aria-busy="true"
      aria-label="Loading page content">
      <div className="min-h-[70svh]">
        <Progress
          value={value}
          className="w-full max-w-md">
          <ProgressLabel>Loading page</ProgressLabel>
          <ProgressValue />
        </Progress>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="border-border overflow-hidden rounded-xl border">
              <div className="bg-muted aspect-[16/9] w-full animate-pulse" />
              <div className="space-y-3 p-5">
                <div className="bg-muted h-4 w-1/3 animate-pulse rounded" />
                <div className="bg-muted h-5 w-2/3 animate-pulse rounded" />
                <div className="bg-muted h-4 w-full animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
