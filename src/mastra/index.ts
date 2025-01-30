import { Logger, Mastra } from "@mastra/core";
import { documentationProcessingWorkflow } from "./workflows/documentation-processing";
import { PgMemory } from "@mastra/memory";
import { PgVector } from "@mastra/vector-pg";
import { chatAgent } from "./agents/chat-agent";

export const mastra = new Mastra({
  vectors: { pgVector: new PgVector(process.env.DATABASE_URL!) },
  memory: new PgMemory({ connectionString: process.env.DATABASE_URL! }),
  logger: new Logger({
    level: process.env.NODE_ENV === "development" ? "debug" : "info",
  }),
  agents: {
    chatAgent,
  },
  workflows: {
    documentationProcessingWorkflow,
  },
});
