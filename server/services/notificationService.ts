// Notification Service for Email and SMS
// This service simulates email/SMS notifications
// In production, you would integrate with services like SendGrid, Twilio, etc.

import { storage } from "../storage";
import type { Package, InsertNotification } from "@shared/schema";

interface NotificationPayload {
  packageId: number;
  type: 'email' | 'sms';
  recipientEmail?: string;
  recipientPhone?: string;
  subject: string;
  message: string;
  autoSend?: boolean;
}

export class NotificationService {
  // Send email notification (simulated)
  async sendEmail(to: string, subject: string, message: string): Promise<boolean> {
    try {
      // In production, integrate with SendGrid, AWS SES, etc.
      console.log(`📧 EMAIL SENT TO: ${to}`);
      console.log(`SUBJECT: ${subject}`);
      console.log(`MESSAGE: ${message}`);
      console.log('-------------------');
      
      // Simulate some delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  // Send SMS notification (simulated)
  async sendSMS(to: string, message: string): Promise<boolean> {
    try {
      // In production, integrate with Twilio, AWS SNS, etc.
      console.log(`📱 SMS SENT TO: ${to}`);
      console.log(`MESSAGE: ${message}`);
      console.log('-------------------');
      
      // Simulate some delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return true;
    } catch (error) {
      console.error('SMS sending failed:', error);
      return false;
    }
  }

  // Send notification and save to database
  async sendNotification(payload: NotificationPayload): Promise<void> {
    try {
      // Create notification record in database
      const notificationData: InsertNotification = {
        packageId: payload.packageId,
        recipientEmail: payload.recipientEmail || null,
        recipientPhone: payload.recipientPhone || null,
        type: payload.type,
        subject: payload.subject,
        message: payload.message,
        status: 'pending',
        autoSend: payload.autoSend || false,
      };

      const notification = await storage.createNotification(notificationData);

      let success = false;
      let errorMessage: string | undefined;

      // Send the actual notification
      if (payload.type === 'email' && payload.recipientEmail) {
        success = await this.sendEmail(payload.recipientEmail, payload.subject, payload.message);
      } else if (payload.type === 'sms' && payload.recipientPhone) {
        success = await this.sendSMS(payload.recipientPhone, payload.message);
      }

      // Update notification status
      if (success) {
        await storage.updateNotificationStatus(
          notification.id,
          'sent',
          new Date()
        );
      } else {
        errorMessage = `Failed to send ${payload.type}`;
        await storage.updateNotificationStatus(
          notification.id,
          'failed',
          undefined,
          errorMessage
        );
      }

    } catch (error) {
      console.error('Notification service error:', error);
    }
  }

  // Auto-send notifications when package status changes
  async sendPackageStatusUpdate(packageData: Package, newStatus: string): Promise<void> {
    const statusMessages: Record<string, string> = {
      'created': 'Your package has been created and is being prepared for shipping.',
      'processing': 'Your package is now being processed at our facility.',
      'in_transit': 'Your package is on its way! It has left our facility and is in transit.',
      'out_for_delivery': 'Great news! Your package is out for delivery and will arrive today.',
      'delivered': 'Your package has been successfully delivered. Thank you for choosing Shipnix-Express!',
      'held': 'Your package is being held. Please contact customer service for more information.',
      'exception': 'There has been an exception with your package. We are working to resolve this.'
    };

    const message = statusMessages[newStatus] || `Your package status has been updated to: ${newStatus}`;
    const subject = `Package Update - ${packageData.trackingId}`;

    // Send email if recipient email is available
    if (packageData.recipientEmail) {
      await this.sendNotification({
        packageId: packageData.id,
        type: 'email',
        recipientEmail: packageData.recipientEmail,
        subject,
        message: `${message}\n\nTracking ID: ${packageData.trackingId}\nTrack your package: ${process.env.REPLIT_DOMAINS?.split(',')[0]}/track/${packageData.trackingId}`,
        autoSend: true,
      });
    }

    // Send SMS if recipient phone is available
    if (packageData.recipientPhone) {
      await this.sendNotification({
        packageId: packageData.id,
        type: 'sms',
        recipientPhone: packageData.recipientPhone,
        subject,
        message: `${message} Tracking: ${packageData.trackingId}`,
        autoSend: true,
      });
    }
  }

  // Send delivery reminders
  async sendDeliveryReminder(packageData: Package): Promise<void> {
    if (!packageData.scheduledDeliveryDate) return;

    const deliveryDate = new Date(packageData.scheduledDeliveryDate);
    const message = `Reminder: Your package (${packageData.trackingId}) is scheduled for delivery on ${deliveryDate.toLocaleDateString()}`;
    
    if (packageData.scheduledTimeSlot) {
      const timeSlotDescriptions: Record<string, string> = {
        'morning': '8AM - 12PM',
        'afternoon': '12PM - 5PM',
        'evening': '5PM - 8PM',
        'express': 'Same day delivery',
        'weekend': 'Weekend delivery'
      };
      
      const timeDesc = timeSlotDescriptions[packageData.scheduledTimeSlot] || packageData.scheduledTimeSlot;
      const fullMessage = `${message} between ${timeDesc}.`;

      // Send reminder notifications
      if (packageData.recipientEmail) {
        await this.sendNotification({
          packageId: packageData.id,
          type: 'email',
          recipientEmail: packageData.recipientEmail,
          subject: `Delivery Reminder - ${packageData.trackingId}`,
          message: fullMessage,
          autoSend: true,
        });
      }

      if (packageData.recipientPhone) {
        await this.sendNotification({
          packageId: packageData.id,
          type: 'sms',
          recipientPhone: packageData.recipientPhone,
          subject: 'Delivery Reminder',
          message: fullMessage,
          autoSend: true,
        });
      }
    }
  }
}

export const notificationService = new NotificationService();