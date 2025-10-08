import { z } from "zod";
export const ContactForm = z.object({
  name: z.string().trim().max(50),
  email: z.email(),
  telephone: z.string().regex(/^\d{10}$|^$/),
  message: z.string().min(20).max(500),
});
