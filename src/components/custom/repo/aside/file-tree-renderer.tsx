"use client";

import { useState } from "react";
import type { FileTreeNode } from "./file-tree-builder";
import { ChevronDown, ChevronRight, File, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";

export const TreeNode: React.FC<{ node: FileTreeNode }> = ({ node }) => {
  const [open, seOpen] = useState(false);

  const toggleOpen = () => {
    if (node.fileType === "folder") seOpen((prev) => !prev);
  };

  return (
    <li className="w-full">
      <Button
        variant="ghost"
        size="xs"
        className="w-full justify-start"
        onClick={toggleOpen}
      >
        {node.fileType === "folder" ? (
          open ? (
            <ChevronDown className="size-3" />
          ) : (
            <ChevronRight className="size-3" />
          )
        ) : (
          <div className="size-3"></div>
        )}

        {node.fileType === "file" ? (
          <File className="size-3" />
        ) : (
          <Folder className="size-3" />
        )}

        <span className="truncate">{node.name}</span>
      </Button>

      {open && node.fileType === "folder" && !!node.children?.length && (
        <ul className="pl-2">
          {node.children?.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
};
