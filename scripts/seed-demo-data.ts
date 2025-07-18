import { db } from "../server/db";
import { packages, trackingEvents } from "../shared/schema";

async function seedDemoData() {
  console.log("Seeding demo data...");
  
  try {
    // Create demo packages
    const demoPackages = [
      {
        trackingId: "ST-DEMO12345",
        senderName: "John Smith",
        senderAddress: "123 Main St, New York, NY 10001, USA",
        senderPhone: "+1 (555) 123-4567",
        senderEmail: "john.smith@example.com",
        recipientName: "Sarah Johnson",
        recipientAddress: "456 Oak Ave, Los Angeles, CA 90210, USA",
        recipientPhone: "+1 (555) 987-6543",
        recipientEmail: "sarah.johnson@example.com",
        packageDescription: "Electronics - Smartphone",
        weight: "0.5",
        dimensions: "15x8x2 cm",
        shippingCost: "25.99",
        paymentMethod: "card",
        paymentStatus: "paid",
        currentStatus: "in-transit",
        currentLocation: "Phoenix, AZ Distribution Center",
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      },
      {
        trackingId: "ST-DEMO67890",
        senderName: "Emily Davis",
        senderAddress: "789 Pine St, Chicago, IL 60601, USA",
        senderPhone: "+1 (555) 246-8135",
        senderEmail: "emily.davis@example.com",
        recipientName: "Michael Chen",
        recipientAddress: "321 Elm Dr, Miami, FL 33101, USA",
        recipientPhone: "+1 (555) 369-2580",
        recipientEmail: "michael.chen@example.com",
        packageDescription: "Documents - Legal Papers",
        weight: "0.2",
        dimensions: "30x21x1 cm",
        shippingCost: "15.50",
        paymentMethod: "card",
        paymentStatus: "paid",
        currentStatus: "delivered",
        currentLocation: "Miami, FL",
        estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        actualDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        trackingId: "ST-DEMO24680",
        senderName: "David Wilson",
        senderAddress: "555 Maple Blvd, Seattle, WA 98101, USA",
        senderPhone: "+1 (555) 147-2583",
        senderEmail: "david.wilson@example.com",
        recipientName: "Lisa Rodriguez",
        recipientAddress: "777 Cedar Lane, Austin, TX 78701, USA",
        recipientPhone: "+1 (555) 741-9630",
        recipientEmail: "lisa.rodriguez@example.com",
        packageDescription: "Gift - Jewelry Box",
        weight: "1.2",
        dimensions: "20x15x10 cm",
        shippingCost: "32.75",
        paymentMethod: "crypto",
        paymentStatus: "paid",
        cryptoPaymentAddress: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
        cryptoTxHash: "abc123def456...",
        currentStatus: "processing",
        currentLocation: "Seattle, WA Processing Center",
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      }
    ];

    // Insert demo packages
    for (const pkg of demoPackages) {
      try {
        const [insertedPackage] = await db.insert(packages).values(pkg).returning();
        console.log(`Inserted package: ${insertedPackage.trackingId}`);
        
        // Create tracking events for each package
        const events = getTrackingEventsForPackage(pkg.trackingId, insertedPackage.id);
        
        for (const event of events) {
          await db.insert(trackingEvents).values(event);
        }
        
        console.log(`Added ${events.length} tracking events for ${insertedPackage.trackingId}`);
      } catch (error) {
        console.log(`Package ${pkg.trackingId} already exists, skipping...`);
      }
    }

    console.log("Demo data seeding completed!");
  } catch (error) {
    console.error("Error seeding demo data:", error);
  }
}

function getTrackingEventsForPackage(trackingId: string, packageId: number) {
  const baseEvents = [
    {
      packageId,
      status: "created",
      location: "Origin Facility",
      description: "Package created and ready for pickup",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      packageId,
      status: "picked-up",
      location: "Local Pickup Center",
      description: "Package picked up by courier",
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      packageId,
      status: "processing",
      location: "Regional Processing Center",
      description: "Package sorted and processed",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ];

  if (trackingId === "ST-DEMO12345") {
    return [
      ...baseEvents,
      {
        packageId,
        status: "in-transit",
        location: "Phoenix, AZ Distribution Center",
        description: "Package in transit to destination",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ];
  }

  if (trackingId === "ST-DEMO67890") {
    return [
      ...baseEvents,
      {
        packageId,
        status: "in-transit",
        location: "Atlanta, GA Distribution Center",
        description: "Package in transit to destination",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        packageId,
        status: "out-for-delivery",
        location: "Miami, FL Local Facility",
        description: "Package out for delivery",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        packageId,
        status: "delivered",
        location: "Miami, FL",
        description: "Package delivered successfully",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];
  }

  if (trackingId === "ST-DEMO24680") {
    return [
      ...baseEvents.slice(0, 2), // Only first 2 events
    ];
  }

  return baseEvents;
}

// Run the seeding function
seedDemoData();