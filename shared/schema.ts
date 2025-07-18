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
  paymentMethod: varchar("payment_method", { length: 20 }).default("card"),
  paymentStatus: varchar("payment_status", { length: 20 }).default("pending"),
  cryptoPaymentAddress: varchar("crypto_payment_address", { length: 100 }),
  cryptoTxHash: varchar("crypto_tx_hash", { length: 100 }),
  estimatedDelivery: timestamp("estimated_delivery"),
  actualDelivery: timestamp("actual_delivery"),
  scheduledDeliveryDate: timestamp("scheduled_delivery_date"),
  scheduledTimeSlot: varchar("scheduled_time_slot", { length: 20 }), // morning, afternoon, evening
  deliveryPriceAdjustment: decimal("delivery_price_adjustment", { precision: 10, scale: 2 }).default("0"),
  qrCode: text("qr_code"), // Base64 encoded QR code
  qrCodeUrl: varchar("qr_code_url", { length: 500 }), // URL to QR code image
  currentStatus: varchar("current_status", { length: 50 }).notNull().default("created"),
  currentLocation: text("current_location"),
  deliveryInstructions: text("delivery_instructions"),
  signatureRequired: boolean("signature_required").default(false),
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

// Quotes table for customer quotes
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  quoteNumber: varchar("quote_number", { length: 20 }).unique().notNull(),
  customerName: varchar("customer_name", { length: 100 }).notNull(),
  customerEmail: varchar("customer_email", { length: 100 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 20 }),
  senderAddress: text("sender_address").notNull(),
  recipientAddress: text("recipient_address").notNull(),
  packageDescription: text("package_description"),
  weight: decimal("weight", { precision: 10, scale: 2 }),
  dimensions: text("dimensions"),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }).notNull(),
  validUntil: timestamp("valid_until").notNull(),
  status: varchar("status", { length: 20 }).default("pending"), // pending, accepted, expired, converted
  notes: text("notes"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Invoices table
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: varchar("invoice_number", { length: 20 }).unique().notNull(),
  quoteId: integer("quote_id").references(() => quotes.id),
  packageId: integer("package_id").references(() => packages.id),
  customerName: varchar("customer_name", { length: 100 }).notNull(),
  customerEmail: varchar("customer_email", { length: 100 }).notNull(),
  customerAddress: text("customer_address"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).default("0"),
  paymentMethod: varchar("payment_method", { length: 20 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 20 }).default("pending"),
  paidAt: timestamp("paid_at"),
  dueDate: timestamp("due_date").notNull(),
  items: jsonb("items").notNull(), // Array of invoice line items
  notes: text("notes"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notifications table for email/SMS alerts
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  packageId: integer("package_id").references(() => packages.id),
  recipientEmail: varchar("recipient_email", { length: 100 }),
  recipientPhone: varchar("recipient_phone", { length: 20 }),
  type: varchar("type", { length: 30 }).notNull(), // email, sms, push
  subject: varchar("subject", { length: 200 }),
  message: text("message").notNull(),
  status: varchar("status", { length: 20 }).default("pending"), // pending, sent, failed
  sentAt: timestamp("sent_at"),
  errorMessage: text("error_message"),
  autoSend: boolean("auto_send").default(true), // Auto-send on status change
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat messages table for admin-user communication
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 100 }).notNull(), // Unique session identifier
  packageId: integer("package_id").references(() => packages.id), // Optional package reference
  senderId: varchar("sender_id").references(() => users.id), // Admin user ID (null for anonymous users)
  senderType: varchar("sender_type", { length: 20 }).notNull(), // "admin", "user", "bot"
  senderName: varchar("sender_name", { length: 100 }),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  metadata: jsonb("metadata"), // Additional data like attachments, etc.
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

export const quotesRelations = relations(quotes, ({ one, many }) => ({
  creator: one(users, {
    fields: [quotes.createdBy],
    references: [users.id],
  }),
  invoices: many(invoices),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  quote: one(quotes, {
    fields: [invoices.quoteId],
    references: [quotes.id],
  }),
  package: one(packages, {
    fields: [invoices.packageId],
    references: [packages.id],
  }),
  creator: one(users, {
    fields: [invoices.createdBy],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  package: one(packages, {
    fields: [notifications.packageId],
    references: [packages.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  sender: one(users, {
    fields: [chatMessages.senderId],
    references: [users.id],
  }),
  package: one(packages, {
    fields: [chatMessages.packageId],
    references: [packages.id],
  }),
}));

// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type Package = typeof packages.$inferSelect;
export type TrackingEvent = typeof trackingEvents.$inferSelect;
export type Quote = typeof quotes.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;

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

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  quoteNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  invoiceNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type InsertTrackingEvent = z.infer<typeof insertTrackingEventSchema>;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

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
  IBAN: "iban",
  LOCAL_BANK: "local_bank",
  BITCOIN: "bitcoin",
  ETHEREUM: "ethereum",
  USDC: "usdc",
  PAYPAL: "paypal",
  APPLE_PAY: "apple_pay",
} as const;

// Payment status constants
export const PAYMENT_STATUSES = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

// Delivery time slot constants
export const DELIVERY_TIME_SLOTS = {
  MORNING: "morning", // 8AM - 12PM (+$0)
  AFTERNOON: "afternoon", // 12PM - 5PM (+$5)
  EVENING: "evening", // 5PM - 8PM (+$15)
  EXPRESS: "express", // Same day (+$25)
  WEEKEND: "weekend", // Saturday/Sunday (+$20)
} as const;

// Chat sender types
export const CHAT_SENDER_TYPES = {
  ADMIN: "admin",
  USER: "user",
  BOT: "bot",
} as const;

export type PackageStatus = typeof PACKAGE_STATUSES[keyof typeof PACKAGE_STATUSES];
export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];
export type PaymentStatus = typeof PAYMENT_STATUSES[keyof typeof PAYMENT_STATUSES];
export type DeliveryTimeSlot = typeof DELIVERY_TIME_SLOTS[keyof typeof DELIVERY_TIME_SLOTS];
export type ChatSenderType = typeof CHAT_SENDER_TYPES[keyof typeof CHAT_SENDER_TYPES];