import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";


import { cn } from "../utils/cn"

import { Tooltip } from '@mantine/core';

export const HoverEffect = ({ items, className }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-1  lg:grid-cols-4  py-50", className)}>
      {items.map((item, idx) => (
        <Link
          href={item.link}
          key={item.link}
          className="relative group block p-1.5 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-[#3F4E4F] dark:bg-slate-800/[0.8] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.2 } }}
                exit={{ opacity: 0, transition: { duration: 0.1, delay: 0.2 } }}
              />
            )}
          </AnimatePresence>
          <Card>
            <div className="flex flex-row items-center justify-between">
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

const Card = ({ className, children }) => {
  return (
    <Tooltip
      label={children}
      position="bottom"
      withArrow
    >
      <div
        style={{ width: '150px', height: '40px' }}
        className={cn(
          " rounded-2xl  w-25 h-10 overflow-hidden  overflow-x-auto bg-gradient-to-r   border border-[#ffffff33] dark:border-white/[0.2] group-hover:border-[#3F4E4F] relative z-20",
          className
        )}
      >
        <div className="relative z-50">
          <div className="p-4">{children}</div>
        </div>
      </div>
    </Tooltip>
  );
};

const CardTitle = ({ className, children }) => {
  return (
    <h4 className={cn("text-[#F5EFE6] font-bold tracking-wide", className)}>
      {children}
    </h4>
  );
};

const CardDescription = ({ className, children }) => {
  return (
    <p className={cn("text-[#DEEDF0] tracking-wide leading-relaxed text-sm", className)}>
      {children}
    </p>
  );
};

export default HoverEffect;
