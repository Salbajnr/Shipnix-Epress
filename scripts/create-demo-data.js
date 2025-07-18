// Create demo tracking data via API calls
const demoPackages = [
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
    currentStatus: "OUT_FOR_DELIVERY",
    currentLocation: "São Paulo Distribution Center, Brazil",
    createdBy: "demo-admin"
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
    currentStatus: "DELIVERED",
    currentLocation: "Delivered to Recipient",
    createdBy: "demo-admin"
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
    currentStatus: "IN_TRANSIT",
    currentLocation: "Los Angeles Processing Center, USA",
    createdBy: "demo-admin"
  }
];

async function createDemoData() {
  console.log("Demo data objects created. These will be inserted through the admin interface instead.");
  console.log("Sample tracking IDs that will be available:");
  demoPackages.forEach(pkg => {
    console.log(`- ${pkg.trackingId} (${pkg.currentStatus})`);
  });
}

createDemoData();