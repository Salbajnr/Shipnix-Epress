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
  paymentMethod: varchar("payment_method", { length: 20 }).default("cash"),
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  packages: many(packages),
}));

export const packagesRelations = relations(packages, ({ one, many }) => ({
  creator: one(users, {
    fields: [packages.createdBy],
    references: [users.id],
  }),
  trackingEvents: many(trackingEvents),
}));

export const trackingEventsRelations = relations(trackingEvents, ({ one }) => ({
  package: one(packages, {
    fields: [trackingEvents.packageId],
    references: [packages.id],
  }),
}));

// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type Package = typeof packages.$inferSelect;
export type TrackingEvent = typeof trackingEvents.$inferSelect;

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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type InsertTrackingEvent = z.infer<typeof insertTrackingEventSchema>;

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
  CASH: "cash",
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

export type PackageStatus = typeof PACKAGE_STATUSES[keyof typeof PACKAGE_STATUSES];
export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];
export type PaymentStatus = typeof PAYMENT_STATUSES[keyof typeof PAYMENT_STATUSES];