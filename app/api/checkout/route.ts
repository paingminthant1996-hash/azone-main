import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe only if key is available
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-12-15.clover",
  });
};

export async function POST(request: NextRequest) {
  try {
    const { templateId, templateSlug, templateTitle, price } = await request.json();

    if (!templateId || !templateSlug || !templateTitle || price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Handle free templates (price === 0)
    if (price === 0 || price === "0") {
      // For free templates, return download URLs directly
      // We'll get the download URLs from the template in the frontend
      return NextResponse.json({ 
        isFree: true,
        templateId,
        templateSlug,
        message: "Free template - download available"
      });
    }

    // Check if Stripe is configured for paid templates
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables." },
        { status: 500 }
      );
    }

    const stripe = getStripe();

    // Create Stripe Checkout Session for paid templates
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: templateTitle,
              description: `Premium template: ${templateTitle}`,
            },
            unit_amount: Math.round(parseFloat(price.toString()) * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://store.paing.xyz"}/purchase/success?session_id={CHECKOUT_SESSION_ID}&template_id=${templateId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://store.paing.xyz"}/templates/${templateSlug}`,
      metadata: {
        templateId,
        templateSlug,
        templateTitle,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url, isFree: false });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500 }
    );
  }
}

