"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export const MainContainer: React.FC<PropsWithChildren> = ({ children }) => {
  const { open } = useSidebar();

  return (
    <div
      className={cn(
        "py-2 bg-sidebar flex flex-col gap-2 transition-all duration-200 ease-linear",
        open ? "w-[calc(100svw-16rem-24rem)]" : "w-[calc(100svw-3rem-24rem)]",
      )}
    >
      {children}
    </div>
  );
};
