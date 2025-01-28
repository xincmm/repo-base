import { Logger, Mastra } from "@mastra/core";
import { fileProcessingWorkflow } from "./workflows/file-processing";

export const mastra = new Mastra({
  logger: new Logger({
    level: process.env.NODE_ENV === "development" ? "debug" : "info",
  }),
  workflows: {
    fileProcessingWorkflow,
  },
});
