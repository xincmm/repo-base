import { CheckFileProcessingJob } from "./check-file-processing-job";
import { FileTreeBuilder } from "./file-tree-builder";
import { FileExplorerCard } from "./file-explorer-card";

interface FileExplorerProps {
  runId?: string;
  repoId: number;
}
export const FileExplorer: React.FC<FileExplorerProps> = ({
  repoId,
  runId,
}) => {
  return (
    <>
      {!!runId && <CheckFileProcessingJob runId={runId} />}
      <FileExplorerCard>
        <FileTreeBuilder repoId={repoId} />
      </FileExplorerCard>
    </>
  );
};
