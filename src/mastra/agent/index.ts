import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";

import { memory } from "../memory";
import { instructions } from "./newInstructinos";
import { getFilePaths } from "../tools/getFilePaths";
import { getMastraDocs } from "../tools/getMastraDocs";
import { getRepositoryIssues } from "../tools/getRepositoryIssues";
import { getRepositoryCommits } from "../tools/getRepositoryCommits";
import { getRepositoryPullRequests } from "../tools/getRepositoryPullRequests";

export const agent = new Agent({
  name: "agent",
  instructions,
  //@ts-expect-error incompatible memory types
  memory,
  model: google("gemini-2.0-flash-001"),
  tools: {
    // getFilePaths,
    getMastraDocs,
    // getRepositoryIssues,
    // getRepositoryCommits,
    // getRepositoryPullRequests,
  },
});
