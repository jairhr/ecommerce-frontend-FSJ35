"use client";

import {
  Elements,
} from "@stripe/react-stripe-js";

import {
  loadStripe,
} from "@stripe/stripe-js";

import StripePaymentForm from "./StripePaymentForm";

const publishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

const stripePromise = publishableKey
  ? loadStripe(publishableKey)
  : null;

interface StripeCheckoutProps {
  clientSecret: string;
  orderId: number;
}

export default function StripeCheckout({
  clientSecret,
  orderId,
}: StripeCheckoutProps) {
  if (!stripePromise) {
    return (
      <div
        role="alert"
        className="rounded-lg bg-red-50 p-4 text-red-700"
      >
        Stripe no está configurado correctamente.
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
        },
      }}
    >
      <StripePaymentForm
        orderId={orderId}
      />
    </Elements>
  );
}