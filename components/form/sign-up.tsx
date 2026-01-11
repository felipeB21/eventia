"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { signupSchema } from "@/validations/signup.schema";
import { useRouter } from "next/navigation";

const formatName = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { push } = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    onSubmit: async ({ value, formApi }) => {
      const cleanName = formatName(value.name.trim());

      const res = await authClient.signUp.email({
        name: cleanName,
        email: value.email.toLowerCase().trim(),
        password: value.password,
      });

      if (res.error) {
        if (res.error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
          formApi.setFieldMeta("email", (prev) => ({
            ...prev,
            errorMap: {
              onSubmit: "Este email ya está registrado",
            },
          }));
        }
        return;
      }

      push("/");
    },

    validators: {
      onSubmit: ({ value }) => {
        const result = signupSchema.safeParse(value);
        if (!result.success) {
          return { fields: result.error.flatten().fieldErrors };
        }
      },
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Crear cuenta</CardTitle>
          <CardDescription>
            Ingresá tu email para crear tu cuenta
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field name="name">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="name">Nombre completo</FieldLabel>
                    <Input
                      id="name"
                      placeholder="Juan Pérez"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        const formatted = formatName(e.target.value);
                        field.handleChange(formatted);
                      }}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <FieldDescription className="text-red-500 text-xs">
                        {field.state.meta.errors.join(", ")}
                      </FieldDescription>
                    )}
                  </Field>
                )}
              </form.Field>

              <form.Field name="email">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@ejemplo.com"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <FieldDescription className="text-red-500 text-xs">
                        {field.state.meta.errors.join(", ")}
                      </FieldDescription>
                    )}
                  </Field>
                )}
              </form.Field>

              <div className="grid grid-cols-2 gap-4">
                <form.Field name="password">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                      <Input
                        id="password"
                        type="password"
                        placeholder="********"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <FieldDescription className="text-red-500 text-xs">
                          {field.state.meta.errors[0]}
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                </form.Field>

                <form.Field name="confirmPassword">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="confirm-password">
                        Confirmar
                      </FieldLabel>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="********"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <FieldDescription className="text-red-500 text-xs">
                          {field.state.meta.errors[0]}
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                </form.Field>
              </div>

              <Field>
                <form.Subscribe selector={(state) => state.isSubmitting}>
                  {(isSubmitting) => (
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
                    </Button>
                  )}
                </form.Subscribe>

                <FieldDescription className="text-center">
                  ¿Ya tenés una cuenta?{" "}
                  <Link
                    href="/sign-in"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Iniciar sesión
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <p className="px-6 text-center text-xs text-muted-foreground">
        Al continuar, aceptás nuestros{" "}
        <a href="#" className="underline">
          Términos
        </a>{" "}
        y{" "}
        <a href="#" className="underline">
          Privacidad
        </a>
        .
      </p>
    </div>
  );
}
