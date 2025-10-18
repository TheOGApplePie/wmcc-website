import { z } from "zod";
export const Captcha = z.object({
  token: z.string().trim(),
});
