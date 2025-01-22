import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { Octokit } from "octokit";

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e.message);
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
}).use(({ next }) => next({ ctx: { gh: new Octokit() } })); // github client

/* TODO:
 * Things to add to the action client's context:
 * - Mastra instance
 * - DB instance
 */
