import { relations, sql } from "drizzle-orm";
import { index, pgEnum, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `treasure-hunters_${name}`);

export const adminUsers = createTable("admin_user", (d) => ({
  id: d
    .uuid()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: d.varchar("name", { length: 256 }).notNull(),
  passwordHash: d.varchar("password_hash", { length: 256 }).notNull(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

export type AdminUser = typeof adminUsers.$inferSelect;

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

    registeredByAdminId: d
      .uuid()
      .references(() => adminUsers.id, { onDelete: "set null" }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx").on(t.name)],
);

export type Player = typeof players.$inferSelect;

export const playersRelations = relations(players, ({ one }) => ({
  registeredByAdmin: one(adminUsers, {
    fields: [players.registeredByAdminId],
    references: [adminUsers.id],
  }),
}));

export const matchStatusEnum = pgEnum("match_status", ["PENDING", "COMPLETED"]);

export const matches = createTable("match", (d) => ({
  id: d
    .uuid()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  bluePlayerId: d
    .uuid()
    .references(() => players.id)
    .notNull(),
  pinkPlayerId: d
    .uuid()
    .references(() => players.id)
    .notNull(),

  blueScore: d.integer(),
  pinkScore: d.integer(),

  status: matchStatusEnum("status").default("PENDING").notNull(),
  durationInSeconds: d.integer(),

  startedByAdminId: d
    .uuid()
    .references(() => adminUsers.id, { onDelete: "set null" }),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
}));

export type Match = typeof matches.$inferSelect;

export const matchCollectedItems = createTable("match_collected_item", (d) => ({
  id: d
    .uuid()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  matchId: d
    .uuid()
    .references(() => matches.id, { onDelete: "cascade" })
    .notNull(),
  depositedByPlayerId: d
    .uuid()
    .references(() => players.id)
    .notNull(),
  depositedAtPlayerId: d
    .uuid()
    .references(() => players.id)
    .notNull(),
  itemId: d.varchar("item_id", { length: 256 }).notNull(),
}));

export type MatchCollectedItem = typeof matchCollectedItems.$inferSelect;

export const matchesRelations = relations(matches, ({ one, many }) => ({
  bluePlayer: one(players, {
    fields: [matches.bluePlayerId],
    references: [players.id],
    relationName: "blue_player",
  }),
  pinkPlayer: one(players, {
    fields: [matches.pinkPlayerId],
    references: [players.id],
    relationName: "pink_player",
  }),
  collectedItems: many(matchCollectedItems),
  startedByAdmin: one(adminUsers, {
    fields: [matches.startedByAdminId],
    references: [adminUsers.id],
  }),
}));

export const itemsRelations = relations(matchCollectedItems, ({ one }) => ({
  match: one(matches, {
    fields: [matchCollectedItems.matchId],
    references: [matches.id],
  }),
  depositingPlayer: one(players, {
    fields: [matchCollectedItems.depositedByPlayerId],
    references: [players.id],
    relationName: "depositing_player",
  }),
  depositedAtPlayer: one(players, {
    fields: [matchCollectedItems.depositedAtPlayerId],
    references: [players.id],
    relationName: "deposited_at_player",
  }),
}));
