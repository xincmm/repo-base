import { EnsureRepo } from "@/components/custom/EnsureRepo";
import type { ReactNode } from "react";

export default function RepoLayout({ children }: { children: ReactNode }) {
  return <EnsureRepo>{children}</EnsureRepo>;
}
