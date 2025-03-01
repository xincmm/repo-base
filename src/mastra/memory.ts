import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/core/storage/libsql";

export const memory = new Memory({
  storage: new LibSQLStore({
    config: {
      url: process.env.DB_URL!,
    },
  }),
  options: { lastMessages: 5, semanticRecall: false },
});
