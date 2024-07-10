"use client";
import React, { useState, useRef } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { cn } from "../utils/cn";

export const Input = React.forwardRef((props, ref) => {
  const { className, type = "text", ...otherProps } = props;
  const radius = 100;
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  };

  const background = useMotionTemplate`
    radial-gradient(
      ${isHovered ? `${radius}px` : "0px"} circle at ${mouseX}px ${mouseY}px,
      var(--blue-500), 
      transparent 80%
    )
  `;

  return (
    <motion.div
      className={cn(
        "p-2 rounded-lg transition-all duration-300 group",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ background }}
    >
      <input
        ref={ref}
        type={type}
        className="flex h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50"
        {...otherProps}
      />
    </motion.div>
  );
});

Input.displayName = "Input";
