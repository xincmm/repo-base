import { PostgresStore } from "@mastra/pg";
import { Logger, Mastra } from "@mastra/core";
import { Memory } from "@mastra/memory";

import { chatAgent } from "./agents/chat-agent";
import { repoExplorer } from "./agents/repo-explorer";

const memory = new Memory({
  //@ts-expect-error logger property issue
  storage: new PostgresStore({
    connectionString: process.env.DATABASE_URL!,
  }),
});

export const mastra = new Mastra({
  memory,
  logger: new Logger({
    level: process.env.NODE_ENV === "development" ? "debug" : "info",
  }),
  agents: {
    chatAgent,
    repoExplorer,
  },
});
