import {
  users,
  packages,
  trackingEvents,
  addresses,
  notifications,
  supportTickets,
  supportMessages,
  shippingQuotes,
  type User,
  type UpsertUser,
  type Package,
  type TrackingEvent,
  type Address,
  type Notification,
  type SupportTicket,
  type SupportMessage,
  type ShippingQuote,
  type InsertPackage,
  type InsertTrackingEvent,
  type InsertAddress,
  type InsertNotification,
  type InsertSupportTicket,
  type InsertSupportMessage,
  type InsertShippingQuote,
  PACKAGE_STATUSES,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, or } from "drizzle-orm";
import { nanoid } from "nanoid";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserProfile(id: string, updates: Partial<User>): Promise<User>;

  // Package operations
  createPackage(packageData: InsertPackage): Promise<Package>;
  getPackageByTrackingId(trackingId: string): Promise<Package | undefined>;
  getPackageById(id: number): Promise<Package | undefined>;
  getAllPackages(limit?: number): Promise<Package[]>;
  getUserPackages(userId: string): Promise<Package[]>;
  updatePackageStatus(id: number, status: string, location?: string): Promise<Package>;
  updatePackage(id: number, updates: Partial<InsertPackage>): Promise<Package>;

  // Tracking event operations
  addTrackingEvent(event: InsertTrackingEvent): Promise<TrackingEvent>;
  getTrackingEventsByPackageId(packageId: number): Promise<TrackingEvent[]>;

  // Address operations
  createAddress(addressData: InsertAddress): Promise<Address>;
  getUserAddresses(userId: string): Promise<Address[]>;
  updateAddress(id: number, updates: Partial<InsertAddress>): Promise<Address>;
  deleteAddress(id: number): Promise<void>;

  // Notification operations
  createNotification(notificationData: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: string): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<void>;

  // Support operations
  createSupportTicket(ticketData: InsertSupportTicket): Promise<SupportTicket>;
  getAllSupportTickets(): Promise<SupportTicket[]>;
  getUserSupportTickets(userId: string): Promise<SupportTicket[]>;
  updateSupportTicket(id: number, updates: Partial<SupportTicket>): Promise<SupportTicket>;

  // Shipping quote operations
  createShippingQuote(quoteData: InsertShippingQuote): Promise<ShippingQuote>;
  getUserShippingQuotes(userId: string): Promise<ShippingQuote[]>;
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

  async getAllUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));
  }

  async updateUserProfile(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Package operations
  async createPackage(packageData: InsertPackage): Promise<Package> {
    // Generate unique tracking ID
    const trackingId = this.generateTrackingId();
    
    const [newPackage] = await db
      .insert(packages)
      .values({
        ...packageData,
        trackingId,
        currentStatus: PACKAGE_STATUSES.CREATED,
      })
      .returning();

    // Add initial tracking event
    await this.addTrackingEvent({
      packageId: newPackage.id,
      status: PACKAGE_STATUSES.CREATED,
      location: "Package created in system",
      description: "Package has been registered for shipping",
    });

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

  async getUserPackages(userId: string): Promise<Package[]> {
    return await db
      .select()
      .from(packages)
      .where(eq(packages.createdBy, userId))
      .orderBy(desc(packages.createdAt));
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

  // Address operations
  async createAddress(addressData: InsertAddress): Promise<Address> {
    const [address] = await db
      .insert(addresses)
      .values(addressData)
      .returning();
    return address;
  }

  async getUserAddresses(userId: string): Promise<Address[]> {
    return await db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, userId))
      .orderBy(desc(addresses.createdAt));
  }

  async updateAddress(id: number, updates: Partial<InsertAddress>): Promise<Address> {
    const [address] = await db
      .update(addresses)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(addresses.id, id))
      .returning();
    return address;
  }

  async deleteAddress(id: number): Promise<void> {
    await db.delete(addresses).where(eq(addresses.id, id));
  }

  // Notification operations
  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(notificationData)
      .returning();
    return notification;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: number): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }

  // Support operations
  async createSupportTicket(ticketData: InsertSupportTicket): Promise<SupportTicket> {
    const [ticket] = await db
      .insert(supportTickets)
      .values(ticketData)
      .returning();
    return ticket;
  }

  async getAllSupportTickets(): Promise<SupportTicket[]> {
    return await db
      .select()
      .from(supportTickets)
      .orderBy(desc(supportTickets.createdAt));
  }

  async getUserSupportTickets(userId: string): Promise<SupportTicket[]> {
    return await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.userId, userId))
      .orderBy(desc(supportTickets.createdAt));
  }

  async updateSupportTicket(id: number, updates: Partial<SupportTicket>): Promise<SupportTicket> {
    const [ticket] = await db
      .update(supportTickets)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(supportTickets.id, id))
      .returning();
    return ticket;
  }

  // Shipping quote operations
  async createShippingQuote(quoteData: InsertShippingQuote): Promise<ShippingQuote> {
    const [quote] = await db
      .insert(shippingQuotes)
      .values(quoteData)
      .returning();
    return quote;
  }

  async getUserShippingQuotes(userId: string): Promise<ShippingQuote[]> {
    return await db
      .select()
      .from(shippingQuotes)
      .where(eq(shippingQuotes.userId, userId))
      .orderBy(desc(shippingQuotes.createdAt));
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
}

export const storage = new DatabaseStorage();