import { db } from "../server/db";
import { packages, trackingEvents, PACKAGE_STATUSES } from "../shared/schema";
import { nanoid } from "nanoid";

const samplePackages = [
  {
    trackingId: "ST-DEMO12345",
    senderName: "TechShop International",
    senderAddress: "123 Commerce St, New York, NY 10001, USA",
    senderPhone: "+1-555-123-4567",
    senderEmail: "orders@techshop.com",
    recipientName: "Maria Santos",
    recipientAddress: "Rua das Flores 456, São Paulo, SP 01234-567, Brazil", 
    recipientPhone: "+55-11-9876-5432",
    recipientEmail: "maria.santos@email.com",
    packageDescription: "MacBook Pro 16-inch (Electronics)",
    weight: 2.1,
    dimensions: "35x25x2 cm",
    shippingCost: 89.99,
    paymentMethod: "card",
    paymentStatus: "paid",
    currentStatus: PACKAGE_STATUSES.OUT_FOR_DELIVERY,
    currentLocation: "São Paulo Distribution Center, Brazil",
    estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
    createdBy: "admin",
    events: [
      { status: PACKAGE_STATUSES.CREATED, location: "TechShop Warehouse, New York", description: "Package registered and labeled", daysAgo: 5 },
      { status: PACKAGE_STATUSES.PICKED_UP, location: "New York Sorting Facility", description: "Package picked up by courier", daysAgo: 4 },
      { status: PACKAGE_STATUSES.IN_TRANSIT, location: "JFK International Airport", description: "Departed from New York", daysAgo: 3 },
      { status: PACKAGE_STATUSES.IN_TRANSIT, location: "GRU International Airport, São Paulo", description: "Arrived in Brazil, cleared customs", daysAgo: 1 },
      { status: PACKAGE_STATUSES.OUT_FOR_DELIVERY, location: "São Paulo Distribution Center", description: "Out for delivery to recipient", daysAgo: 0 }
    ]
  },
  {
    trackingId: "ST-DEMO67890",
    senderName: "Fashion World Ltd",
    senderAddress: "87 Oxford Street, London W1D 2ES, UK",
    senderPhone: "+44-20-7123-4567",
    senderEmail: "dispatch@fashionworld.co.uk",
    recipientName: "Ahmed Hassan",
    recipientAddress: "Sheikh Zayed Road, Dubai 12345, UAE",
    recipientPhone: "+971-4-123-4567", 
    recipientEmail: "ahmed.hassan@email.com",
    packageDescription: "Designer Clothing Collection",
    weight: 1.5,
    dimensions: "40x30x15 cm",
    shippingCost: 65.50,
    paymentMethod: "paypal",
    paymentStatus: "paid",
    currentStatus: PACKAGE_STATUSES.DELIVERED,
    currentLocation: "Delivered to Recipient",
    actualDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    createdBy: "admin",
    events: [
      { status: PACKAGE_STATUSES.CREATED, location: "Fashion World Warehouse, London", description: "Package prepared for shipping", daysAgo: 7 },
      { status: PACKAGE_STATUSES.PICKED_UP, location: "London Central Depot", description: "Collected by courier service", daysAgo: 6 },
      { status: PACKAGE_STATUSES.IN_TRANSIT, location: "Heathrow Airport, London", description: "Departed United Kingdom", daysAgo: 5 },
      { status: PACKAGE_STATUSES.IN_TRANSIT, location: "Dubai International Airport", description: "Arrived in Dubai, processing", daysAgo: 4 },
      { status: PACKAGE_STATUSES.OUT_FOR_DELIVERY, location: "Dubai Distribution Hub", description: "Out for final delivery", daysAgo: 3 },
      { status: PACKAGE_STATUSES.DELIVERED, location: "Sheikh Zayed Road, Dubai", description: "Successfully delivered to recipient", daysAgo: 2 }
    ]
  },
  {
    trackingId: "ST-DEMO24680",
    senderName: "BookWorld Australia",
    senderAddress: "456 Collins Street, Melbourne VIC 3000, Australia",
    senderPhone: "+61-3-9876-5432",
    senderEmail: "orders@bookworld.com.au",
    recipientName: "Sarah Johnson",
    recipientAddress: "789 Broadway, New York, NY 10003, USA",
    recipientPhone: "+1-212-555-9876",
    recipientEmail: "sarah.johnson@email.com", 
    packageDescription: "Rare Books Collection (Literature)",
    weight: 3.2,
    dimensions: "30x25x20 cm",
    shippingCost: 125.75,
    paymentMethod: "bitcoin",
    paymentStatus: "paid",
    currentStatus: PACKAGE_STATUSES.IN_TRANSIT,
    currentLocation: "Los Angeles Processing Center, USA",
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    createdBy: "admin",
    events: [
      { status: PACKAGE_STATUSES.CREATED, location: "BookWorld Warehouse, Melbourne", description: "Rare books carefully packaged", daysAgo: 8 },
      { status: PACKAGE_STATUSES.PICKED_UP, location: "Melbourne Postal Hub", description: "Picked up for international shipping", daysAgo: 7 },
      { status: PACKAGE_STATUSES.IN_TRANSIT, location: "Melbourne Airport", description: "Departed Australia", daysAgo: 5 },
      { status: PACKAGE_STATUSES.IN_TRANSIT, location: "Los Angeles International Airport", description: "Arrived in USA, customs clearance", daysAgo: 2 },
      { status: PACKAGE_STATUSES.IN_TRANSIT, location: "Los Angeles Processing Center", description: "In transit to New York", daysAgo: 1 }
    ]
  }
];

async function createSamplePackages() {
  console.log("Creating sample packages...");
  
  for (const packageData of samplePackages) {
    const { events, actualDelivery, ...packageInfo } = packageData;
    
    try {
      // Insert package
      const [newPackage] = await db
        .insert(packages)
        .values({
          ...packageInfo,
          actualDelivery: actualDelivery || null,
          createdAt: new Date(Date.now() - events[0].daysAgo * 24 * 60 * 60 * 1000),
        })
        .returning();

      console.log(`Created package: ${newPackage.trackingId}`);

      // Insert tracking events
      for (const event of events) {
        await db.insert(trackingEvents).values({
          packageId: newPackage.id,
          status: event.status,
          location: event.location,
          description: event.description,
          timestamp: new Date(Date.now() - event.daysAgo * 24 * 60 * 60 * 1000),
        });
      }

      console.log(`  - Added ${events.length} tracking events`);
    } catch (error) {
      console.error(`Error creating package ${packageData.trackingId}:`, error);
    }
  }
  
  console.log("Sample packages created successfully!");
  console.log("\nYou can test tracking with these IDs:");
  samplePackages.forEach(pkg => {
    console.log(`- ${pkg.trackingId} (${pkg.currentStatus})`);
  });
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createSamplePackages().then(() => {
    console.log("Done!");
    process.exit(0);
  }).catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
}

export { createSamplePackages };