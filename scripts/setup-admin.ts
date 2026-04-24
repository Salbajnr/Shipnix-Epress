
import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";

async function setupAdmin() {
  console.log("Setting up admin user...");
  
  try {
    // Get the first user from the database
    const [firstUser] = await db.select().from(users).limit(1);
    
    if (!firstUser) {
      console.log("No users found. Please login first to create a user account.");
      return;
    }
    
    // Update the first user to be admin
    await db
      .update(users)
      .set({ isAdmin: true })
      .where(eq(users.id, firstUser.id));
    
    console.log(`User ${firstUser.email} has been granted admin privileges.`);
    console.log("Admin setup complete!");
    
  } catch (error) {
    console.error("Error setting up admin:", error);
  }
  
  process.exit(0);
}

setupAdmin();
