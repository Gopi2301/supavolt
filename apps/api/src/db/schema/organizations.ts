import { pgTable, pgEnum, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from './users';
import { time, timeStamp } from "console";

export const orgRoleEnum = pgEnum('org_role', ['admin', 'developer']);
export const organization = pgTable('organizations', {
    id: uuid().defaultRandom().primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export const orgMembers = pgTable('org_members', {
    id: uuid().defaultRandom().primaryKey(),
    orgId: uuid('org_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    role: orgRoleEnum('role').notNull().default('developer'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
export type Organization = typeof organization.$inferSelect;
export type NewOrganization = typeof organization.$inferInsert;
export type OrgMember = typeof orgMembers.$inferSelect;
export type NewOrgMember = typeof orgMembers.$inferInsert;