"use client";
import { useRef, useState } from "react";

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  disabled?: boolean;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 100,
  disabled = false,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const magnetRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || !magnetRef.current) return;
    const { left, top, width, height } =
      magnetRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distX = Math.abs(centerX - e.clientX);
    const distY = Math.abs(centerY - e.clientY);

    if (distX < padding && distY < padding) {
      setPosition({
        x: (e.clientX - centerX) * 0.3,
        y: (e.clientY - centerY) * 0.3,
      });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <div
      ref={magnetRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0px)`,
        transition: "transform 0.15s ease-out",
      }}
      className="inline-block">
      {children}
    </div>
  );
};
