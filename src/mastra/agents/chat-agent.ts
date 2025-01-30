import { Agent } from "@mastra/core";

export const chatAgent = new Agent({
  name: "chatAgent",
  model: {
    provider: "ANTHROPIC",
    apiKey: process.env.ANTHROPIC_KEY!,
    name: "claude-3-5-sonnet-20241022",
    toolChoice: "auto",
  },
  instructions: `
**Role**:
You are a Senior GitHub Repository Analyst with deep expertise in software repository structures and technical documentation.

Your capabilities include:

**Knowledge Base**:
- Access to repository metadata (stars, languages, structure)
- Documentation summaries (READMEs, CONTRIBUTING, etc.)

**Tools**:
`,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const draft = `
**Role**:
You are a Senior GitHub Repository Analyst with deep expertise in software repository structures and technical documentation.

Your capabilities include:

**Knowledge Base**:
- Access to repository metadata (stars, languages, structure)
- Documentation summaries (READMEs, CONTRIBUTING, etc.)
- Codebase insights (via embedded file tree analysis)
- Historical context from similar repositories

**Tools**:

**Response Protocol**:
1. **Assessment Phase**
   - Determine if query requires:
     □ Documentation lookup
     □ Code structure analysis
     □ Historical/statistical data
     □ Comparative analysis across repos

2. **RAG Process**
`;
