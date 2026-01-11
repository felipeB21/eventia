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
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { push } = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value, formApi }) => {
      const res = await authClient.signIn.email({
        email: value.email.toLowerCase().trim(),
        password: value.password,
        callbackURL: "/",
      });

      if (res.error) {
        const errorMsg =
          res.error.code === "INVALID_EMAIL_OR_PASSWORD"
            ? "Credenciales incorrectas"
            : "Ocurrió un error inesperado";

        formApi.setFieldMeta("password", (prev) => ({
          ...prev,
          errorMap: { onSubmit: errorMsg },
        }));
        return;
      }

      push("/");
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = loginSchema.safeParse(value);
        if (!result.success) {
          return { fields: result.error.flatten().fieldErrors };
        }
      },
    },
  });

  const handleSocialLogin = async (provider: "google" | "apple") => {
    await authClient.signIn.social({
      provider,
      callbackURL: "/",
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bienvenido de nuevo</CardTitle>
          <CardDescription>
            Inicia sesión con tu cuenta de Apple o Google
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleSocialLogin("apple")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Apple
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleSocialLogin("google")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Google
                </Button>
              </div>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card text-muted-foreground text-xs">
                O continúa con
              </FieldSeparator>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  await form.handleSubmit();
                }}
                className="grid gap-4"
              >
                <form.Field name="email">
                  {(field) => (
                    <div className="grid gap-2">
                      <FieldLabel htmlFor="email">
                        Correo electrónico
                      </FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@ejemplo.com"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-red-500 text-xs">
                          {field.state.meta.errors[0]}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="password">
                  {(field) => (
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                        <Link
                          href="/forgot-password"
                          className="ml-auto text-xs underline underline-offset-4 hover:text-primary"
                        >
                          ¿Olvidaste tu contraseña?
                        </Link>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="********"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-red-500 text-xs">
                          {field.state.meta.errors[0]}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Subscribe selector={(state) => state.isSubmitting}>
                  {(isSubmitting) => (
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                    </Button>
                  )}
                </form.Subscribe>
              </form>

              <FieldDescription className="text-center text-sm">
                ¿No tienes una cuenta?{" "}
                <Link
                  href="/sign-up"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Regístrate
                </Link>
              </FieldDescription>
            </FieldGroup>
          </div>
        </CardContent>
      </Card>
      <p className="px-6 text-center text-xs text-muted-foreground">
        Al continuar, aceptas nuestros{" "}
        <a href="#" className="underline">
          Términos
        </a>{" "}
        y la{" "}
        <a href="#" className="underline">
          Privacidad
        </a>
        .
      </p>
    </div>
  );
}
