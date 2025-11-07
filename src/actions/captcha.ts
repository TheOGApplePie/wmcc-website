"use server";
import { createSafeActionClient } from "next-safe-action";
import { Captcha } from "../app/schemas/captcha";
const SERVER_MISCONFIGURATION = "Server misconfiguration";
const INVALID_CAPTCHA = "Invalid Captcha";
const actionClient = createSafeActionClient();
export const captchaValidation = actionClient
  .inputSchema(Captcha)
  .action(async ({ parsedInput }) => {
    try {
      if (!process.env.RECAPTCHA_SECRET_KEY) {
        throw new Error(SERVER_MISCONFIGURATION);
      }
      const response = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: parsedInput.token,
          }),
        }
      );
      const verification = await response.json();

      if (!verification?.success) {
        throw new Error(INVALID_CAPTCHA);
      }
      return {
        data: { success: verification.success },
        error: null,
      };
    } catch (error) {
      console.error(error);
      return {
        data: null,
        error:
          error instanceof Error && error.message === INVALID_CAPTCHA
            ? "The Captcha is invalid"
            : "Internal Server Error",
      };
    }
  });
