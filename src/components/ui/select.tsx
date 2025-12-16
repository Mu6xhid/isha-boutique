"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Select({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>) {
  return (
    <SelectPrimitive.Root {...props}>
      <SelectPrimitive.Trigger
        className={cn(
          "inline-flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-black",
          className
        )}
      >
        <SelectPrimitive.Value />
        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Content className="z-50 min-w-[6rem] rounded-md border bg-white p-1 text-sm shadow-md">
        <SelectPrimitive.Viewport>
          <SelectPrimitive.Group>{children}</SelectPrimitive.Group>
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Root>
  );
}

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ children, className, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "cursor-pointer rounded-sm px-2 py-1.5 hover:bg-gray-100 focus:bg-gray-100",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = "SelectItem";
