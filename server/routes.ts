import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPackageSchema, insertTrackingEventSchema, PACKAGE_STATUSES } from "@shared/schema";
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
      res.json(newPackage);
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

  // Admin routes for package management
  app.get("/api/admin/packages", isAuthenticated, async (req: any, res) => {
    try {
      const packages = await storage.getAllPackages();
      res.json(packages);
    } catch (error) {
      console.error("Error fetching admin packages:", error);
      res.status(500).json({ message: "Failed to fetch packages" });
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