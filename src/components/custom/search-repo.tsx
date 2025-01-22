"use client";

import { useAction } from "next-safe-action/hooks";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { validateRepositoryAction } from "@/actions/validate-repository-action";
import { useState } from "react";

export const SearchRepo: React.FC = () => {
  const [repository, setRepository] = useState("");
  const { execute, isPending } = useAction(validateRepositoryAction);

  return (
    <form className="flex gap-2">
      <Input
        value={repository}
        onChange={(e) => setRepository(e.target.value)}
        placeholder="facebook/react"
      />
      <Button disabled={isPending} onClick={() => execute({ repository })}>
        {isPending ? "Analyzing repository" : "Analyze Repository"}
      </Button>
    </form>
  );
};
