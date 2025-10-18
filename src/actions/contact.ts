"use server";
import { Ratelimit } from "@upstash/ratelimit";
import { createClient } from "../utils/supabase/server";
import { ContactForm } from "../app/schemas/contactForm";
import { ResponseCodes } from "../app/enums/responseCodes";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import { createSafeActionClient } from "next-safe-action";

const actionClient = createSafeActionClient();
const RATE_LIMIT_MESSAGE = "Rate limit exceeded — please wait a minute.";
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 actions/min per IP
});

export const submitForm = actionClient
  .inputSchema(ContactForm)
  .action(async ({ parsedInput }) => {
    try {
      const ip =
        (await headers()).get("x-forwarded-for") ||
        (await headers()).get("x-real-ip") ||
        "unknown";
      if (ip === "unknown") {
        throw new Error("Unknown IP");
      }
      const { success } = await ratelimit.limit(ip);
      // Check rate limit
      if (!success) {
        throw new Error(RATE_LIMIT_MESSAGE);
      }
      const supabase = await createClient();
      const { data, error, count, statusText } = await supabase
        .from("community-feedback")
        .insert(parsedInput);
      return {
        error: error?.message ?? "",
        data,
        count: count ?? null,
        status: ResponseCodes.SUCCESS,
        statusText: statusText ?? "",
      };
    } catch (error) {
      console.error(error);
      return {
        error: error instanceof Error ? error.message : String(error),
        data: null,
        count: null,
        status:
          error instanceof Error && error.message === RATE_LIMIT_MESSAGE
            ? ResponseCodes.TOO_MANY_REQUESTS
            : ResponseCodes.SERVER_ERROR,
        statusText:
          error instanceof Error && error.message === RATE_LIMIT_MESSAGE
            ? "You have submitted too many requests. Please wait a minute"
            : "Internal Server Error",
      };
    }
  });
