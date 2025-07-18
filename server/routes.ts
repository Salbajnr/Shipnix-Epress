import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPackageSchema, insertTrackingEventSchema, insertQuoteSchema, insertInvoiceSchema, insertNotificationSchema, PACKAGE_STATUSES } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server first
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

  // Cryptocurrency API routes
  app.get("/api/cryptocurrencies", async (req, res) => {
    try {
      // Mock cryptocurrency data for development
      const mockData = [
        {
          id: "bitcoin",
          symbol: "btc",
          name: "Bitcoin",
          current_price: 43250.92,
          price_change_percentage_24h: 2.45
        },
        {
          id: "ethereum",
          symbol: "eth", 
          name: "Ethereum",
          current_price: 2634.18,
          price_change_percentage_24h: 1.23
        },
        {
          id: "binancecoin",
          symbol: "bnb",
          name: "BNB",
          current_price: 245.67,
          price_change_percentage_24h: -0.89
        },
        {
          id: "cardano",
          symbol: "ada",
          name: "Cardano", 
          current_price: 0.47,
          price_change_percentage_24h: 3.21
        },
        {
          id: "solana",
          symbol: "sol",
          name: "Solana",
          current_price: 98.34,
          price_change_percentage_24h: 5.67
        },
        {
          id: "ripple",
          symbol: "xrp",
          name: "XRP",
          current_price: 0.57,
          price_change_percentage_24h: -1.45
        },
        {
          id: "polkadot",
          symbol: "dot",
          name: "Polkadot",
          current_price: 6.82,
          price_change_percentage_24h: 2.10
        },
        {
          id: "avalanche-2",
          symbol: "avax",
          name: "Avalanche",
          current_price: 27.89,
          price_change_percentage_24h: 4.33
        },
        {
          id: "chainlink",
          symbol: "link",
          name: "Chainlink",
          current_price: 14.56,
          price_change_percentage_24h: 1.87
        },
        {
          id: "polygon",
          symbol: "matic",
          name: "Polygon",
          current_price: 0.89,
          price_change_percentage_24h: -0.65
        }
      ];
      
      res.json(mockData);
    } catch (error) {
      console.error("Error fetching cryptocurrencies:", error);
      res.status(500).json({ message: "Failed to fetch cryptocurrency data" });
    }
  });

  app.get("/api/cryptocurrencies/:id/history", async (req, res) => {
    try {
      const { id } = req.params;
      const { days = '1' } = req.query;
      
      // Generate mock historical data
      const numPoints = parseInt(days as string) * 24;
      const basePrice = id === 'bitcoin' ? 43000 : id === 'ethereum' ? 2600 : 100;
      const history = [];
      
      for (let i = 0; i < numPoints; i++) {
        const timestamp = Date.now() - (numPoints - i) * 60 * 60 * 1000;
        const variance = (Math.random() - 0.5) * 0.05; // 5% variance
        const price = basePrice * (1 + variance);
        history.push([timestamp, price]);
      }
      
      res.json(history);
    } catch (error) {
      console.error("Error fetching price history:", error);
      res.status(500).json({ message: "Failed to fetch price history" });
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

  // Public tracking endpoint (no authentication required)
  app.get("/api/public/track/:trackingId", async (req, res) => {
    try {
      const { trackingId } = req.params;
      
      if (!trackingId || !trackingId.startsWith("ST-")) {
        return res.status(400).json({ message: "Invalid tracking ID format" });
      }

      const packageData = await storage.getPackageByTrackingId(trackingId);
      
      if (!packageData) {
        return res.status(404).json({ message: "Package not found" });
      }

      // Get tracking events for this package
      const trackingEvents = await storage.getTrackingEventsByPackageId(packageData.id);

      // Return public-safe data (exclude sensitive admin info)
      const publicData = {
        trackingId: packageData.trackingId,
        currentStatus: packageData.currentStatus,
        currentLocation: packageData.currentLocation,
        estimatedDelivery: packageData.estimatedDelivery,
        actualDelivery: packageData.actualDelivery,
        senderName: packageData.senderName,
        senderAddress: packageData.senderAddress,
        recipientName: packageData.recipientName,
        recipientAddress: packageData.recipientAddress,
        packageDescription: packageData.packageDescription,
        weight: packageData.weight,
        dimensions: packageData.dimensions,
        shippingCost: packageData.shippingCost,
        paymentMethod: packageData.paymentMethod,
        paymentStatus: packageData.paymentStatus,
        createdAt: packageData.createdAt,
        trackingEvents: trackingEvents || []
      };

      res.json(publicData);
    } catch (error) {
      console.error("Error tracking package:", error);
      res.status(500).json({ message: "Failed to track package" });
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

  // Admin-only tracking routes (authentication required)
  app.get("/api/track/:trackingId", isAuthenticated, async (req: any, res) => {
    try {
      const trackingId = req.params.trackingId.toUpperCase();
      const packageData = await storage.getPackageByTrackingId(trackingId);
      
      if (!packageData) {
        return res.status(404).json({ message: "Package not found" });
      }

      const trackingEvents = await storage.getTrackingEventsByPackageId(packageData.id);
      
      // Return full package information for admin tracking
      res.json({
        ...packageData,
        trackingEvents: trackingEvents,
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

  // Quote management routes
  app.post("/api/quotes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const quoteData = insertQuoteSchema.parse({
        ...req.body,
        createdBy: userId,
      });

      const newQuote = await storage.createQuote(quoteData);
      res.json(newQuote);
    } catch (error) {
      console.error("Error creating quote:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid quote data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create quote" });
    }
  });

  app.get("/api/quotes", isAuthenticated, async (req: any, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const quotes = await storage.getAllQuotes(limit);
      res.json(quotes);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      res.status(500).json({ message: "Failed to fetch quotes" });
    }
  });

  app.get("/api/quotes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const quote = await storage.getQuoteById(id);
      
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }

      res.json(quote);
    } catch (error) {
      console.error("Error fetching quote:", error);
      res.status(500).json({ message: "Failed to fetch quote" });
    }
  });

  app.patch("/api/quotes/:id/status", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      const updatedQuote = await storage.updateQuoteStatus(id, status);
      res.json(updatedQuote);
    } catch (error) {
      console.error("Error updating quote status:", error);
      res.status(500).json({ message: "Failed to update quote status" });
    }
  });

  // Invoice management routes
  app.post("/api/invoices", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const invoiceData = insertInvoiceSchema.parse({
        ...req.body,
        createdBy: userId,
      });

      const newInvoice = await storage.createInvoice(invoiceData);
      res.json(newInvoice);
    } catch (error) {
      console.error("Error creating invoice:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid invoice data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create invoice" });
    }
  });

  app.get("/api/invoices", isAuthenticated, async (req: any, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const invoices = await storage.getAllInvoices(limit);
      res.json(invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  app.patch("/api/invoices/:id/payment", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const { paymentStatus } = req.body;

      const updatedInvoice = await storage.updateInvoicePayment(id, paymentStatus);
      res.json(updatedInvoice);
    } catch (error) {
      console.error("Error updating invoice payment:", error);
      res.status(500).json({ message: "Failed to update invoice payment" });
    }
  });

  // Notification routes
  app.post("/api/notifications", isAuthenticated, async (req: any, res) => {
    try {
      const notificationData = insertNotificationSchema.parse(req.body);
      const newNotification = await storage.createNotification(notificationData);
      res.json(newNotification);
    } catch (error) {
      console.error("Error creating notification:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid notification data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create notification" });
    }
  });

  app.get("/api/packages/:id/notifications", isAuthenticated, async (req: any, res) => {
    try {
      const packageId = parseInt(req.params.id);
      const notifications = await storage.getNotificationsByPackageId(packageId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  return httpServer;
}