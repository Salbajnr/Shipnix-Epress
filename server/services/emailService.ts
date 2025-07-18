import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY not provided. Email notifications will be disabled.");
}

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

interface PackageCreatedEmailData {
  recipientEmail: string;
  recipientName: string;
  trackingId: string;
  senderName: string;
  packageDescription: string;
  shippingCost: string;
  estimatedDelivery: string;
  paymentMethod: string;
}

interface PackageStatusEmailData {
  recipientEmail: string;
  recipientName: string;
  trackingId: string;
  newStatus: string;
  currentLocation?: string;
  estimatedDelivery?: string;
}

export class EmailService {
  private static readonly FROM_EMAIL = "noreply@shipnix-express.com";
  private static readonly COMPANY_NAME = "Shipnix-Express";

  static async sendPackageCreatedEmail(data: PackageCreatedEmailData): Promise<boolean> {
    if (!process.env.SENDGRID_API_KEY) {
      console.log("Email service disabled - SENDGRID_API_KEY not provided");
      return false;
    }

    try {
      const paymentUrl = `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/track/${data.trackingId}/payment`;
      
      const emailHtml = this.generatePackageCreatedEmailHtml(data, paymentUrl);
      const emailText = this.generatePackageCreatedEmailText(data, paymentUrl);

      await mailService.send({
        to: data.recipientEmail,
        from: {
          email: this.FROM_EMAIL,
          name: this.COMPANY_NAME
        },
        subject: `📦 Your Shipnix-Express Package is Ready - Payment Required (${data.trackingId})`,
        html: emailHtml,
        text: emailText,
      });

      console.log(`Package creation email sent to ${data.recipientEmail} for tracking ID ${data.trackingId}`);
      return true;
    } catch (error) {
      console.error('Failed to send package creation email:', error);
      return false;
    }
  }

  static async sendPackageStatusUpdateEmail(data: PackageStatusEmailData): Promise<boolean> {
    if (!process.env.SENDGRID_API_KEY) {
      console.log("Email service disabled - SENDGRID_API_KEY not provided");
      return false;
    }

    try {
      const trackingUrl = `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/track/${data.trackingId}`;
      
      const emailHtml = this.generateStatusUpdateEmailHtml(data, trackingUrl);
      const emailText = this.generateStatusUpdateEmailText(data, trackingUrl);

      await mailService.send({
        to: data.recipientEmail,
        from: {
          email: this.FROM_EMAIL,
          name: this.COMPANY_NAME
        },
        subject: `🚚 Package Update: ${this.formatStatus(data.newStatus)} - ${data.trackingId}`,
        html: emailHtml,
        text: emailText,
      });

      console.log(`Status update email sent to ${data.recipientEmail} for tracking ID ${data.trackingId}`);
      return true;
    } catch (error) {
      console.error('Failed to send status update email:', error);
      return false;
    }
  }

