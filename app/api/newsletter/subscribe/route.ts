import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Gmail SMTP Configuration
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

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      );
    }

    // Check if Gmail is configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error("Gmail credentials not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const transporter = getEmailTransporter();
    const fromEmail = process.env.GMAIL_FROM_EMAIL || process.env.GMAIL_USER || "paingminthant1996@gmail.com";

    // Send confirmation email to subscriber
    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: "Welcome to Azone.store Newsletter!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Azone.store</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Azone.store</h1>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Thank You for Subscribing!</h2>
              <p>You've successfully subscribed to our newsletter. You'll receive updates about:</p>
              <ul>
                <li>New template releases</li>
                <li>Exclusive offers and discounts</li>
                <li>Product updates and improvements</li>
                <li>Tips and tutorials</li>
              </ul>
              <p>We're excited to have you on board!</p>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                If you didn't subscribe, you can ignore this email.
              </p>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>© ${new Date().getFullYear()} Azone.store. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
      text: `
Thank You for Subscribing!

You've successfully subscribed to our newsletter. You'll receive updates about new templates, exclusive offers, and product updates.

We're excited to have you on board!

© ${new Date().getFullYear()} Azone.store. All rights reserved.
      `,
    });

    // Also send notification to admin
    try {
      await transporter.sendMail({
        from: fromEmail,
        to: process.env.GMAIL_USER,
        subject: `New Newsletter Subscription: ${email}`,
        html: `
          <p>New newsletter subscription:</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        `,
        text: `New newsletter subscription: ${email} - ${new Date().toLocaleString()}`,
      });
    } catch (adminError) {
      console.error("Failed to send admin notification:", adminError);
      // Don't fail the request if admin notification fails
    }

    return NextResponse.json(
      { success: true, message: "Successfully subscribed!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
