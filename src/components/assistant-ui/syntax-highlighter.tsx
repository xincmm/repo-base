import { PrismAsyncLight } from "react-syntax-highlighter";
import { makePrismAsyncLightSyntaxHighlighter } from "@assistant-ui/react-syntax-highlighter";

import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";

import { oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

// register languages you want to support
PrismAsyncLight.registerLanguage("js", tsx);
PrismAsyncLight.registerLanguage("jsx", tsx);
PrismAsyncLight.registerLanguage("ts", typescript);
PrismAsyncLight.registerLanguage("tsx", tsx);
PrismAsyncLight.registerLanguage("python", python);

export const SyntaxHighlighter = makePrismAsyncLightSyntaxHighlighter({
  style: oneLight,
  customStyle: {
    margin: 0,
    width: "100%",
    // background: "transparent",
    padding: "1.5rem 1rem",
  },
});
