import { Agent } from "@mastra/core/agent";
import { queryDocumentation } from "../tools/query-documentation";

export const chatAgent = new Agent({
  name: "chatAgent",
  model: {
    provider: "ANTHROPIC",
    apiKey: process.env.ANTHROPIC_KEY!,
    name: "claude-3-5-sonnet-20241022",
    toolChoice: "auto",
  },
  tools: {
    queryDocumentation,
  },
  instructions: `
**Role**:
You are a Senior GitHub Repository Analyst with deep expertise in software repository structures and technical documentation.

Your capabilities include:

**Knowledge Base**:
- Access to repository metadata (stars, languages, structure)
- Documentation summaries (READMEs, CONTRIBUTING, etc.)
`,
});