  private static generatePackageCreatedEmailHtml(data: PackageCreatedEmailData, paymentUrl: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Package Created - Payment Required</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .package-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }
        .payment-section { background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .button { display: inline-block; background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; }
        .highlight { color: #2563eb; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📦 Package Created Successfully!</h1>
            <p>Your shipment with Shipnix-Express is ready</p>
        </div>
        
        <div class="content">
            <p>Dear <strong>${data.recipientName}</strong>,</p>
            
            <p>Great news! A package has been created for you by <strong>${data.senderName}</strong>. Your shipment is ready to be processed and will be on its way once payment is confirmed.</p>
            
            <div class="package-info">
                <h3>📋 Package Details</h3>
                <p><strong>Tracking ID:</strong> <span class="highlight">${data.trackingId}</span></p>
                <p><strong>From:</strong> ${data.senderName}</p>
                <p><strong>Package Description:</strong> ${data.packageDescription}</p>
                <p><strong>Shipping Cost:</strong> $${data.shippingCost}</p>
                <p><strong>Payment Method:</strong> ${this.formatPaymentMethod(data.paymentMethod)}</p>
                <p><strong>Estimated Delivery:</strong> ${new Date(data.estimatedDelivery).toLocaleDateString()}</p>
            </div>
            
            <div class="payment-section">
                <h3>💳 Payment Required</h3>
                <p>To process your shipment, please complete the payment using the link below:</p>
                <a href="${paymentUrl}" class="button">Complete Payment - $${data.shippingCost}</a>
                <p><small>Secure payment processing • Multiple payment options available</small></p>
            </div>
            
            <p>Once payment is received, we'll immediately start processing your shipment. You can track your package at any time using the tracking ID above.</p>
            
            <div style="background: #ecfdf5; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h4 style="margin: 0; color: #059669;">🌍 Global Shipping Excellence</h4>
                <p style="margin: 5px 0 0 0;">Delivering to 220+ countries with AI-powered logistics and real-time tracking.</p>
            </div>
        </div>
        
        <div class="footer">
            <p>This is an automated message from <strong>Shipnix-Express</strong></p>
            <p>Questions? Contact us at support@shipnix-express.com</p>
            <p><small>Shipnix-Express - The Future of Global Logistics</small></p>
        </div>
    </div>
</body>
</html>`;
  }

  private static generatePackageCreatedEmailText(data: PackageCreatedEmailData, paymentUrl: string): string {
    return `
📦 PACKAGE CREATED SUCCESSFULLY!

Dear ${data.recipientName},

Great news! A package has been created for you by ${data.senderName}. Your shipment is ready to be processed and will be on its way once payment is confirmed.

PACKAGE DETAILS:
• Tracking ID: ${data.trackingId}
• From: ${data.senderName}
• Package Description: ${data.packageDescription}
• Shipping Cost: $${data.shippingCost}
• Payment Method: ${this.formatPaymentMethod(data.paymentMethod)}
• Estimated Delivery: ${new Date(data.estimatedDelivery).toLocaleDateString()}

PAYMENT REQUIRED:
To process your shipment, please complete the payment at:
${paymentUrl}

Once payment is received, we'll immediately start processing your shipment. You can track your package at any time using the tracking ID above.

🌍 GLOBAL SHIPPING EXCELLENCE
Delivering to 220+ countries with AI-powered logistics and real-time tracking.

---
This is an automated message from Shipnix-Express
Questions? Contact us at support@shipnix-express.com
Shipnix-Express - The Future of Global Logistics
    `;
  }

  private static generateStatusUpdateEmailHtml(data: PackageStatusEmailData, trackingUrl: string): string {
    const statusIcon = this.getStatusIcon(data.newStatus);
    const statusColor = this.getStatusColor(data.newStatus);
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Package Status Update</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .status-update { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${statusColor}; text-align: center; }
        .button { display: inline-block; background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; }
        .highlight { color: #2563eb; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚚 Package Status Update</h1>
            <p>Your Shipnix-Express delivery update</p>
        </div>
        
        <div class="content">
            <p>Dear <strong>${data.recipientName}</strong>,</p>
            
            <div class="status-update">
                <h2 style="color: ${statusColor};">${statusIcon} ${this.formatStatus(data.newStatus)}</h2>
                <p><strong>Tracking ID:</strong> <span class="highlight">${data.trackingId}</span></p>
                ${data.currentLocation ? `<p><strong>📍 Current Location:</strong> ${data.currentLocation}</p>` : ''}
                ${data.estimatedDelivery ? `<p><strong>🕒 Estimated Delivery:</strong> ${new Date(data.estimatedDelivery).toLocaleDateString()}</p>` : ''}
            </div>
            
            <p>Your package status has been updated. You can view detailed tracking information and delivery updates anytime.</p>
            
            <div style="text-align: center; margin: 20px 0;">
                <a href="${trackingUrl}" class="button">Track Your Package</a>
            </div>
        </div>
        
        <div class="footer">
            <p>This is an automated message from <strong>Shipnix-Express</strong></p>
            <p>Questions? Contact us at support@shipnix-express.com</p>
            <p><small>Shipnix-Express - The Future of Global Logistics</small></p>
        </div>
    </div>
</body>
</html>`;
  }

  private static generateStatusUpdateEmailText(data: PackageStatusEmailData, trackingUrl: string): string {
    const statusIcon = this.getStatusIcon(data.newStatus);
    
    return `
🚚 PACKAGE STATUS UPDATE

Dear ${data.recipientName},

Your package status has been updated:

${statusIcon} ${this.formatStatus(data.newStatus).toUpperCase()}

PACKAGE DETAILS:
• Tracking ID: ${data.trackingId}
${data.currentLocation ? `• Current Location: ${data.currentLocation}` : ''}
${data.estimatedDelivery ? `• Estimated Delivery: ${new Date(data.estimatedDelivery).toLocaleDateString()}` : ''}

Track your package: ${trackingUrl}

---
This is an automated message from Shipnix-Express
Questions? Contact us at support@shipnix-express.com
Shipnix-Express - The Future of Global Logistics
    `;
  }

  private static formatStatus(status: string): string {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  private static formatPaymentMethod(method: string): string {
    const methods: { [key: string]: string } = {
      'card': 'Credit Card',
      'bank_transfer': 'Bank Transfer',
      'bitcoin': 'Bitcoin',
      'ethereum': 'Ethereum',
      'usdc': 'USDC',
      'paypal': 'PayPal'
    };
    return methods[method] || method;
  }

  private static getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'created': '📦',
      'picked_up': '🚚',
      'in_transit': '✈️',
      'out_for_delivery': '🚛',
      'delivered': '✅',
      'failed_delivery': '❌',
      'returned': '↩️'
    };
    return icons[status] || '📦';
  }

  private static getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'created': '#f59e0b',
      'picked_up': '#8b5cf6',
      'in_transit': '#3b82f6',
      'out_for_delivery': '#06b6d4',
      'delivered': '#10b981',
      'failed_delivery': '#ef4444',
      'returned': '#f97316'
    };
    return colors[status] || '#6b7280';
  }
}