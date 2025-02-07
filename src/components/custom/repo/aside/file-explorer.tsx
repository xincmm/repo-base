import { FileTreeBuilder } from "./file-tree-builder";
import { FileExplorerCard } from "./file-explorer-card";

interface FileExplorerProps {
  runId?: string;
  repoId: number;
}
export const FileExplorer: React.FC<FileExplorerProps> = ({ repoId }) => {
  return (
    <>
      <FileExplorerCard>
        <FileTreeBuilder repoId={repoId} />
      </FileExplorerCard>
    </>
  );
};
