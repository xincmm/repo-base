"use client";

import { createSessionAction } from "@/actions/create-session-action";
import { useAction } from "next-safe-action/hooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { v4 as uuidV4 } from "uuid";

type SessionContextType = {
  sessionId: string;
} | null;

const SessionContext = createContext<SessionContextType>(null);

export const useSession = () => {
  const context = useContext(SessionContext);

  if (!context)
    throw new Error("useSession must be used within a SessionProvider");

  return context.sessionId;
};

export const SessionProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { execute, isPending } = useAction(createSessionAction);

  useEffect(() => {
    let existingSession = localStorage.getItem("session_id");

    if (!existingSession) {
      existingSession = uuidV4();
      localStorage.setItem("session_id", existingSession);
    }

    execute({ sessionId: existingSession });
    setSessionId(existingSession);
  }, [execute]);

  if (!sessionId || isPending) return null;

  return (
    <SessionContext.Provider value={{ sessionId }}>
      <EnsureSessionIdSearchParam>{children}</EnsureSessionIdSearchParam>
    </SessionContext.Provider>
  );
};

const EnsureSessionIdSearchParam: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const path = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  const fallbackSesisonId = useSession();

  const sessionIdFromSearchParams = searchParams.get("sessionId");

  useEffect(() => {
    if (!sessionIdFromSearchParams) {
      router.push(path + "?sessionId=" + fallbackSesisonId);
    }
  }, [fallbackSesisonId, path, router, sessionIdFromSearchParams]);

  if (!sessionIdFromSearchParams) return null;

  return <>{children}</>;
};
