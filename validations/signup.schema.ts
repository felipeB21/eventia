import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(1, "El nombre es obligatorio"),
    email: z.email("Email inválido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type SignupValues = z.infer<typeof signupSchema>;
