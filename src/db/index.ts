import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sessions, sessionsRelations } from "./schema/sessions";
import { repos, reposRelations } from "./schema/repos";
import { sessionRepos, sessionReposRelations } from "./schema/session-repos";
import { repoLanguages, repoLanguagesRelations } from "./schema/repo-languages";

const client = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle({
  client,
  schema: {
    sessions,
    sessionsRelations,
    repos,
    reposRelations,
    sessionRepos,
    sessionReposRelations,
    repoLanguages,
    repoLanguagesRelations,
  },
});
