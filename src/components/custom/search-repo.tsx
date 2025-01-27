"use client";

import { useAction } from "next-safe-action/hooks";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { validateRepositoryAction } from "@/actions/validate-repository-action";
import { useState } from "react";
import { useSession } from "./providers/sesssion-provider";

export const SearchRepo: React.FC = () => {
  const [repository, setRepository] = useState("");
  const sessionId = useSession();

  const { execute, isPending } = useAction(validateRepositoryAction, {
    onSuccess: ({ data }) => console.log({ data }),
    onError: ({ error }) => console.error({ error }),
  });

  return (
    <form className="flex gap-2">
      <Input
        value={repository}
        onChange={(e) => setRepository(e.target.value)}
        placeholder="facebook/react"
      />
      <Button
        disabled={isPending}
        onClick={() => execute({ repository, sessionId })}
      >
        {isPending ? "Analyzing repository" : "Analyze Repository"}
      </Button>
    </form>
  );
};
