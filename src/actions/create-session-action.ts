"use server";

import { z } from "zod";
import { actionClient } from ".";
import { sessions } from "@/db/schema/sessions";

export const createSessionAction = actionClient
  .schema(z.object({ sessionId: z.string() }))
  .action(async ({ ctx, parsedInput }) => {
    await ctx.db
      .insert(sessions)
      .values({ id: parsedInput.sessionId })
      .onConflictDoNothing({
        target: sessions.id,
      });
  });
