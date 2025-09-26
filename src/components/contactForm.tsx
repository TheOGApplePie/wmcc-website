"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    window["handleRecaptcha"] = handleRecaptcha;
    window["handleRecaptchaExpired"] = handleRecaptchaExpired;
    window["handleRecaptchaError"] = handleRecaptchaError;
  });
  const phoneNumberRegex = /\d{10}/;
  const [captchaValid, setCaptchaValid] = useState(false);
  async function handleFormSubmit(formData): Promise<void> {
    if (captchaValid) {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      alert(
        response.status === 200
          ? "Thank you! we have recieved your message and will be in touch as needed"
          : "Something went wrong, please try again later"
      );
      if (response.status === 200) {
        (document.getElementById("submission-form") as HTMLFormElement).reset();
        grecaptcha.reset();
      }
    } else {
      alert("Please verify the captcha before submitting");
    }
  }
  async function handleRecaptcha(token): Promise<void> {
    const response = await fetch("/api/captcha", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
    const { success } = await response.json();
    if (success as boolean) {
      setCaptchaValid(true);
    } else {
      setCaptchaValid(false);
    }
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
            {...register("email", { required: true, maxLength: 50 })}
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
              maxLength: 10,
            })}
          />
          {errors.telephone && errors.telephone.type === "pattern" && (
            <span className="text-red-600">
              Make sure your phone number only has numbers in it. Please do not
              put other characters in it. Please note we only support Canadian
              phone numbers at this time.
            </span>
          )}
          {errors.telephone && errors.telephone.type === "maxLength" && (
            <span className="text-red-600">
              Your phone number must be exactly 10 digits long (North American
              standard). Please note we only support Canadian phone numbers at
              this time.
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
            minLength={20}
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
              Your message seems to be too long, perhaps you&apos;d like to
              visit us at our centre for a more fruitful discussion.
            </span>
          )}
          {errors.message && errors.message.type === "minLength" && (
            <span className="text-red-600">
              Your message doesn&apos;t seem to be long enough. Please provide
              us with some more detail.
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
          className="border-0 text-xl p-3 rounded text-white bg-secondary-colour-green hover:bg-[var(--secondary-colour-green-light)]"
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
