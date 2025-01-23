"use client";

import { useEffect, useState } from "react";

export const ClientOnly: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) setMounted(true);
  }, [mounted]);

  if (!mounted) return null;

  return <>{children}</>;
};
