import { db } from "@/db";
import { gh } from "@/lib/utils";
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
  .use(({ next }) => next({ ctx: { gh } })) // github client
  .use(({ next }) => next({ ctx: { db } })); // drizzle client

/* TODO:
 * Things to add to the action client's context:
 * - Mastra instance
 */
