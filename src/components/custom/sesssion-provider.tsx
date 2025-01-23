"use client";

import { createContext, useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    let existingSession = localStorage.getItem("session_id");

    if (!existingSession) {
      existingSession = uuidV4();
      localStorage.setItem("session_id", existingSession);
    }

    setSessionId(existingSession);
  }, []);

  if (!sessionId) return null;

  return (
    <SessionContext.Provider value={{ sessionId }}>
      {children}
    </SessionContext.Provider>
  );
};
