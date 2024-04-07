import { z } from "zod";

export const UserSign = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string().min(6),
});

export const SigninInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const TodoInp = z.string().max(30);

export const AiInp = z.object({
  aiName: z.string(),
  imageUrl: z.string(),
});
