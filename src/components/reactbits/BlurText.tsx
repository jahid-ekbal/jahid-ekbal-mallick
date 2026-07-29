"use client";
import { motion } from "framer-motion";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const BlurText = ({
  text,
  className = "",
  delay = 0.05,
}: BlurTextProps) => {
  const words = text.split(" ");
  return (
    <span className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: "blur(10px)", opacity: 0, y: 15 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * delay }}
          className="mr-[0.25em] inline-block">
          {word}
        </motion.span>
      ))}
    </span>
  );
};
