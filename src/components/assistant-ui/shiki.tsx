import type { ReactNode } from "react";
import ShikiHighlighter, { type Element } from "react-shiki";

interface CodeHighlightProps {
  className?: string | undefined;
  children?: ReactNode | undefined;
  node?: Element | undefined;
}

export const CodeHighlight = ({ className, children, node, ...props }: CodeHighlightProps) => {
  const match = className?.match(/language-(\w+)/);
  const language = match ? match[1] : undefined;

  console.log(children);

  return (
    <ShikiHighlighter language={language} theme={"houston"} {...props}>
      {String(children).trim()}
    </ShikiHighlighter>
  );
};
