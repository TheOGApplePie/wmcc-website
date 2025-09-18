import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SERVER_KEY);

export async function POST(request) {
  try {
    const {
      amount,
      currency = "cad",
      isRecurring,
      customerInfo,
    } = await request.json();

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      metadata: {
        customer_name: customerInfo?.fullname || "",
        customer_email: customerInfo?.email || "",
        is_recurring: isRecurring ? "true" : "false",
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error("Error creating payment intent:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
