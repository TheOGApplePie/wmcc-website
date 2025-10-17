"use server";
import { Ratelimit } from "@upstash/ratelimit";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";
import { ContactForm } from "../../schemas/contactForm";
import { ResponseCodes } from "../../enums/responseCodes";
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
      const { success } = await ratelimit.limit(ip);
      // Check rate limit
      if (!success) {
        throw new Error(RATE_LIMIT_MESSAGE);
      }
      const supabase = await createClient();
      const insertionResponse = await supabase
        .from("community-feedback")
        .insert(parsedInput);
      return insertionResponse;
    } catch (error) {
      console.error(error);
      return {
        error: error,
        data: null,
        count: null,
        status:
          (error as { message: string }).message === RATE_LIMIT_MESSAGE
            ? ResponseCodes.TOO_MANY_REQUESTS
            : ResponseCodes.SERVER_ERROR,
        statusText: error,
      };
    }
  });
