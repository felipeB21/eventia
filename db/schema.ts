import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";

export const eventCategoryEnum = pgEnum("event_category", [
  "deportes",
  "musica",
  "aire_libre",
  "fiesta",
  "teatro",
  "show",
  "politica",
  "vehiculos",
  "futbol",
  "basket",
  "running",
  "ciclismo",
  "carreras",
  "escenario",
  "ajedrez",
]);

export const eventCancellationReasonEnum = pgEnum("event_cancellation_reason", [
  "clima",
  "fuerza_mayor",
  "problema_tecnico",
  "seguridad",
  "baja_asistencia",
  "conflicto_agenda",
  "motivo_personal",
  "otro",
]);

export const eventStatusEnum = pgEnum("event_status", [
  "active",
  "canceled",
  "finished",
]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [index("session_user_idx").on(t.userId)]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [index("account_user_idx").on(t.userId)]
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)]
);

export const event = pgTable(
  "event",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    location: text("location").notNull(),
    image: text("image").notNull(),

    status: eventStatusEnum("status").default("active").notNull(),
    category: eventCategoryEnum("category").notNull(),
    eventVerified: boolean("event_verified").default(false).notNull(),
    startsAt: timestamp("starts_at").notNull(),
    endsAt: timestamp("ends_at"),

    creatorId: text("creator_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    index("event_creator_idx").on(t.creatorId),
    index("event_starts_at_idx").on(t.startsAt),
    index("event_status_idx").on(t.status),
  ]
);

export const eventAttendee = pgTable(
  "event_attendee",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    eventId: text("event_id")
      .notNull()
      .references(() => event.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.eventId] }),
    index("event_attendee_user_idx").on(t.userId),
    index("event_attendee_event_idx").on(t.eventId),
  ]
);

export const eventVerificationRequest = pgTable(
  "event_verification_request",
  {
    id: text("id").primaryKey(),

    eventId: text("event_id")
      .notNull()
      .references(() => event.id, { onDelete: "cascade" }),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    contactEmail: text("contact_email").notNull(),
    contactName: text("contact_name").notNull(),
    message: text("message"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("event_verification_event_idx").on(t.eventId),
    index("event_verification_user_idx").on(t.userId),
  ]
);

export const eventCancellation = pgTable(
  "event_cancellation",
  {
    id: text("id").primaryKey(),

    eventId: text("event_id")
      .notNull()
      .references(() => event.id, { onDelete: "cascade" }),

    canceledByUserId: text("canceled_by_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    reason: eventCancellationReasonEnum("reason").notNull(),
    description: text("description"),

    canceledAt: timestamp("canceled_at").defaultNow().notNull(),
  },
  (t) => [
    index("event_cancellation_event_idx").on(t.eventId),
    index("event_cancellation_reason_idx").on(t.reason),
    index("event_cancellation_unique").on(t.eventId),
  ]
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  createdEvents: many(event),
  joinedEvents: many(eventAttendee),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const eventRelations = relations(event, ({ one, many }) => ({
  creator: one(user, {
    fields: [event.creatorId],
    references: [user.id],
  }),
  attendees: many(eventAttendee),
  cancellation: one(eventCancellation),
}));

export const eventAttendeeRelations = relations(eventAttendee, ({ one }) => ({
  user: one(user, {
    fields: [eventAttendee.userId],
    references: [user.id],
  }),
  event: one(event, {
    fields: [eventAttendee.eventId],
    references: [event.id],
  }),
}));

export const eventVerificationRelations = relations(
  eventVerificationRequest,
  ({ one }) => ({
    event: one(event, {
      fields: [eventVerificationRequest.eventId],
      references: [event.id],
    }),
    user: one(user, {
      fields: [eventVerificationRequest.userId],
      references: [user.id],
    }),
  })
);

export const eventCancellationRelations = relations(
  eventCancellation,
  ({ one }) => ({
    event: one(event, {
      fields: [eventCancellation.eventId],
      references: [event.id],
    }),
    canceledBy: one(user, {
      fields: [eventCancellation.canceledByUserId],
      references: [user.id],
    }),
  })
);
