import { z } from "zod";

export const messageSchema = z.object({
  sender: z.string(),
  text: z.string().min(1),
});
