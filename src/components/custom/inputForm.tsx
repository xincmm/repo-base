"use client";

import { type FC, useState } from "react";
import { GitBranch as Github, LoaderCircle } from "lucide-react";
import { useAction } from "next-safe-action/hooks";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { validateRepositoryInput } from "@/actions/validateRepositoryInput";

export const InputForm: FC = () => {
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { execute, isPending } = useAction(validateRepositoryInput, {
    onError: ({ error }) => {
      if (error.serverError) {
        setErrorMessage(error.serverError);
      } else if (
        error.validationErrors?.input?._errors &&
        error.validationErrors.input._errors.length > 0
      ) {
        setErrorMessage(error.validationErrors.input._errors[0]);
      } else if (
        error.validationErrors?._errors &&
        error.validationErrors._errors.length > 0
      ) {
        setErrorMessage(error.validationErrors._errors[0]);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    },
    onSuccess: () => setErrorMessage(null),
  });

  const handleSubmit = () => execute({ input });

  return (
    <form
      className="flex flex-col gap-4 sm:flex-row w-full"
      action={handleSubmit}
    >
      <Input
        placeholder="facebook/react"
        className="h-12 text-lg"
        type="text"
        name="input"
        autoFocus
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button className="h-12 gap-2" size="lg" disabled={isPending}>
        {isPending ? (
          <LoaderCircle className="animate-spin size-5" />
        ) : (
          <Github className="size-5" />
        )}
        Import repository
      </Button>
    </form>
  );
};
