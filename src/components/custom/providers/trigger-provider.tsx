"use client";

import { TriggerAuthContext } from "@trigger.dev/react-hooks";

export function TriggerProvider({
  accessToken,
  children,
}: {
  accessToken?: string;
  children: React.ReactNode;
}) {
  if (!accessToken) return <>{children}</>;

  return (
    <TriggerAuthContext.Provider value={{ accessToken }}>
      {children}
    </TriggerAuthContext.Provider>
  );
}
