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

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Cryptocurrencies table for storing crypto data
export const cryptocurrencies = pgTable("cryptocurrencies", {
  id: varchar("id").primaryKey(), // coingecko id
  symbol: varchar("symbol").notNull(),
  name: varchar("name").notNull(),
  currentPrice: decimal("current_price", { precision: 20, scale: 8 }),
  priceChange24h: decimal("price_change_24h", { precision: 10, scale: 4 }),
  priceChangePercentage24h: decimal("price_change_percentage_24h", { precision: 10, scale: 4 }),
  marketCap: decimal("market_cap", { precision: 20, scale: 2 }),
  marketCapRank: integer("market_cap_rank"),
  totalVolume: decimal("total_volume", { precision: 20, scale: 2 }),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// User portfolios
export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name").notNull().default("Main Portfolio"),
  isDefault: boolean("is_default").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User holdings in portfolios
export const holdings = pgTable("holdings", {
  id: serial("id").primaryKey(),
  portfolioId: integer("portfolio_id").references(() => portfolios.id).notNull(),
  cryptoId: varchar("crypto_id").references(() => cryptocurrencies.id).notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  averageCost: decimal("average_cost", { precision: 20, scale: 8 }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transaction history (including admin-simulated ones)
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  portfolioId: integer("portfolio_id").references(() => portfolios.id).notNull(),
  cryptoId: varchar("crypto_id").references(() => cryptocurrencies.id).notNull(),
  type: varchar("type").notNull(), // 'buy', 'sell', 'swap'
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  price: decimal("price", { precision: 20, scale: 8 }).notNull(),
  totalValue: decimal("total_value", { precision: 20, scale: 2 }).notNull(),
  isSimulated: boolean("is_simulated").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// NFT Collections data
export const nftCollections = pgTable("nft_collections", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  slug: varchar("slug").unique().notNull(),
  floorPrice: decimal("floor_price", { precision: 20, scale: 8 }),
  priceChangePercentage24h: decimal("price_change_percentage_24h", { precision: 10, scale: 4 }),
  imageUrl: varchar("image_url"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  portfolios: many(portfolios),
}));

export const portfoliosRelations = relations(portfolios, ({ one, many }) => ({
  user: one(users, {
    fields: [portfolios.userId],
    references: [users.id],
  }),
  holdings: many(holdings),
  transactions: many(transactions),
}));

export const holdingsRelations = relations(holdings, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [holdings.portfolioId],
    references: [portfolios.id],
  }),
  cryptocurrency: one(cryptocurrencies, {
    fields: [holdings.cryptoId],
    references: [cryptocurrencies.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [transactions.portfolioId],
    references: [portfolios.id],
  }),
  cryptocurrency: one(cryptocurrencies, {
    fields: [transactions.cryptoId],
    references: [cryptocurrencies.id],
  }),
}));

// Schema types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertCryptocurrency = typeof cryptocurrencies.$inferInsert;
export type Cryptocurrency = typeof cryptocurrencies.$inferSelect;

export type InsertPortfolio = typeof portfolios.$inferInsert;
export type Portfolio = typeof portfolios.$inferSelect;

export type InsertHolding = typeof holdings.$inferInsert;
export type Holding = typeof holdings.$inferSelect;

export type InsertTransaction = typeof transactions.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;

export type InsertNFTCollection = typeof nftCollections.$inferInsert;
export type NFTCollection = typeof nftCollections.$inferSelect;

// Zod schemas
export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  createdAt: true,
});

export const insertHoldingSchema = createInsertSchema(holdings).omit({
  id: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});
