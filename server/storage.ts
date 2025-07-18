import {
  users,
  packages,
  trackingEvents,
  type User,
  type UpsertUser,
  type Package,
  type TrackingEvent,
  type InsertPackage,
  type InsertTrackingEvent,
  PACKAGE_STATUSES,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

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
}

export const storage = new DatabaseStorage();