import { NextRequest } from "next/server";
import * as stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 20,
      currency: "cad",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: false,
      },
    });
  } catch (error) {}
}
