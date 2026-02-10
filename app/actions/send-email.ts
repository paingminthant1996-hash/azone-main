"use server";

// Email notification utilities
import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Get Gmail SMTP transporter
 */
function getEmailTransporter() {
  const user = process.env.GMAIL_USER;
  const appPassword = process.env.GMAIL_APP_PASSWORD;

  if (!user || !appPassword) {
    throw new Error("Gmail credentials not configured");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: user,
      pass: appPassword, // App Password, not regular password
    },
  });
}

/**
 * Send email notification using Gmail SMTP
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if Gmail credentials are configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.log("📧 Email would be sent (Gmail credentials not configured):", {
        to: options.to,
        subject: options.subject,
      });
      return { success: true };
    }

    const transporter = getEmailTransporter();
    const fromEmail = process.env.GMAIL_FROM_EMAIL || process.env.GMAIL_USER || "paingminthant1996@gmail.com";

    // Send email via Gmail SMTP
    const info = await transporter.sendMail({
      from: fromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    console.log("📧 Email sent successfully:", {
      to: options.to,
      subject: options.subject,
      messageId: info.messageId,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Email sending error:", error);
    return { success: false, error: error.message || "Failed to send email" };
  }
}

/**
 * Send purchase confirmation email
 */
export async function sendPurchaseConfirmationEmail(
  email: string,
  templateTitle: string,
  price: number,
  currency: string = "USD"
): Promise<{ success: boolean; error?: string }> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Purchase Confirmation - Azone</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Azone</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Thank You for Your Purchase!</h2>
          <p>Your purchase has been confirmed. Here are the details:</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Template:</strong> ${templateTitle}</p>
            <p style="margin: 10px 0;"><strong>Price:</strong> ${currency} ${price.toFixed(2)}</p>
            <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p>You can now download your template from your account dashboard:</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://paing.xyz'}/account/downloads" 
             style="display: inline-block; background: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Download Template
          </a>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            If you have any questions, please contact our support team.
          </p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Azone. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

  const text = `
Thank You for Your Purchase!

Your purchase has been confirmed.

Template: ${templateTitle}
Price: ${currency} ${price.toFixed(2)}
Date: ${new Date().toLocaleDateString()}

Download your template: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://paing.xyz'}/account/downloads

© ${new Date().getFullYear()} Azone. All rights reserved.
  `;

  return sendEmail({
    to: email,
    subject: `Purchase Confirmation - ${templateTitle}`,
    html,
    text,
  });
}

