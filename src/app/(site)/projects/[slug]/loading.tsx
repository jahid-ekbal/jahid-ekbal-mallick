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
      aria-label="Loading project">
      <div className="min-h-[70svh]">
        <Progress
          value={value}
          className="w-full max-w-md">
          <ProgressLabel>Loading project</ProgressLabel>
          <ProgressValue />
        </Progress>
        <div className="mt-10 space-y-4">
          <div className="bg-muted h-4 w-32 animate-pulse rounded" />
          <div className="bg-muted h-10 w-2/3 animate-pulse rounded" />
          <div className="bg-muted aspect-video w-full animate-pulse rounded-xl" />
          <div className="space-y-3">
            <div className="bg-muted h-4 w-full animate-pulse rounded" />
            <div className="bg-muted h-4 w-5/6 animate-pulse rounded" />
            <div className="bg-muted h-4 w-4/6 animate-pulse rounded" />
          </div>
        </div>
        <span className="sr-only">Loading project</span>
      </div>
    </div>
  );
};

export default Loading;
