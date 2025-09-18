import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import React, { useState, useEffect } from "react";

const stripePromise = loadStripe(
  "pk_test_51S8TtAGcbeo5zXl6TtYLQRqgQqqMWlRsXpPwnMmnMwhAMdcaO7vnQpJZeww8oiKU9XrBKh2ASCo2p7SNeYbvhs8d008d3M3g0D"
);

// Inner component that uses Stripe hooks
function StripeForm({ onPaymentError, isSubmitting, customerInfo }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasProcessed, setHasProcessed] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements || isProcessing || hasProcessed) {
      return false;
    }

    setIsProcessing(true);
    setHasProcessed(true);

    try {

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donate`,
          payment_method_data: {
            billing_details: {
              name: customerInfo.firstname + " " + customerInfo.lastname,
              email: customerInfo.email,
            },
          },
        },
      });

      if (error) {
        console.error("Payment error:", error);
        onPaymentError(error.message);
        setIsProcessing(false);
        setHasProcessed(false); // Allow retry on error
        return false;
      }
      // If no error, payment succeeded and user will be redirected
      // Don't call onPaymentSuccess here as redirect handles it
    } catch (err) {
      console.error("Unexpected payment error:", err);
      onPaymentError("An unexpected error occurred");
      setIsProcessing(false);
      setHasProcessed(false); // Allow retry on error
    }
  };

  // Use useEffect to handle payment submission properly
  useEffect(() => {
    if (isSubmitting && !hasProcessed) {
      handlePayment();
    }
  }, [isSubmitting, hasProcessed]);

  return (
    <div className="stripe-element">
      <PaymentElement
        options={{
          layout: "auto",
        }}
      />
      {(isSubmitting || isProcessing) && (
        <div className="mt-2 text-sm text-gray-600">Processing payment...</div>
      )}
    </div>
  );
}

// Main Stripe component
export default function Stripe({
  clientSecret,
  onPaymentError,
  isSubmitting,
  customerInfo,
}) {
  if (!clientSecret) {
    return <div className="p-4 text-gray-500">Loading payment form...</div>;
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripeForm
        onPaymentError={onPaymentError}
        isSubmitting={isSubmitting}
        customerInfo={customerInfo}
      />
    </Elements>
  );
}
