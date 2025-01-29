"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderTree } from "lucide-react";
import { useState, useRef, useEffect, PropsWithChildren } from "react";

export const FileExplorerCard: React.FC<PropsWithChildren> = ({ children }) => {
  const [scrollAreaHeight, setScrollAreaHeight] = useState<number>(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardHeaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (!cardRef.current || !cardHeaderRef.current) return;

      const cardHeight = cardRef.current.clientHeight;
      const headerHeight = cardHeaderRef.current.clientHeight;
      const contentPadding = 33;

      const newScrollAreaHeight = cardHeight - headerHeight - contentPadding;
      setScrollAreaHeight(newScrollAreaHeight);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    if (cardRef.current) {
      resizeObserver.observe(cardRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <Card
      ref={cardRef}
      className="h-full bg-sidebar shadow-none rounded-none border-none"
    >
      <CardHeader ref={cardHeaderRef} className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <FolderTree className="size-4" />
          File explorer
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea
          className="w-full"
          style={{
            height: scrollAreaHeight > 0 ? `${scrollAreaHeight}px` : "auto",
          }}
        >
          {children}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
