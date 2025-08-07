import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { notificationService } from "./services/notificationService";
import { 
  insertPackageSchema, 
  insertTrackingEventSchema, 
  insertQuoteSchema, 
  insertInvoiceSchema, 
  insertNotificationSchema, 
  insertChatMessageSchema,
  PACKAGE_STATUSES,
  QUOTE_STATUSES,
  DELIVERY_TIME_SLOTS 
} from "@shared/schema";
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

  // Package management routes (Admin only)
  app.post("/api/packages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Check if user has admin privileges
      const user = await storage.getUser(userId);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      console.log("Creating package with data:", req.body);
      
      const packageData = insertPackageSchema.parse({
        ...req.body,
        createdBy: userId,
        currentStatus: PACKAGE_STATUSES.CREATED,
        paymentStatus: "paid", // Admin-created packages are pre-paid
      });

      const newPackage = await storage.createPackage(packageData);
      console.log("Package created successfully:", newPackage.trackingId);
      
      // Send initial notifications for package creation
      if (newPackage.currentStatus === PACKAGE_STATUSES.CREATED) {
        await notificationService.sendPackageStatusUpdate(newPackage, PACKAGE_STATUSES.CREATED);
      }
      
      res.json({
        ...newPackage,
        message: "Package created successfully",
        trackingUrl: `/track/${newPackage.trackingId}`
      });
    } catch (error) {
      console.error("Error creating package:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid package data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create package" });
    }
  });

  // Public tracking endpoint (no authentication required - for regular users)
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
      const userId = req.user.claims.sub;
      
      // Check if user has admin privileges
      const user = await storage.getUser(userId);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
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
      const userId = req.user.claims.sub;
      
      // Check if user has admin privileges
      const user = await storage.getUser(userId);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const id = parseInt(req.params.id);
      const { status, location } = req.body;

      if (!Object.values(PACKAGE_STATUSES).includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const updatedPackage = await storage.updatePackageStatus(id, status, location);
      res.json(updatedPackage);

      // Send automated notifications for status changes
      await notificationService.sendPackageStatusUpdate(updatedPackage, status);

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
      
      // Add tracking events for each package
      const packagesWithEvents = await Promise.all(
        packages.map(async (pkg) => {
          const events = await storage.getTrackingEventsByPackageId(pkg.id);
          return {
            ...pkg,
            trackingEvents: events,
            trackingUrl: `/public-tracking?track=${pkg.trackingId}`,
            adminTrackingUrl: `/track/${pkg.trackingId}`
          };
        })
      );
      
      res.json(packagesWithEvents);
    } catch (error) {
      console.error("Error fetching admin packages:", error);
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });

  // Chat API routes
  app.post("/api/chat/message", async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse(req.body);
      const newMessage = await storage.createChatMessage(messageData);
      
      res.json(newMessage);

      // Broadcast chat message to WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: "chatMessage",
            data: newMessage,
          }));
        }
      });
    } catch (error) {
      console.error("Error creating chat message:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.get("/api/chat/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getChatMessagesBySessionId(sessionId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat/mark-read", async (req, res) => {
    try {
      const { sessionId, senderType } = req.body;
      await storage.markChatMessagesAsRead(sessionId, senderType);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      res.status(500).json({ message: "Failed to mark messages as read" });
    }
  });

  // Delivery scheduling and pricing API
  app.get("/api/delivery/pricing", async (req, res) => {
    try {
      const timeSlots = Object.entries(DELIVERY_TIME_SLOTS).map(([key, value]) => {
        let price = 0;
        let description = "";
        switch (value) {
          case 'morning':
            price = 0;
            description = "8AM - 12PM (Standard)";
            break;
          case 'afternoon':
            price = 5;
            description = "12PM - 5PM (+$5)";
            break;
          case 'evening':
            price = 15;
            description = "5PM - 8PM (+$15)";
            break;
          case 'express':
            price = 25;
            description = "Same Day Express (+$25)";
            break;
          case 'weekend':
            price = 20;
            description = "Weekend Delivery (+$20)";
            break;
        }
        return {
          slot: value,
          name: key.toLowerCase().replace('_', ' '),
          price,
          description
        };
      });
      
      res.json(timeSlots);
    } catch (error) {
      console.error("Error fetching delivery pricing:", error);
      res.status(500).json({ message: "Failed to fetch delivery pricing" });
    }
  });

  // Notification management API
  app.post("/api/notifications", isAuthenticated, async (req: any, res) => {
    try {
      const notificationData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(notificationData);
      res.json(notification);
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

  app.patch("/api/quotes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;

      const updatedQuote = await storage.updateQuote(id, updateData);
      
      if (!updatedQuote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      res.json(updatedQuote);
    } catch (error) {
      console.error("Error updating quote:", error);
      res.status(500).json({ message: "Failed to update quote" });
    }
  });

  // Convert quote to invoice
  app.post("/api/quotes/:id/convert-to-invoice", isAuthenticated, async (req: any, res) => {
    try {
      const quoteId = parseInt(req.params.id);
      const userId = req.user.claims.sub;

      const quote = await storage.getQuoteById(quoteId);
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }

      if (quote.status !== QUOTE_STATUSES.APPROVED) {
        return res.status(400).json({ message: "Quote must be approved before converting to invoice" });
      }

      // Create invoice from quote
      const invoiceData = {
        quoteId: quote.id,
        customerName: quote.senderName,
        customerEmail: quote.senderEmail || "",
        customerAddress: quote.senderAddress,
        totalAmount: quote.totalCost,
        paymentMethod: "card", // Default, can be changed later
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        items: [
          {
            description: "Shipping Service",
            details: `From: ${quote.senderAddress} To: ${quote.recipientAddress}`,
            baseCost: quote.baseCost,
            deliveryFee: quote.deliveryFee,
            totalCost: quote.totalCost
          }
        ],
        createdBy: userId,
      };

      const newInvoice = await storage.createInvoice(invoiceData);
      
      // Update quote status to converted
      await storage.updateQuoteStatus(quoteId, QUOTE_STATUSES.CONVERTED_TO_INVOICE);

      // Send invoice notification to customer
      await notificationService.sendNotification({
        packageId: 0, // No package yet
        type: 'email',
        recipientEmail: quote.senderEmail || "",
        subject: `Invoice ${newInvoice.invoiceNumber} - Payment Required`,
        message: `Dear ${quote.senderName},\n\nYour quote ${quote.quoteNumber} has been approved. Please find your invoice ${newInvoice.invoiceNumber} attached.\n\nTotal Amount: $${quote.totalCost}\nDue Date: ${newInvoice.dueDate.toLocaleDateString()}\n\nPlease complete payment to proceed with your shipment.\n\nThank you for choosing Shipnix-Express!`,
        autoSend: true,
      });

      res.json({ invoice: newInvoice, message: "Quote converted to invoice successfully" });
    } catch (error) {
      console.error("Error converting quote to invoice:", error);
      res.status(500).json({ message: "Failed to convert quote to invoice" });
    }
  });

  // Mark invoice as paid and create package with tracking ID
  app.patch("/api/invoices/:id/mark-paid", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;

      const invoice = await storage.updateInvoicePayment(id, "paid");
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      // If invoice has a quote, create package from quote
      if (invoice.quoteId) {
        const quote = await storage.getQuoteById(invoice.quoteId);
        if (quote) {
          const packageData = {
            senderName: quote.senderName,
            senderEmail: quote.senderEmail,
            senderPhone: quote.senderPhone || "",
            senderAddress: quote.senderAddress,
            recipientName: quote.recipientName,
            recipientEmail: quote.recipientEmail,
            recipientPhone: quote.recipientPhone || "",
            recipientAddress: quote.recipientAddress,
            description: quote.packageDescription || "Package from approved quote",
            weight: quote.weight ? quote.weight.toString() : "0",
            dimensions: quote.dimensions || "",
            shippingCost: quote.totalCost ? quote.totalCost.toString() : "0",
            deliveryPriceAdjustment: quote.deliveryFee ? quote.deliveryFee.toString() : "0",
            scheduledTimeSlot: quote.deliveryTimeSlot,
            paymentStatus: "paid",
            currentStatus: PACKAGE_STATUSES.CREATED, // Now packages start as "created" after payment
            createdBy: userId,
          };

          const newPackage = await storage.createPackage(packageData);
          
          // Send package creation notification
          await notificationService.sendPackageStatusUpdate(newPackage, PACKAGE_STATUSES.CREATED);

          res.json({ 
            invoice, 
            package: newPackage, 
            trackingId: newPackage.trackingId,
            qrCode: newPackage.qrCode,
            message: "Payment confirmed! Package created with tracking ID and QR code generated." 
          });
          return;
        }
      }

      res.json({ invoice, message: "Payment confirmed" });
    } catch (error) {
      console.error("Error marking invoice as paid:", error);
      res.status(500).json({ message: "Failed to mark invoice as paid" });
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