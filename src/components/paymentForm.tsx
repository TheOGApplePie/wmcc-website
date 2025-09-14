"use client";
import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { PaymentElement } from "@stripe/react-stripe-js";
export default function PaymentForm() {
  const stripePromise = loadStripe("");
  const [recurring, setRecurring] = useState(true);
  const [amount, setAmount] = useState(null);
  const [step, setStep] = useState(1);
  const [clientSecret, setClientSecret] = useState("");
  const options: StripeElementsOptions = {
    mode: "payment",
    amount: 1099,
    currency: "cad",
  };
  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: "xl-tshirt", amount: 1000 }] }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);
  const recurringFields = [
    { id: "monthly", value: "true", label: "Monthly" },
    { id: "one-time", value: "false", label: "One Time" },
  ];
  const amountFields = [
    { id: "twenty", value: "20", label: "$20" },
    { id: "fifty", value: "50", label: "$50" },
    { id: "one-hundred", value: "100", label: "$100" },
    { id: "two-hundred-and-fifty", value: "250", label: "$250" },
    { id: "custom", value: "custom", label: "Custom Amount" },
  ];
  function validateStep() {
    if (step === 1) {
    }
  }
  return (
    <form action="">
      <div className="step">
        <div className="recurring border-b p-4">
          <fieldset className="w-full p-4 flex justify-center items-center">
            <legend>How often do you want to donate?</legend>
            {recurringFields.map((field) => {
              return (
                <label
                  key={field.id}
                  htmlFor={field.id}
                  className={
                    (recurring === (field.value as unknown as boolean)
                      ? "bg-[var(--secondary-colour-green)] text-white font-bold"
                      : "") +
                    " p-8 mx-1 hover:ring hover:ring-[var(--secondary-colour-green)]"
                  }
                >
                  <input
                    type="radio"
                    id={field.id}
                    name="recurring"
                    value={field.value}
                    hidden={true}
                    onChange={(ev) => {
                      setRecurring(ev.target.value as unknown as boolean);
                    }}
                  />
                  {field.label}
                </label>
              );
            })}
          </fieldset>
        </div>
        <div className="amount p-4">
          <fieldset className="w-full p-4 grid gap-2 grid-cols-3">
            <legend>How much would you like to donate?</legend>
            {amountFields.map((field) => {
              return (
                <label
                  key={field.id}
                  htmlFor={field.id}
                  className={
                    (amount === field.value
                      ? "bg-[var(--secondary-colour-green)] text-white font-bold"
                      : "") +
                    " p-4 hover:ring hover:ring-[var(--secondary-colour-green)] flex justify-center items-center"
                  }
                >
                  <input
                    type="radio"
                    id={field.id}
                    name="amount"
                    value={field.value}
                    hidden={true}
                    onChange={(ev) => {
                      setAmount(ev.target.value);
                    }}
                  />
                  {field.label}
                </label>
              );
            })}
          </fieldset>
        </div>
        <div className={amount === "custom" ? "w-full py-4" : "hidden"}>
          <input
            className="w-full px-4 py-2 text-xl ring ring-black ring-[1px] rounded rounded-b-xl"
            type="number"
            min={0}
            name="custom-amount"
            id="custom-amount"
          />
        </div>
        <div className="w-full flex justify-center">
          <button
            className="py-4 px-8 rounded bg-main-colour-blue text-white"
            onClick={validateStep}
          >
            {step === 1 ? "Next" : "Submit"}
          </button>
        </div>
      </div>
      <div className="step">
        <Elements stripe={stripePromise} options={options}>
          <PaymentElement />
        </Elements>
      </div>
    </form>
  );
}
