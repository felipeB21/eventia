"use client";
import CoverUpload from "../cover-upload";
import { LocationPicker } from "@/components/location-picker";
import { FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Button } from "../ui/button";
import { DateAndTime } from "../date-time";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState } from "react";

const CATEGORIES = [
  "deportes",
  "musica",
  "aire_libre",
  "fiesta",
  "teatro",
  "show",
  "politica",
  "vehiculos",
  "futbol",
  "basket",
  "running",
  "ciclismo",
  "carreras",
  "escenario",
  "ajedrez",
];

type CreateEventInput = {
  title: string;
  description: string;
  location: string;
  image: File | null;
  category: string;
  startsAt: Date;
};

export const createEventSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  description: z
    .string()
    .min(10, "Describe un poco más el evento")
    .max(250, "Tu descripción es muy larga"),
  location: z.string().min(1, "La ubicación es obligatoria"),
  category: z.string().min(1, "Selecciona una categoría"),
  startsAt: z.date().refine((date) => date > new Date(), {
    message: "El evento no puede empezar en el pasado",
  }),
  image: z
    .any()
    .refine((file) => file instanceof File, "La imagen es obligatoria"),
});

export default function NewEvent() {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (value: CreateEventInput) => {
      setServerError(null);
      const res = await api.event.create.post({
        title: value.title,
        description: value.description,
        image: value.image!,
        category: value.category,
        location: value.location,
        startsAt: value.startsAt.toISOString(),
      });

      if (res.error) throw new Error(res.error.value.message);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      if (data.success) {
        push(`/events/${data.id}`);
      }
    },
    onError: (err) => {
      setServerError(
        `${err.message}. Es probable que te faltó rellenar un campo.`
      );
    },
  });

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      category: "",
      image: null as File | null,
      startsAt: new Date(new Date().getTime() + 60000),
    } as CreateEventInput,
    validators: {
      onSubmit: createEventSchema,
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value);
    },
  });

  return (
    <form
      className="mt-10 mb-20"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <div className="grid grid-cols-2 gap-10">
          <form.Field name="title">
            {(field) => (
              <div className="flex flex-col gap-3">
                <FieldLabel htmlFor={field.name}>Título</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ej: Torneo de Ajedrez..."
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-500 text-xs">
                    {field.state.meta.errors.map((err) => err?.message)}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="location">
            {(field) => (
              <div className="flex flex-col gap-3">
                <FieldLabel htmlFor={field.name}>Ubicación</FieldLabel>
                <LocationPicker
                  onChange={(val) => {
                    field.handleChange(val);
                    field.validate("change");
                  }}
                  defaultLocation={field.state.value}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-500 text-xs">
                    {field.state.meta.errors.map((err) => err?.message)}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>

        <div className="grid grid-cols-2 items-start gap-10">
          <form.Field name="startsAt">
            {(field) => (
              <div className="flex flex-col gap-3">
                <DateAndTime
                  value={field.state.value}
                  onChange={(date) => field.handleChange(date)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="category">
            {(field) => (
              <div className="flex flex-col gap-3">
                <FieldLabel htmlFor={field.name}>Categoría</FieldLabel>
                <Select
                  value={field.state.value || ""}
                  onValueChange={(val) => {
                    if (val !== field.state.value) {
                      field.handleChange(val);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Disponibles</SelectLabel>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() +
                            cat.slice(1).replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-500 text-xs">
                    {field.state.meta.errors.map((err) => err?.message)}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>

        <form.Field name="description">
          {(field) => (
            <div className="flex flex-col gap-3">
              <FieldLabel htmlFor={field.name}>Descripción</FieldLabel>
              <Textarea
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Detalles del evento..."
                className="resize-none h-32"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-500 text-xs">
                  {field.state.meta.errors.map((err) => err?.message)}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="image">
          {(field) => (
            <div className="flex flex-col gap-3">
              <FieldLabel htmlFor={field.name}>Imagen de Portada</FieldLabel>
              <CoverUpload
                onImageChange={(file) => {
                  field.handleChange(file);
                  field.validate("change");
                }}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-500 text-xs">
                  {field.state.meta.errors.map((err) => err?.message)}
                </p>
              )}
            </div>
          )}
        </form.Field>
      </FieldGroup>
      {serverError && (
        <p className="text-red-500 text-sm font-medium mb-4 bg-red-50 p-3 rounded-md border border-red-200">
          {serverError}
        </p>
      )}
      <div className="mt-8">
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Subiendo..." : "Crear evento"}
        </Button>
      </div>
    </form>
  );
}
