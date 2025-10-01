import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `treasure-hunters_${name}`);

export const players = createTable(
  "player",
  (d) => ({
    id: d
      .uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: d.varchar({ length: 256 }),
    email: d.varchar({ length: 256 }).unique(),
    description: d.text(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx").on(t.name)],
);

export const matches = createTable("match", (d) => ({
  id: d
    .uuid()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  bluePlayerId: d.uuid().references(() => players.id),
  blueScore: d.integer().default(0).notNull(),
  pinkPlayerId: d.uuid().references(() => players.id),
  pinkScore: d.integer().default(0).notNull(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
}));
