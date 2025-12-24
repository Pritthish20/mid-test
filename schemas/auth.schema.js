import z from "zod";

const EmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: "Invalid Email Address" }));

export const signupSchema = z.object({
  name: z.string().trim().min(3),
  email: EmailSchema,
  password: z
    .string()
    .trim()
    .min(6, "Password should atleast consist 6 characters"),
  role: z.enum(["teacher", "student"]),
})

export const loginSchema = z.object({
  email: EmailSchema,
  password: z
    .string()
    .trim()
    .min(6, "Password should atleast consist 6 characters"),
})
