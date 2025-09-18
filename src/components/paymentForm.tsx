"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Stripe from "./stripe";
import { useSearchParams } from "next/navigation";

export default function PaymentForm() {
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useForm();
  const redirectStatus = useSearchParams().get("redirect_status");
  const [recurring, amount] = watch(["isRecurring", "amountToDonate"]);
  const [step, setStep] = useState(1);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [isCreatingPaymentIntent, setIsCreatingPaymentIntent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Create payment intent when step 3 is reached and form is valid
  useEffect(() => {
    if (step === 3 && !clientSecret && !isCreatingPaymentIntent) {
      createPaymentIntent();
    }
  }, [step]);
  if (redirectStatus === "succeeded") {
    return (
      <div className="p-8 flex items-center">
        <img
          className="gratitude-image"
          src="cupped-hands.png"
          alt="cupped hands symbolizing gratitude"
        />
        <h3>We have recieved your donation. Jazak Allahu Khairan</h3>
      </div>
    );
  } else if (redirectStatus === "failed") {
    return (
      <div className="p-8 flex items-center">
        <img className="alert-flashing mx-2" src="alert.png" alt="alert icon" />
        <h3>
          We were unable to process your payment at this time. Please try again
          later. You can also make a donation in person at the centre. If you
          see any discrepancy with your bank, please email us at
          wmccofficial@gmail.com
        </h3>
      </div>
    );
  } else if (redirectStatus === "canceled") {
    return (
      <div className="p-8 flex justify-center">
        <img className="alert-flashing mx-2" src="alert.png" alt="alert icon" />
        <h3>
          The transaction was canceled before it could be completed. If you see
          any discrepancy with your bank, please email us at
          wmccofficial@gmail.com
        </h3>
      </div>
    );
  }

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

  const createPaymentIntent = async () => {
    setIsCreatingPaymentIntent(true);
    setPaymentError("");

    const formValues = getValues();
    const donationAmount =
      formValues.amountToDonate === "custom"
        ? parseFloat(formValues.customAmountToDonate)
        : parseFloat(formValues.amountToDonate);

    try {
      const response = await fetch("/api/donate/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: donationAmount,
          currency: "cad",
          isRecurring: formValues.isRecurring === "true",
          customerInfo: {
            fullname: formValues.fullname,
            email: formValues.email,
          },
        }),
      });

      const data = await response.json();

      if (data.error) {
        setPaymentError(data.error);
      } else {
        setClientSecret(data.clientSecret);
      }
    } catch (error) {
      setPaymentError("Failed to initialize payment. Please try again.");
      console.error("Payment intent creation failed:", error);
    } finally {
      setIsCreatingPaymentIntent(false);
    }
  };

  const handlePaymentError = (error) => {
    setPaymentError(error);
    setIsSubmitting(false);
  };

  async function passesValidation() {
    const passedValidation = await trigger(
      ["isRecurring", "amountToDonate", "customAmountToDonate"],
      { shouldFocus: true }
    );
    return passedValidation;
  }

  async function passesStep2Validation() {
    const passedValidation = await trigger(["firstname", "lastname", "email"], {
      shouldFocus: true,
    });
    return passedValidation;
  }

  return (
    <form onSubmit={handleSubmit(() => {})}>
      <div className="grid grid-cols-1 overflow-x-hidden">
        {/* Step 1 - Donation Details */}
        <div
          className={`border-xl col-start-1 row-start-1 pt-2 transition-all duration-700 ease-in-out transform
          ${step === 1 ? " translate-x-0" : " -translate-x-full"}`}
        >
          <div className="recurring p-4">
            <fieldset className="w-full p-4 flex justify-center items-center">
              <legend>How often do you want to donate?</legend>
              {recurringFields.map((field) => {
                return (
                  <label
                    key={field.id}
                    htmlFor={field.id}
                    className={
                      (recurring === field.value
                        ? "bg-[var(--secondary-colour-green)] text-white font-bold"
                        : "") +
                      " p-8 mx-1 ring ring-transparent transition duration-100 hover:ring-[var(--secondary-colour-green)]"
                    }
                  >
                    <input
                      type="radio"
                      id={field.id}
                      hidden
                      {...register("isRecurring", {
                        required:
                          "Please select the frequency of your donation",
                      })}
                      value={field.value}
                    />
                    {field.label}
                  </label>
                );
              })}
            </fieldset>
            {errors.isRecurring && (
              <span className="error-element text-red-600">
                {errors.isRecurring.message as string}
              </span>
            )}
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
                      "p-4 ring ring-transparent transition duration-100 hover:ring-[var(--secondary-colour-green)] flex justify-center items-center " +
                      (amount === field.value
                        ? " bg-[var(--secondary-colour-green)] text-white font-bold"
                        : "")
                    }
                  >
                    <input
                      type="radio"
                      id={field.id}
                      value={field.value}
                      hidden
                      {...register("amountToDonate", {
                        required: "Please select how much you'd like to donate",
                      })}
                    />
                    {field.label}
                  </label>
                );
              })}
              <input
                id="customValue"
                disabled={amount !== "custom"}
                min={1}
                className={
                  "text-xl ring-slate-400 ring-[1px] rounded-xl px-4 disabled:bg-slate-200 disabled:text-slate-500 focus-visible:outline-slate-400"
                }
                {...register("customAmountToDonate", {
                  validate: {
                    checkCustomAmount: (
                      customAmountToDonate,
                      { amountToDonate }
                    ) => {
                      if (
                        amountToDonate === "custom" &&
                        (!customAmountToDonate || +customAmountToDonate <= 0)
                      )
                        return "Please enter a value greater than 0";
                    },
                  },
                })}
                type="number"
                placeholder="Enter amount"
              />
            </fieldset>
            {errors.amountToDonate && (
              <span className="error-element text-red-600">
                {errors.amountToDonate.message as string}
              </span>
            )}
            {errors.customAmountToDonate && amount === "custom" && (
              <span className="error-element text-red-600">
                {errors.customAmountToDonate.message as string}
              </span>
            )}
          </div>
        </div>

        {/* Step 2 - Payment Details */}
        <div
          className={`col-start-1 row-start-1 w-full transition-all duration-700 ease-in-out
          ${step >= 2 ? " translate-x-0" : " translate-x-full"}`}
        >
          <div className="m-4">
            <div>
              <button
                className="m-4 mb-0 p-4 rounded-xl duration-200 hover:text-white transition border-[var(--cancel-error-colour)] hover:bg-[var(--cancel-error-colour)]"
                type="button"
                onClick={() => {
                  setStep(step - 1);
                  setPaymentError("");
                  setClientSecret("");
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Go Back
              </button>
            </div>
            <div className="m-4 grid grid-cols-1 overflow-x-hidden">
              <div
                className={`grid grid-cols-2 gap-4 px-2 col-start-1 row-start-1 w-full transition-all duration-700 ease-in-out
          ${step <= 2 ? " translate-x-0" : " -translate-x-full"}`}
              >
                <div className="col-span-1">
                  <label>
                    First Name
                    <input
                      type="text"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
                      {...register("firstname", {
                        required: "Your first name is required",
                      })}
                    />
                    {errors.firstname && (
                      <span className="text-red-600">
                        {errors.firstname.message as string}
                      </span>
                    )}
                  </label>
                </div>
                <div className="col-span-1">
                  <label>
                    Last Name
                    <input
                      type="text"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
                      {...register("lastname", {
                        required: "Your last name is required",
                      })}
                    />
                    {errors.lastname && (
                      <span className="text-red-600">
                        {errors.lastname.message as string}
                      </span>
                    )}
                  </label>
                </div>
                <div className="col-span-2">
                  <label>
                    Email
                    <input
                      type="email"
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
                      {...register("email", {
                        required: "Your email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Please enter a valid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <span className="text-red-600">
                        {errors.email.message as string}
                      </span>
                    )}
                  </label>
                </div>
              </div>
              <div
                className={`col-start-1 row-start-1 border rounded-xl w-full transition-all duration-700 ease-in-out
          ${step >= 3 ? " translate-x-0" : " translate-x-full"}`}
              >
                <div className="m-4">
                  {/* Payment Form */}
                  <div className=" pt-4">
                    <h3 className="text-lg font-medium mb-4">
                      Payment Information
                    </h3>
                    {isCreatingPaymentIntent && (
                      <div className="p-4 text-center text-gray-600">
                        Preparing payment form...
                      </div>
                    )}
                    {clientSecret && (
                      <Stripe
                        clientSecret={clientSecret}
                        onPaymentError={handlePaymentError}
                        isSubmitting={isSubmitting}
                        customerInfo={getValues()}
                      />
                    )}
                    {paymentError && (
                      <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {paymentError}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="w-full flex justify-center">
        <button
          className="py-4 px-8 rounded-xl disabled:bg-gray-500 bg-[var(--main-colour-blue)] text-white disabled:cursor-not-allowed transition-all duration-700 ease-in-out"
          type="button"
          disabled={isSubmitting || (step === 2 && isCreatingPaymentIntent)}
          onClick={async () => {
            if (
              (step === 1 && (await passesValidation())) ||
              (step === 2 && (await passesStep2Validation()))
            ) {
              setStep(step + 1);
            } else if (step === 3) {
              setIsSubmitting(true);
            }
          }}
        >
          {step <= 2 && "Next"}
          {step === 3 && isCreatingPaymentIntent && "Loading..."}
          {step === 3 &&
            !isCreatingPaymentIntent &&
            !isSubmitting &&
            "Complete Donation"}
          {step === 3 && isSubmitting && "Processing..."}
        </button>
      </div>
    </form>
  );
}
