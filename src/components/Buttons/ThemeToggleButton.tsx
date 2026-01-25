"use client";

import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex cursor-pointer items-center">
      <Sun
        size={28}
        className="-rotate-360 opacity-100 transition-all duration-1500 dark:rotate-0 dark:opacity-0"
      />

      <MoonStar
        size={28}
        className="absolute -rotate-360 opacity-0 transition-all duration-1500 dark:rotate-0 dark:opacity-100"
      />
    </button>
  );
};

export default ThemeToggleButton;
