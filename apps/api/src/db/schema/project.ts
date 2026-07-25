import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { organization } from "./organizations";
import { time, timeStamp } from "console";

export const project = pgTable('projects', {
    id: uuid().defaultRandom().primaryKey(),
    orgId: uuid('org_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    dbSchema: text('db_schema').notNull().unique(),
    projectUrl: text('project_url').notNull().unique(),
    anonKey: text('anon_key').notNull(),
    serviceRoleKey: text('service_role_key').notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
})
export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;