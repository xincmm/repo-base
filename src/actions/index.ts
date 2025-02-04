import { db } from "@/db";
import { gh } from "@/lib/utils";
import { mastra } from "@/mastra";
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e.message);
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
})
  .use(async ({ next }) => {
    const start = performance.now();
    try {
      return await next();
    } finally {
      const duration = performance.now() - start;
      console.log(
        `ACTION: ${duration < 1000 ? `${Math.round(duration)}ms` : `${(duration / 1000).toFixed(2)}s`}`,
      );
    }
  })
  .use(({ next }) => next({ ctx: { mastra } })) // mastra client
  .use(({ next }) => next({ ctx: { gh } })) // github client
  .use(({ next }) => next({ ctx: { db } })); // drizzle client
