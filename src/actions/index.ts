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
  .use(({ next }) => next({ ctx: { mastra } })) // mastra client
  .use(({ next }) => next({ ctx: { gh } })) // github client
  .use(({ next }) => next({ ctx: { db } })); // drizzle client
