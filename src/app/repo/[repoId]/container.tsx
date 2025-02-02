"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export const Container: React.FC<PropsWithChildren> = ({ children }) => {
  const { open } = useSidebar();

  return (
    <div
      className={cn(
        "h-svh flex transition-[width] overflow-hidden duration-200 ease-linear",
        open ? "w-[calc(100svw-16rem)]" : "w-[calc(100svw-3rem)]",
      )}
    >
      {children}
    </div>
  );
};
