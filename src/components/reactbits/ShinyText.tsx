"use client";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = "",
}) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block bg-[linear-gradient(120deg,rgba(255,255,255,0.4)_0%,rgba(255,255,255,1)_50%,rgba(255,255,255,0.4)_100%)] bg-[length:200%_100%] bg-clip-text text-transparent ${
        !disabled ? "animate-shiny" : ""
      } ${className}`}
      style={{ animationDuration }}>
      {text}
    </span>
  );
};
