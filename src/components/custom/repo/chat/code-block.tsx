"use client";

import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  materialDark,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  node: unknown;
  className: string;
  children: React.ReactNode;
}

export function CodeBlock({
  className,
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  node,
  ...props
}: CodeBlockProps) {
  const { theme } = useTheme();

  const match = /language-(\w+)/.exec(className || "");

  return match ? (
    <SyntaxHighlighter
      {...props}
      language={match[1]}
      style={theme === "light" ? materialLight : materialDark}
      customStyle={{
        width: "calc(var(--limit-width) - 32px)",
        border: "1px solid hsl(var(--border))",
        borderRadius: "0.5rem",
      }}
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <code
      className={`${className} text-sm bg-background pb-0.5 px-2 rounded-md inline-flex items-center`}
      {...props}
    >
      {children}
    </code>
  );
}
