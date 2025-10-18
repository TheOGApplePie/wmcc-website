"use client";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";

import { ResponseCodes } from "../app/enums/responseCodes";
import { captchaValidation } from "../actions/captcha";
import { submitForm } from "../actions/contact";

declare global {
  interface Window {
    handleRecaptcha: (token: string) => Promise<void>;
    handleRecaptchaExpired: () => void;
    handleRecaptchaError: () => void;
  }
}
export default function ContactForm() {
  const { executeAsync: submitFeedback } = useAction(submitForm, {
    onSettled: feedbackSuccess,
  });
  const { executeAsync: validateCaptcha } = useAction(captchaValidation, {
    onSettled: onCaptchaValidation,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });
  useEffect(() => {
    window.handleRecaptcha = handleRecaptcha;
    window.handleRecaptchaExpired = handleRecaptchaExpired;
    window.handleRecaptchaError = handleRecaptchaError;
  });
  const phoneNumberRegex = /^\d{10}$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [captchaValid, setCaptchaValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onCaptchaValidation({
    result,
  }: {
    result: Awaited<ReturnType<typeof captchaValidation>>;
  }) {
    console.log(result.data);
    setCaptchaValid(result.data?.success ?? false);
  }
  async function feedbackSuccess({
    result,
  }: {
    result: Awaited<ReturnType<typeof submitForm>>;
  }) {
    setIsSubmitting(false);
    const status = result.data?.status;
    let message = "";
    switch (status) {
      case ResponseCodes.SUCCESS:
        message =
          "Thank you! we have recieved your message and will be in touch as needed";
        (document.getElementById("submission-form") as HTMLFormElement).reset();
        grecaptcha.reset();
        break;
      case ResponseCodes.CLIENT_ERROR:
        message =
          "Hmmm, there seems to be something wrong with your form. Can you double check the details?";
        break;
      default:
        message = "Something went wrong, please try again later";
        break;
    }
    alert(message);
  }
  async function handleFormSubmit(formData: FieldValues): Promise<void> {
    if (captchaValid) {
      setIsSubmitting(true);
      submitFeedback({
        email: formData["email"],
        message: formData["message"],
        name: formData["name"],
        telephone: formData["telephone"],
      });
    } else {
      alert("Please verify the captcha before submitting");
    }
  }

  async function handleRecaptcha(token: string): Promise<void> {
    validateCaptcha({
      token,
    });
  }

  function handleRecaptchaExpired() {
    alert("The recaptcha has expired. Please verify again.");
    setCaptchaValid(false);
  }
  function handleRecaptchaError() {
    alert("Something went wrong, please try again later.");
    setCaptchaValid(false);
  }

  return (
    <form
      id="submission-form"
      className="sm:p-4 mb-3 bg-light text-xl"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div>
        <label className="text-white" htmlFor="name">
          Full Name*
          <input
            className="w-full h-12 rounded p-2 text-black"
            type="text"
            placeholder="Name"
            maxLength={50}
            {...register("name", { required: true, maxLength: 50 })}
          />
          {errors.name && errors.name.type === "required" && (
            <span className="text-red-600">Please enter your name.</span>
          )}
          {errors.name && errors.name.type === "maxLength" && (
            <span className="text-red-600">
              You have entered a name that is too long, is there a shorter name
              we can refer to you with?
            </span>
          )}
        </label>
      </div>
      <div className="py-4">
        <label htmlFor="email" className="text-white">
          Email Address*
          <input
            className="w-full h-12 rounded p-2 text-black"
            type="email"
            maxLength={50}
            placeholder="Email"
            {...register("email", {
              required: true,
              maxLength: 50,
              pattern: emailPattern,
            })}
          />
          {errors.email && errors.email.type === "required" && (
            <span className="text-red-600">Please enter your email.</span>
          )}
          {errors.email && errors.email.type === "maxLength" && (
            <span className="text-red-600">
              You have entered an email that is too long, is there a shorter
              email we can reach you at?
            </span>
          )}
          {errors.email && errors.email.type === "pattern" && (
            <span className="text-red-600">
              Hmmm... This doesn&apos;t look like a valid email.
            </span>
          )}
        </label>
      </div>
      <div className="pb-5">
        <label htmlFor="telephone" className="text-white">
          Phone Number
          <input
            className="w-full h-12 rounded p-2 text-black"
            type="tel"
            placeholder="Phone Number"
            {...register("telephone", {
              pattern: phoneNumberRegex,
            })}
          />
          {errors.telephone && errors.telephone.type === "pattern" && (
            <span className="text-red-600">
              Your phone number must have exactly 10 digits (numbers only, no
              letters or other characters).
            </span>
          )}
        </label>
      </div>
      <div>
        <label htmlFor="message" className="text-white">
          Message*
          <textarea
            className="resize-none w-full rounded p-2 text-black"
            rows={4}
            maxLength={500}
            placeholder="Enter your message"
            {...register("message", {
              required: true,
              minLength: 20,
              maxLength: 500,
            })}
          ></textarea>
          {errors.message && errors.message.type === "required" && (
            <span className="text-red-600">Please enter your message.</span>
          )}
          {errors.message && errors.message.type === "maxLength" && (
            <span className="text-red-600">
              Your message seems to be too long, you&apos;ve exceeded the 500
              character limit. Please shorten your message. Perhaps you&apos;d
              like to visit us at our centre for a more fruitful discussion.
            </span>
          )}
          {errors.message && errors.message.type === "minLength" && (
            <span className="text-red-600">
              Your message doesn&apos;t seem to be long enough. Please provide
              us with some more detail (minimum 20 characters).
            </span>
          )}
        </label>
      </div>
      <div className="text-center mt-5">
        <div
          className="g-recaptcha"
          data-sitekey="6Lf7ItMrAAAAAMNWKG-Fi0Kzj6ZGKUiVAomT_1zi"
          data-callback="handleRecaptcha"
          data-expired-callback="handleRecaptchaExpired"
          data-error-callback="handleRecaptchaError"
        ></div>
        <button
          className={`border-0 text-xl p-3 mt-3 rounded text-white bg-secondary-colour-green hover:bg-[var(--secondary-colour-green-light)] disabled:bg-green-950 hover:disabled:cursor-not-allowed ${isSubmitting ? "submitting" : ""}`}
          type="submit"
          disabled={Object.keys(errors).length > 0 || isSubmitting}
        >
          {isSubmitting ? "Submitting" : "Submit"}
        </button>
      </div>
    </form>
  );
}
