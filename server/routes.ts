import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPackageSchema, insertTrackingEventSchema, insertAddressSchema, insertNotificationSchema, PACKAGE_STATUSES, NOTIFICATION_TYPES, USER_ROLES } from "@shared/schema";
import { EmailService } from "./services/emailService";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Package management routes
  app.post("/api/packages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const packageData = insertPackageSchema.parse({
        ...req.body,
        createdBy: userId,
      });

      const newPackage = await storage.createPackage(packageData);

      // Send email notification to recipient
      if (newPackage.recipientEmail) {
        try {
          await EmailService.sendPackageCreatedEmail({
            recipientEmail: newPackage.recipientEmail,
            recipientName: newPackage.recipientName,
            trackingId: newPackage.trackingId,
            senderName: newPackage.senderName,
            packageDescription: newPackage.packageDescription || "Package",
            shippingCost: newPackage.shippingCost?.toString() || "0",
            estimatedDelivery: newPackage.estimatedDelivery?.toISOString() || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            paymentMethod: newPackage.paymentMethod || "card",
          });

          // Create notification for recipient
          if (newPackage.recipientEmail) {
            const recipientUser = await storage.getUserByEmail?.(newPackage.recipientEmail);
            if (recipientUser) {
              await storage.createNotification({
                userId: recipientUser.id,
                packageId: newPackage.id,
                type: NOTIFICATION_TYPES.PACKAGE_UPDATE,
                title: "New Package Created",
                message: `Package ${newPackage.trackingId} has been created by ${newPackage.senderName}. Payment required to process shipment.`,
              });
            }
          }
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError);
          // Don't fail the package creation if email fails
        }
      }

      res.json(newPackage);

      // Broadcast to WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: "packageCreated",
            data: newPackage,
          }));
        }
      });
    } catch (error) {
      console.error("Error creating package:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid package data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create package" });
    }
  });

  app.get("/api/packages", isAuthenticated, async (req: any, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const packages = await storage.getAllPackages(limit);
      res.json(packages);
    } catch (error) {
      console.error("Error fetching packages:", error);
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });

  app.get("/api/packages/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const packageData = await storage.getPackageById(id);
      
      if (!packageData) {
        return res.status(404).json({ message: "Package not found" });
      }

      res.json(packageData);
    } catch (error) {
      console.error("Error fetching package:", error);
      res.status(500).json({ message: "Failed to fetch package" });
    }
  });

  app.patch("/api/packages/:id/status", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, location } = req.body;

      if (!Object.values(PACKAGE_STATUSES).includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const updatedPackage = await storage.updatePackageStatus(id, status, location);
      res.json(updatedPackage);

      // Broadcast update to WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: "packageUpdate",
            data: updatedPackage,
          }));
        }
      });
    } catch (error) {
      console.error("Error updating package status:", error);
      res.status(500).json({ message: "Failed to update package status" });
    }
  });

  // Public tracking routes (no authentication required)
  app.get("/api/track/:trackingId", async (req, res) => {
    try {
      const trackingId = req.params.trackingId.toUpperCase();
      const packageData = await storage.getPackageByTrackingId(trackingId);
      
      if (!packageData) {
        return res.status(404).json({ message: "Package not found" });
      }

      const trackingEvents = await storage.getTrackingEventsByPackageId(packageData.id);
      
      // Return limited information for public tracking
      res.json({
        trackingId: packageData.trackingId,
        currentStatus: packageData.currentStatus,
        currentLocation: packageData.currentLocation,
        estimatedDelivery: packageData.estimatedDelivery,
        actualDelivery: packageData.actualDelivery,
        recipientName: packageData.recipientName,
        recipientAddress: packageData.recipientAddress,
        packageDescription: packageData.packageDescription,
        trackingEvents: trackingEvents.map(event => ({
          status: event.status,
          location: event.location,
          description: event.description,
          timestamp: event.timestamp,
        })),
      });
    } catch (error) {
      console.error("Error tracking package:", error);
      res.status(500).json({ message: "Failed to track package" });
    }
  });

  // Tracking events routes
  app.get("/api/packages/:id/events", isAuthenticated, async (req: any, res) => {
    try {
      const packageId = parseInt(req.params.id);
      const events = await storage.getTrackingEventsByPackageId(packageId);
      res.json(events);
    } catch (error) {
      console.error("Error fetching tracking events:", error);
      res.status(500).json({ message: "Failed to fetch tracking events" });
    }
  });

  app.post("/api/packages/:id/events", isAuthenticated, async (req: any, res) => {
    try {
      const packageId = parseInt(req.params.id);
      const eventData = insertTrackingEventSchema.parse({
        ...req.body,
        packageId,
      });

      const newEvent = await storage.addTrackingEvent(eventData);
      res.json(newEvent);

      // Broadcast update to WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: "trackingUpdate",
            data: { packageId, event: newEvent },
          }));
        }
      });
    } catch (error) {
      console.error("Error adding tracking event:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add tracking event" });
    }
  });

  // User-specific routes
  app.get("/api/user/packages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const packages = await storage.getUserPackages(userId);
      res.json(packages);
    } catch (error) {
      console.error("Error fetching user packages:", error);
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });

  app.get("/api/user/notifications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.patch("/api/user/notifications/:id/read", isAuthenticated, async (req: any, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      await storage.markNotificationAsRead(notificationId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  app.get("/api/user/addresses", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const addresses = await storage.getUserAddresses(userId);
      res.json(addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      res.status(500).json({ message: "Failed to fetch addresses" });
    }
  });

  app.post("/api/user/addresses", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const addressData = insertAddressSchema.parse({
        ...req.body,
        userId,
      });

      const newAddress = await storage.createAddress(addressData);
      res.json(newAddress);
    } catch (error) {
      console.error("Error creating address:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid address data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create address" });
    }
  });

  app.patch("/api/user/addresses/:id", isAuthenticated, async (req: any, res) => {
    try {
      const addressId = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedAddress = await storage.updateAddress(addressId, updates);
      res.json(updatedAddress);
    } catch (error) {
      console.error("Error updating address:", error);
      res.status(500).json({ message: "Failed to update address" });
    }
  });

  app.delete("/api/user/addresses/:id", isAuthenticated, async (req: any, res) => {
    try {
      const addressId = parseInt(req.params.id);
      await storage.deleteAddress(addressId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting address:", error);
      res.status(500).json({ message: "Failed to delete address" });
    }
  });

  app.patch("/api/user/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updates = req.body;
      
      const updatedUser = await storage.updateUserProfile(userId, updates);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.get("/api/user/support-tickets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tickets = await storage.getUserSupportTickets(userId);
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      res.status(500).json({ message: "Failed to fetch support tickets" });
    }
  });

  // Admin routes for package management
  app.get("/api/admin/packages", isAuthenticated, async (req: any, res) => {
    try {
      const userRole = req.user.claims.role || USER_ROLES.CUSTOMER;
      if (userRole !== USER_ROLES.ADMIN && userRole !== USER_ROLES.AGENT) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      const packages = await storage.getAllPackages();
      res.json(packages);
    } catch (error) {
      console.error("Error fetching admin packages:", error);
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });

  app.get("/api/admin/users", isAuthenticated, async (req: any, res) => {
    try {
      const userRole = req.user.claims.role || USER_ROLES.CUSTOMER;
      if (userRole !== USER_ROLES.ADMIN) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/support-tickets", isAuthenticated, async (req: any, res) => {
    try {
      const userRole = req.user.claims.role || USER_ROLES.CUSTOMER;
      if (userRole !== USER_ROLES.ADMIN && userRole !== USER_ROLES.SUPPORT) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      const tickets = await storage.getAllSupportTickets();
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      res.status(500).json({ message: "Failed to fetch support tickets" });
    }
  });

  app.get("/api/admin/analytics", isAuthenticated, async (req: any, res) => {
    try {
      const userRole = req.user.claims.role || USER_ROLES.CUSTOMER;
      if (userRole !== USER_ROLES.ADMIN) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      // Get analytics data
      const packages = await storage.getAllPackages();
      const users = await storage.getAllUsers();
      const supportTickets = await storage.getAllSupportTickets();

      const analytics = {
        totalPackages: packages.length,
        totalUsers: users.length,
        totalRevenue: packages.reduce((sum, pkg) => sum + (parseFloat(pkg.shippingCost?.toString() || "0")), 0),
        packagesThisMonth: packages.filter(pkg => 
          new Date(pkg.createdAt).getMonth() === new Date().getMonth()
        ).length,
        deliveredPackages: packages.filter(pkg => pkg.currentStatus === PACKAGE_STATUSES.DELIVERED).length,
        openTickets: supportTickets.filter(ticket => ticket.status === "open").length,
      };

      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Setup WebSocket server for real-time updates
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: "/ws" 
  });

  wss.on("connection", (ws) => {
    console.log("New WebSocket connection established");

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log("Received WebSocket message:", data);
        
        // Handle different message types here if needed
        if (data.type === "subscribe") {
          // Client subscribing to tracking updates
          ws.send(JSON.stringify({ type: "subscribed", message: "Connected to tracking updates" }));
        }
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
      }
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });

    // Send welcome message
    ws.send(JSON.stringify({ 
      type: "connected", 
      message: "Connected to ShipTrack real-time updates" 
    }));
  });

  return httpServer;
}