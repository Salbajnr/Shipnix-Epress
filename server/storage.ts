import {
  users,
  cryptocurrencies,
  portfolios,
  holdings,
  transactions,
  nftCollections,
  type User,
  type UpsertUser,
  type Cryptocurrency,
  type InsertCryptocurrency,
  type Portfolio,
  type InsertPortfolio,
  type Holding,
  type InsertHolding,
  type Transaction,
  type InsertTransaction,
  type NFTCollection,
  type InsertNFTCollection,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Cryptocurrency operations
  upsertCryptocurrency(crypto: InsertCryptocurrency): Promise<Cryptocurrency>;
  getCryptocurrencies(): Promise<Cryptocurrency[]>;
  getTopCryptocurrencies(limit?: number): Promise<Cryptocurrency[]>;

  // Portfolio operations
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  getPortfolioByUserId(userId: string): Promise<Portfolio | undefined>;
  
  // Holdings operations
  upsertHolding(holding: InsertHolding): Promise<Holding>;
  getHoldingsByPortfolioId(portfolioId: number): Promise<(Holding & { cryptocurrency: Cryptocurrency })[]>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByPortfolioId(portfolioId: number, limit?: number): Promise<(Transaction & { cryptocurrency: Cryptocurrency })[]>;
  
  // NFT operations
  upsertNFTCollection(nft: InsertNFTCollection): Promise<NFTCollection>;
  getTopNFTCollections(limit?: number): Promise<NFTCollection[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Cryptocurrency operations
  async upsertCryptocurrency(crypto: InsertCryptocurrency): Promise<Cryptocurrency> {
    const [cryptocurrency] = await db
      .insert(cryptocurrencies)
      .values(crypto)
      .onConflictDoUpdate({
        target: cryptocurrencies.id,
        set: {
          ...crypto,
          lastUpdated: new Date(),
        },
      })
      .returning();
    return cryptocurrency;
  }

  async getCryptocurrencies(): Promise<Cryptocurrency[]> {
    return await db.select().from(cryptocurrencies);
  }

  async getTopCryptocurrencies(limit = 10): Promise<Cryptocurrency[]> {
    return await db
      .select()
      .from(cryptocurrencies)
      .orderBy(cryptocurrencies.marketCapRank)
      .limit(limit);
  }

  // Portfolio operations
  async createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio> {
    const [newPortfolio] = await db.insert(portfolios).values(portfolio).returning();
    return newPortfolio;
  }

  async getPortfolioByUserId(userId: string): Promise<Portfolio | undefined> {
    const [portfolio] = await db
      .select()
      .from(portfolios)
      .where(and(eq(portfolios.userId, userId), eq(portfolios.isDefault, true)));
    return portfolio;
  }

  // Holdings operations
  async upsertHolding(holding: InsertHolding): Promise<Holding> {
    const [existingHolding] = await db
      .select()
      .from(holdings)
      .where(
        and(
          eq(holdings.portfolioId, holding.portfolioId),
          eq(holdings.cryptoId, holding.cryptoId)
        )
      );

    if (existingHolding) {
      const [updatedHolding] = await db
        .update(holdings)
        .set({
          amount: holding.amount,
          averageCost: holding.averageCost,
          updatedAt: new Date(),
        })
        .where(eq(holdings.id, existingHolding.id))
        .returning();
      return updatedHolding;
    } else {
      const [newHolding] = await db.insert(holdings).values(holding).returning();
      return newHolding;
    }
  }

  async getHoldingsByPortfolioId(portfolioId: number): Promise<(Holding & { cryptocurrency: Cryptocurrency })[]> {
    return await db
      .select({
        id: holdings.id,
        portfolioId: holdings.portfolioId,
        cryptoId: holdings.cryptoId,
        amount: holdings.amount,
        averageCost: holdings.averageCost,
        updatedAt: holdings.updatedAt,
        cryptocurrency: cryptocurrencies,
      })
      .from(holdings)
      .leftJoin(cryptocurrencies, eq(holdings.cryptoId, cryptocurrencies.id))
      .where(eq(holdings.portfolioId, portfolioId));
  }

  // Transaction operations
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values(transaction).returning();
    return newTransaction;
  }

  async getTransactionsByPortfolioId(portfolioId: number, limit = 10): Promise<(Transaction & { cryptocurrency: Cryptocurrency })[]> {
    return await db
      .select({
        id: transactions.id,
        portfolioId: transactions.portfolioId,
        cryptoId: transactions.cryptoId,
        type: transactions.type,
        amount: transactions.amount,
        price: transactions.price,
        totalValue: transactions.totalValue,
        isSimulated: transactions.isSimulated,
        createdAt: transactions.createdAt,
        cryptocurrency: cryptocurrencies,
      })
      .from(transactions)
      .leftJoin(cryptocurrencies, eq(transactions.cryptoId, cryptocurrencies.id))
      .where(eq(transactions.portfolioId, portfolioId))
      .orderBy(desc(transactions.createdAt))
      .limit(limit);
  }

  // NFT operations
  async upsertNFTCollection(nft: InsertNFTCollection): Promise<NFTCollection> {
    const [nftCollection] = await db
      .insert(nftCollections)
      .values(nft)
      .onConflictDoUpdate({
        target: nftCollections.slug,
        set: {
          ...nft,
          lastUpdated: new Date(),
        },
      })
      .returning();
    return nftCollection;
  }

  async getTopNFTCollections(limit = 10): Promise<NFTCollection[]> {
    return await db
      .select()
      .from(nftCollections)
      .orderBy(desc(nftCollections.floorPrice))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
