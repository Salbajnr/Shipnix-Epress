import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  decimal,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { length: 20 }).default("customer"),
  companyName: varchar("company_name", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 50 }),
  country: varchar("country", { length: 50 }),
  postalCode: varchar("postal_code", { length: 20 }),
  preferredPaymentMethod: varchar("preferred_payment_method", { length: 20 }),
  isActive: boolean("is_active").default(true),
  emailVerified: boolean("email_verified").default(false),
  phoneVerified: boolean("phone_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Shipping and tracking tables
export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  trackingId: varchar("tracking_id", { length: 20 }).unique().notNull(),
  senderName: varchar("sender_name", { length: 100 }).notNull(),
  senderAddress: text("sender_address").notNull(),
  senderPhone: varchar("sender_phone", { length: 20 }),
  senderEmail: varchar("sender_email", { length: 100 }),
  recipientName: varchar("recipient_name", { length: 100 }).notNull(),
  recipientAddress: text("recipient_address").notNull(),
  recipientPhone: varchar("recipient_phone", { length: 20 }),
  recipientEmail: varchar("recipient_email", { length: 100 }),
  packageDescription: text("package_description"),
  weight: decimal("weight", { precision: 10, scale: 2 }), // in kg
  dimensions: text("dimensions"), // LxWxH format
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }),
  paymentMethod: varchar("payment_method", { length: 20 }).default("card"),
  paymentStatus: varchar("payment_status", { length: 20 }).default("pending"),
  cryptoPaymentAddress: varchar("crypto_payment_address", { length: 100 }),
  cryptoTxHash: varchar("crypto_tx_hash", { length: 100 }),
  estimatedDelivery: timestamp("estimated_delivery"),
  actualDelivery: timestamp("actual_delivery"),
  currentStatus: varchar("current_status", { length: 50 }).notNull().default("created"),
  currentLocation: text("current_location"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const trackingEvents = pgTable("tracking_events", {
  id: serial("id").primaryKey(),
  packageId: integer("package_id").references(() => packages.id).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  location: text("location"),
  description: text("description"),
  timestamp: timestamp("timestamp").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Address book for users
export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  label: varchar("label", { length: 50 }).notNull(), // e.g., "Home", "Office", "Warehouse"
  name: varchar("name", { length: 100 }).notNull(),
  company: varchar("company", { length: 100 }),
  addressLine1: text("address_line1").notNull(),
  addressLine2: text("address_line2"),
  city: varchar("city", { length: 50 }).notNull(),
  state: varchar("state", { length: 50 }),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  country: varchar("country", { length: 50 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 100 }),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Shipping quotes and rates
export const shippingQuotes = pgTable("shipping_quotes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  packageDetails: jsonb("package_details").notNull(), // weight, dimensions, value
  serviceType: varchar("service_type", { length: 30 }).notNull(), // express, standard, economy
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }).notNull(),
  estimatedDays: integer("estimated_days").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  isAccepted: boolean("is_accepted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Service areas and zones
export const serviceZones = pgTable("service_zones", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  country: varchar("country", { length: 50 }).notNull(),
  cities: text("cities").array(), // Array of cities covered
  postalCodes: text("postal_codes").array(), // Array of postal codes
  serviceTypes: text("service_types").array(), // Available services in this zone
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications for users
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  packageId: integer("package_id").references(() => packages.id),
  type: varchar("type", { length: 30 }).notNull(), // package_update, delivery_notification, etc.
  title: varchar("title", { length: 100 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Support tickets
export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  packageId: integer("package_id").references(() => packages.id),
  subject: varchar("subject", { length: 200 }).notNull(),
  description: text("description").notNull(),
  status: varchar("status", { length: 20 }).default("open"), // open, in_progress, resolved, closed
  priority: varchar("priority", { length: 20 }).default("medium"), // low, medium, high, urgent
  assignedTo: varchar("assigned_to").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Support ticket messages
export const supportMessages = pgTable("support_messages", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").references(() => supportTickets.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  isInternal: boolean("is_internal").default(false), // for admin-only notes
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  packages: many(packages),
  addresses: many(addresses),
  notifications: many(notifications),
  supportTickets: many(supportTickets),
  supportMessages: many(supportMessages),
  shippingQuotes: many(shippingQuotes),
}));

export const packagesRelations = relations(packages, ({ one, many }) => ({
  creator: one(users, {
    fields: [packages.createdBy],
    references: [users.id],
  }),
  trackingEvents: many(trackingEvents),
  notifications: many(notifications),
}));

export const trackingEventsRelations = relations(trackingEvents, ({ one }) => ({
  package: one(packages, {
    fields: [trackingEvents.packageId],
    references: [packages.id],
  }),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));

export const shippingQuotesRelations = relations(shippingQuotes, ({ one }) => ({
  user: one(users, {
    fields: [shippingQuotes.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  package: one(packages, {
    fields: [notifications.packageId],
    references: [packages.id],
  }),
}));

export const supportTicketsRelations = relations(supportTickets, ({ one, many }) => ({
  user: one(users, {
    fields: [supportTickets.userId],
    references: [users.id],
  }),
  assignedUser: one(users, {
    fields: [supportTickets.assignedTo],
    references: [users.id],
  }),
  package: one(packages, {
    fields: [supportTickets.packageId],
    references: [packages.id],
  }),
  messages: many(supportMessages),
}));

export const supportMessagesRelations = relations(supportMessages, ({ one }) => ({
  ticket: one(supportTickets, {
    fields: [supportMessages.ticketId],
    references: [supportTickets.id],
  }),
  user: one(users, {
    fields: [supportMessages.userId],
    references: [users.id],
  }),
}));

// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type Package = typeof packages.$inferSelect;
export type TrackingEvent = typeof trackingEvents.$inferSelect;
export type Address = typeof addresses.$inferSelect;
export type ShippingQuote = typeof shippingQuotes.$inferSelect;
export type ServiceZone = typeof serviceZones.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type SupportTicket = typeof supportTickets.$inferSelect;
export type SupportMessage = typeof supportMessages.$inferSelect;

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
  trackingId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTrackingEventSchema = createInsertSchema(trackingEvents).omit({
  id: true,
  createdAt: true,
});

export const insertAddressSchema = createInsertSchema(addresses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertShippingQuoteSchema = createInsertSchema(shippingQuotes).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSupportMessageSchema = createInsertSchema(supportMessages).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type InsertTrackingEvent = z.infer<typeof insertTrackingEventSchema>;
export type InsertAddress = z.infer<typeof insertAddressSchema>;
export type InsertShippingQuote = z.infer<typeof insertShippingQuoteSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type InsertSupportMessage = z.infer<typeof insertSupportMessageSchema>;

// Package status constants
export const PACKAGE_STATUSES = {
  CREATED: "created",
  PICKED_UP: "picked_up",
  IN_TRANSIT: "in_transit",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
  FAILED_DELIVERY: "failed_delivery",
  RETURNED: "returned",
} as const;

// Payment method constants
export const PAYMENT_METHODS = {
  CARD: "card",
  BANK_TRANSFER: "bank_transfer",
  BITCOIN: "bitcoin",
  ETHEREUM: "ethereum",
  USDC: "usdc",
  PAYPAL: "paypal",
} as const;

// Payment status constants
export const PAYMENT_STATUSES = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

// User roles
export const USER_ROLES = {
  CUSTOMER: "customer",
  ADMIN: "admin",
  SUPPORT: "support",
  AGENT: "agent",
} as const;

// Service types
export const SERVICE_TYPES = {
  EXPRESS: "express",
  STANDARD: "standard",
  ECONOMY: "economy",
  OVERNIGHT: "overnight",
  SAME_DAY: "same_day",
} as const;

// Support ticket statuses
export const TICKET_STATUSES = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  CLOSED: "closed",
} as const;

// Support ticket priorities
export const TICKET_PRIORITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;

// Notification types
export const NOTIFICATION_TYPES = {
  PACKAGE_UPDATE: "package_update",
  DELIVERY_NOTIFICATION: "delivery_notification",
  PAYMENT_CONFIRMATION: "payment_confirmation",
  SUPPORT_UPDATE: "support_update",
  SYSTEM_ANNOUNCEMENT: "system_announcement",
} as const;

export type PackageStatus = typeof PACKAGE_STATUSES[keyof typeof PACKAGE_STATUSES];
export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];
export type PaymentStatus = typeof PAYMENT_STATUSES[keyof typeof PAYMENT_STATUSES];
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type ServiceType = typeof SERVICE_TYPES[keyof typeof SERVICE_TYPES];
export type TicketStatus = typeof TICKET_STATUSES[keyof typeof TICKET_STATUSES];
export type TicketPriority = typeof TICKET_PRIORITIES[keyof typeof TICKET_PRIORITIES];
export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];