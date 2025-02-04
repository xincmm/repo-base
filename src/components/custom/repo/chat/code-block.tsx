"use client";

// import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  node: unknown;
  className: string;
  children: React.ReactNode;
}

export function CodeBlock({
  className,
  children,
  node,
  ...props
}: CodeBlockProps) {
  // const [output] = useState<string | null>(null);
  // const [tab] = useState<"code" | "run">("code");

  const match = /language-(\w+)/.exec(className || "");

  return match ? (
    <SyntaxHighlighter
      {...props}
      language={match[1]}
      style={dracula}
      customStyle={{
        width: "calc(var(--limit-width) - 32px)",
        background: "hsl(var(--background))",
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

  // if (!inline) {
  //   return (
  //     <span className="not-prose flex flex-col">
  //       {tab === "code" && (
  //         <pre
  //           {...props}
  //           className={`text-sm w-full overflow-x-auto dark:bg-zinc-900 p-4 dark:border-zinc-700 rounded-xl dark:text-zinc-50 text-zinc-900`}
  //         >
  //           <code className="whitespace-pre-wrap break-words">{children}</code>
  //         </pre>
  //       )}
  //
  //       {tab === "run" && output && (
  //         <div className="text-sm w-full overflow-x-auto bg-zinc-800 dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-700 border-t-0 rounded-b-xl text-zinc-50">
  //           <code>{output}</code>
  //         </div>
  //       )}
  //     </span>
  //   );
  // } else {
  //   return (
  //     <code
  //       className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md`}
  //       {...props}
  //     >
  //       {children}
  //     </code>
  //   );
  // }
}
