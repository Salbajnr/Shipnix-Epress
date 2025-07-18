import {
  users,
  packages,
  trackingEvents,
  quotes,
  invoices,
  notifications,
  chatMessages,
  type User,
  type UpsertUser,
  type Package,
  type TrackingEvent,
  type Quote,
  type Invoice,
  type Notification,
  type ChatMessage,
  type InsertPackage,
  type InsertTrackingEvent,
  type InsertQuote,
  type InsertInvoice,
  type InsertNotification,
  type InsertChatMessage,
  PACKAGE_STATUSES,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import QRCode from 'qrcode';

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Package operations
  createPackage(packageData: InsertPackage): Promise<Package>;
  getPackageByTrackingId(trackingId: string): Promise<Package | undefined>;
  getPackageById(id: number): Promise<Package | undefined>;
  getAllPackages(limit?: number): Promise<Package[]>;
  updatePackageStatus(id: number, status: string, location?: string): Promise<Package>;
  updatePackage(id: number, updates: Partial<InsertPackage>): Promise<Package>;

  // Tracking event operations
  addTrackingEvent(event: InsertTrackingEvent): Promise<TrackingEvent>;
  getTrackingEventsByPackageId(packageId: number): Promise<TrackingEvent[]>;

  // Quote operations
  createQuote(quoteData: InsertQuote): Promise<Quote>;
  getQuoteById(id: number): Promise<Quote | undefined>;
  getQuoteByNumber(quoteNumber: string): Promise<Quote | undefined>;
  getAllQuotes(limit?: number): Promise<Quote[]>;
  updateQuoteStatus(id: number, status: string): Promise<Quote>;

  // Invoice operations
  createInvoice(invoiceData: InsertInvoice): Promise<Invoice>;
  getInvoiceById(id: number): Promise<Invoice | undefined>;
  getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | undefined>;
  getAllInvoices(limit?: number): Promise<Invoice[]>;
  updateInvoicePayment(id: number, paymentStatus: string, paidAt?: Date): Promise<Invoice>;

  // Notification operations
  createNotification(notificationData: InsertNotification): Promise<Notification>;
  getNotificationsByPackageId(packageId: number): Promise<Notification[]>;
  updateNotificationStatus(id: number, status: string, sentAt?: Date, errorMessage?: string): Promise<Notification>;

  // Chat operations
  createChatMessage(messageData: InsertChatMessage): Promise<ChatMessage>;
  getChatMessagesBySessionId(sessionId: string): Promise<ChatMessage[]>;
  getChatMessagesByPackageId(packageId: number): Promise<ChatMessage[]>;
  markChatMessagesAsRead(sessionId: string, senderType?: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
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

  // Package operations
  async createPackage(packageData: InsertPackage): Promise<Package> {
    // Generate unique tracking ID
    const trackingId = this.generateTrackingId();
    
    // Generate QR code for the tracking ID
    const qrCodeDataUrl = await QRCode.toDataURL(trackingId, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Calculate delivery price adjustment based on time slot
    let deliveryPriceAdjustment = 0;
    if (packageData.scheduledTimeSlot) {
      switch (packageData.scheduledTimeSlot) {
        case 'afternoon':
          deliveryPriceAdjustment = 5;
          break;
        case 'evening':
          deliveryPriceAdjustment = 15;
          break;
        case 'express':
          deliveryPriceAdjustment = 25;
          break;
        case 'weekend':
          deliveryPriceAdjustment = 20;
          break;
        default: // morning
          deliveryPriceAdjustment = 0;
      }
    }
    
    const [newPackage] = await db
      .insert(packages)
      .values({
        ...packageData,
        trackingId,
        qrCode: qrCodeDataUrl,
        deliveryPriceAdjustment: deliveryPriceAdjustment.toString(),
        currentStatus: PACKAGE_STATUSES.CREATED,
      })
      .returning();

    // Only add initial tracking event if package is created (payment completed)
    if (newPackage.currentStatus === PACKAGE_STATUSES.CREATED) {
      await this.addTrackingEvent({
        packageId: newPackage.id,
        status: PACKAGE_STATUSES.CREATED,
        location: "Package created in system",
        description: "Package has been registered for shipping after payment confirmation",
      });
    }

    return newPackage;
  }

  async getPackageByTrackingId(trackingId: string): Promise<Package | undefined> {
    const [packageData] = await db
      .select()
      .from(packages)
      .where(eq(packages.trackingId, trackingId));
    return packageData;
  }

  async getPackageById(id: number): Promise<Package | undefined> {
    const [packageData] = await db
      .select()
      .from(packages)
      .where(eq(packages.id, id));
    return packageData;
  }

  async getAllPackages(limit = 50): Promise<Package[]> {
    return await db
      .select()
      .from(packages)
      .orderBy(desc(packages.createdAt))
      .limit(limit);
  }

  async updatePackageStatus(id: number, status: string, location?: string): Promise<Package> {
    const [updatedPackage] = await db
      .update(packages)
      .set({
        currentStatus: status,
        currentLocation: location,
        updatedAt: new Date(),
        ...(status === PACKAGE_STATUSES.DELIVERED && { actualDelivery: new Date() }),
      })
      .where(eq(packages.id, id))
      .returning();

    // Add tracking event for status change
    await this.addTrackingEvent({
      packageId: id,
      status,
      location: location || "",
      description: this.getStatusDescription(status),
    });

    return updatedPackage;
  }

  async updatePackage(id: number, updates: Partial<InsertPackage>): Promise<Package> {
    const [updatedPackage] = await db
      .update(packages)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(packages.id, id))
      .returning();

    return updatedPackage;
  }

  // Tracking event operations
  async addTrackingEvent(event: InsertTrackingEvent): Promise<TrackingEvent> {
    const [newEvent] = await db
      .insert(trackingEvents)
      .values(event)
      .returning();
    return newEvent;
  }

  async getTrackingEventsByPackageId(packageId: number): Promise<TrackingEvent[]> {
    return await db
      .select()
      .from(trackingEvents)
      .where(eq(trackingEvents.packageId, packageId))
      .orderBy(desc(trackingEvents.timestamp));
  }

  // Helper methods
  private generateTrackingId(): string {
    // Generate a tracking ID in format: ST-XXXXXXXXX (ShipTrack-9chars)
    return `ST-${nanoid(9).toUpperCase()}`;
  }

  private getStatusDescription(status: string): string {
    const descriptions = {
      [PACKAGE_STATUSES.CREATED]: "Package has been registered for shipping",
      [PACKAGE_STATUSES.PICKED_UP]: "Package has been picked up by courier",
      [PACKAGE_STATUSES.IN_TRANSIT]: "Package is on its way to destination",
      [PACKAGE_STATUSES.OUT_FOR_DELIVERY]: "Package is out for delivery",
      [PACKAGE_STATUSES.DELIVERED]: "Package has been successfully delivered",
      [PACKAGE_STATUSES.FAILED_DELIVERY]: "Delivery attempt failed",
      [PACKAGE_STATUSES.RETURNED]: "Package is being returned to sender",
    };
    return descriptions[status as keyof typeof descriptions] || "Status updated";
  }

  // Quote operations
  async createQuote(quoteData: InsertQuote): Promise<Quote> {
    const quoteNumber = this.generateQuoteNumber();
    
    const [newQuote] = await db
      .insert(quotes)
      .values({
        ...quoteData,
        quoteNumber,
      })
      .returning();
    
    return newQuote;
  }

  async getQuoteById(id: number): Promise<Quote | undefined> {
    const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
    return quote;
  }

  async getQuoteByNumber(quoteNumber: string): Promise<Quote | undefined> {
    const [quote] = await db.select().from(quotes).where(eq(quotes.quoteNumber, quoteNumber));
    return quote;
  }

  async getAllQuotes(limit = 50): Promise<Quote[]> {
    return await db.select().from(quotes).orderBy(desc(quotes.createdAt)).limit(limit);
  }

  async updateQuoteStatus(id: number, status: string): Promise<Quote> {
    const [updatedQuote] = await db
      .update(quotes)
      .set({ status, updatedAt: new Date() })
      .where(eq(quotes.id, id))
      .returning();
    
    return updatedQuote;
  }

  // Invoice operations
  async createInvoice(invoiceData: InsertInvoice): Promise<Invoice> {
    const invoiceNumber = this.generateInvoiceNumber();
    
    const [newInvoice] = await db
      .insert(invoices)
      .values({
        ...invoiceData,
        invoiceNumber,
      })
      .returning();
    
    return newInvoice;
  }

  async getInvoiceById(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice;
  }

  async getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.invoiceNumber, invoiceNumber));
    return invoice;
  }

  async getAllInvoices(limit = 50): Promise<Invoice[]> {
    return await db.select().from(invoices).orderBy(desc(invoices.createdAt)).limit(limit);
  }

  async updateInvoicePayment(id: number, paymentStatus: string, paidAt?: Date): Promise<Invoice> {
    const [updatedInvoice] = await db
      .update(invoices)
      .set({ 
        paymentStatus, 
        paidAt: paidAt || new Date(),
        updatedAt: new Date() 
      })
      .where(eq(invoices.id, id))
      .returning();
    
    return updatedInvoice;
  }

  // Notification operations
  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notificationData)
      .returning();
    
    return newNotification;
  }

  async getNotificationsByPackageId(packageId: number): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.packageId, packageId))
      .orderBy(desc(notifications.createdAt));
  }

  async updateNotificationStatus(id: number, status: string, sentAt?: Date, errorMessage?: string): Promise<Notification> {
    const [updatedNotification] = await db
      .update(notifications)
      .set({ 
        status, 
        sentAt, 
        errorMessage 
      })
      .where(eq(notifications.id, id))
      .returning();
    
    return updatedNotification;
  }

  // Chat operations
  async createChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db
      .insert(chatMessages)
      .values(messageData)
      .returning();
    return newMessage;
  }

  async getChatMessagesBySessionId(sessionId: string): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(chatMessages.createdAt);
  }

  async getChatMessagesByPackageId(packageId: number): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.packageId, packageId))
      .orderBy(chatMessages.createdAt);
  }

  async markChatMessagesAsRead(sessionId: string, senderType?: string): Promise<void> {
    const whereCondition = senderType 
      ? and(eq(chatMessages.sessionId, sessionId), eq(chatMessages.senderType, senderType))
      : eq(chatMessages.sessionId, sessionId);

    await db
      .update(chatMessages)
      .set({ isRead: true })
      .where(whereCondition);
  }

  // Generate unique tracking ID (ST-XXXXXXXX format)
  private generateTrackingId(): string {
    const prefix = "ST-";
    const randomId = nanoid(8).toUpperCase();
    return prefix + randomId;
  }

  // Generate unique quote number (QT-XXXXXXXX format)
  private generateQuoteNumber(): string {
    const timestamp = Date.now().toString().slice(-8);
    return `QT-${timestamp}`;
  }

  // Generate unique invoice number (INV-XXXXXXXX format)
  private generateInvoiceNumber(): string {
    const timestamp = Date.now().toString().slice(-8);
    return `INV-${timestamp}`;
  }
}

export const storage = new DatabaseStorage();