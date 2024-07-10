// Label component
"use client";
import React from "react";
import { cn } from "../utils/cn";
import { Label as BaseLabel } from "@radix-ui/react-label";

export const Label = React.forwardRef((props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <BaseLabel
      ref={ref}
      className={cn(
        "text-sm font-medium text-black dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...otherProps}
    />
  );
});

Label.displayName = "Label";
