"use client";

import { useAction } from "next-safe-action/hooks";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { initRepoAction } from "@/actions/init-repo";
import { useState } from "react";
import { useSession } from "./providers/sesssion-provider";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

export const SearchRepo: React.FC = () => {
  const [repository, setRepository] = useState("");
  const sessionId = useSession();

  const { execute, isPending } = useAction(initRepoAction, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(error.serverError ?? "Unkown server error");
      }
    },
  });

  return (
    <form
      className="flex gap-2"
      action={() => execute({ repository, sessionId })}
    >
      <Input
        autoFocus
        value={repository}
        onChange={(e) => setRepository(e.target.value)}
        placeholder="facebook/react"
      />
      <Button className="w-60" disabled={isPending} type="submit">
        {isPending ? (
          <>
            <LoaderCircle className="animate-spin" />
            <span>Importing repository</span>
          </>
        ) : (
          <span>Import repository</span>
        )}
      </Button>
    </form>
  );
};
