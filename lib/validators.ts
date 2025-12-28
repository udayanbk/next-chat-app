import { z } from "zod";

/* REGISTER */
export const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6),
});

/* LOGIN */
export const loginSchema = z.object({
  identifier: z.string().min(3), // username OR email
  password: z.string().min(6),
});
