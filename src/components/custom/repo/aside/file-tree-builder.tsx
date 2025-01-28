import { db } from "@/db";
import type { RepoFile } from "@/db/schema/repo-files";
import { TreeNode } from "./file-tree-renderer";

interface FileTreeProps {
  repoId: number;
}

export const FileTreeBuilder: React.FC<FileTreeProps> = async ({ repoId }) => {
  const normalizedFileTree = await db.query.repoFiles.findMany({
    where: (f, o) => o.eq(f.repoId, repoId),
  });

  const tree = buildTree(normalizedFileTree);

  return (
    <ul>
      {tree.map((node) => (
        <TreeNode key={node.id} node={node} />
      ))}
    </ul>
  );
};

export type FileTreeNode = RepoFile & {
  children?: FileTreeNode[];
  name: string;
};

const buildTree = (normalizedFileTree: RepoFile[]): FileTreeNode[] => {
  const root: FileTreeNode[] = [];
  const map = new Map<string, FileTreeNode>();

  for (const file of normalizedFileTree) {
    if (!file.path) continue;

    const pathParts = file.path?.split("/").filter(Boolean);
    const name = pathParts[pathParts.length - 1];
    const parentPath = pathParts.slice(0, -1).join("/");

    const node: FileTreeNode = {
      ...file,
      name,
      children: file.fileType === "folder" ? [] : undefined,
    };

    map.set(file.path, node);

    if (parentPath === "") {
      root.push(node);
    } else {
      const parent = map.get(parentPath);
      if (parent && parent.children) {
        parent.children.push(node);
      }
    }
  }

  const sortNodes = (nodes: FileTreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.fileType !== b.fileType) {
        return a.fileType === "folder" ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    nodes.forEach((node) => {
      if (node.children) {
        sortNodes(node.children);
      }
    });
  };

  sortNodes(root);
  return root;
};
