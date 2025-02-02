"use client";

import type { getFileTreeTask } from "@/trigger/get-file-tree-task";
import { useRealtimeBatch } from "@trigger.dev/react-hooks";
import { createContext, useContext } from "react";

type FetchingFilesContextType = ReturnType<
  typeof useRealtimeBatch<typeof getFileTreeTask>
> | null;

const FetchFilesContext = createContext<FetchingFilesContextType>(null);

interface FetchingFilesTaskProviderProps {
  batchId?: string;
  accessToken?: string;
}

export const FetchingFilesTaskProvider: React.FC<
  React.PropsWithChildren<FetchingFilesTaskProviderProps>
> = ({ accessToken, batchId, children }) => {
  const value = useRealtimeBatch<typeof getFileTreeTask>(batchId ?? "", {
    accessToken,
    enabled: !!accessToken && !!batchId,
  });

  return (
    <FetchFilesContext.Provider value={!accessToken && !batchId ? null : value}>
      {children}
    </FetchFilesContext.Provider>
  );
};

export const useFetchingFiles = () => {
  const context = useContext(FetchFilesContext);

  if (context === undefined) {
    throw new Error(
      "useFetchingFiles must be used inside FetchingFilesTaskProvider",
    );
  }

  return context;
};
