"use server";
import { createSafeActionClient } from "next-safe-action";
import { ResponseCodes } from "../app/enums/responseCodes";
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
        },
      );
      const verification = await response.json();
      if (!verification?.success) {
        throw new Error(INVALID_CAPTCHA);
      }
      return {
        success: true,
        score: verification.score,
        action: verification.action,
        error: "",
        status: 200,
        statusText: "Captcha Verified Successfully",
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        score: 0,
        action: "",
        error: error instanceof Error ? error.message : String(error),
        status:
          error instanceof Error && error.message === INVALID_CAPTCHA
            ? ResponseCodes.CLIENT_ERROR
            : ResponseCodes.SERVER_ERROR,
        statusText:
          error instanceof Error && error.message === INVALID_CAPTCHA
            ? "The Captcha is invalid"
            : "Internal Server Error",
      };
    }
  });
