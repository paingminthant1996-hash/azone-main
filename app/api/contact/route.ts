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
    const { name, email, company, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Check if Gmail is configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error("Gmail credentials not configured");
      return NextResponse.json(
        { error: "Contact form is not available at the moment" },
        { status: 500 }
      );
    }

    const transporter = getEmailTransporter();
    const fromEmail = process.env.GMAIL_FROM_EMAIL || process.env.GMAIL_USER || "paingminthant1996@gmail.com";
    const adminEmail = process.env.GMAIL_USER;

    // Send email to admin
    await transporter.sendMail({
      from: fromEmail,
      to: adminEmail,
      replyTo: email,
      subject: `New Contact Form Submission: ${name}${company ? ` (${company})` : ""}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Contact Form Submission</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                ${company ? `<p style="margin: 0 0 10px 0;"><strong>Company:</strong> ${company}</p>` : ""}
                <p style="margin: 0 0 10px 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
              </div>
              <div style="background: white; padding: 20px; border-radius: 8px;">
                <p style="margin: 0 0 10px 0;"><strong>Message:</strong></p>
                <p style="margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="margin: 0; color: #666; font-size: 14px;">
                  Reply directly to this email to respond to ${name}.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
${company ? `Company: ${company}` : ""}
Date: ${new Date().toLocaleString()}

Message:
${message}

---
Reply directly to this email to respond.
      `,
    });

    // Send confirmation email to user
    try {
      await transporter.sendMail({
        from: fromEmail,
        to: email,
        subject: "Thank You for Contacting Azone.store",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Thank You - Azone.store</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">Azone.store</h1>
              </div>
              <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2 style="color: #333; margin-top: 0;">Thank You for Contacting Us!</h2>
                <p>Hi ${name},</p>
                <p>We've received your message and will get back to you as soon as possible.</p>
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0;"><strong>Your Message:</strong></p>
                  <p style="margin: 10px 0 0 0; white-space: pre-wrap; color: #666;">${message}</p>
                </div>
                <p>We typically respond within 24-48 hours.</p>
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                  If you have any urgent questions, please don't hesitate to reach out again.
                </p>
              </div>
              <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                <p>© ${new Date().getFullYear()} Azone.store. All rights reserved.</p>
              </div>
            </body>
          </html>
        `,
        text: `
Thank You for Contacting Us!

Hi ${name},

We've received your message and will get back to you as soon as possible.

Your Message:
${message}

We typically respond within 24-48 hours.

© ${new Date().getFullYear()} Azone.store. All rights reserved.
        `,
      });
    } catch (confirmationError) {
      console.error("Failed to send confirmation email:", confirmationError);
      // Don't fail the request if confirmation email fails
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
