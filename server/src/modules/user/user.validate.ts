import z from "zod";
import { UserRole } from "./user.constrain";

const userCreateZodSchema = z.object({
  firstName: z
    .string()
    .min(2, "Name Must be in 2 characters")
    .max(30, "Name can't be more that 30 characters"),
  lastName: z
    .string()
    .min(2, "Name Must be in 2 characters")
    .max(30, "Name can't be more that 30 characters"),
  email: z.email({ error: "Invalid email" }),
  phone: z.string(),
  password: z.string(),
  role: z.enum(UserRole),
});

const userLoginZodSchema = z.object({
  email: z.email({ error: "Invalid email" }),
  password: z.string(),
});

export const userZodSchema = {
  userCreateZodSchema,
  userLoginZodSchema,
};
