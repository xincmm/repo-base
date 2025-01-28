"use client";

import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface CheckFileProcessingJobProps {
  runId: string;
}

export const CheckFileProcessingJob: React.FC<CheckFileProcessingJobProps> = ({
  runId,
}) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const { run } = useRealtimeRun(runId);

  useEffect(() => {
    if (run?.output && sessionId) {
      router.push(`${pathName}?sessionId=${sessionId}`);
    }
  }, [pathName, router, run?.output, sessionId]);

  return null;
};
