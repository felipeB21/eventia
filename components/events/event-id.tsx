import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ClockIcon, MapPinIcon } from "lucide-react";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import { Skeleton } from "../ui/skeleton";

export default async function EventId({ id }: { id: string }) {
  const { data, error } = await api.event({ id }).get();

  const eventData = Array.isArray(data) ? data[0] : data;

  if (!eventData || error) return <p>Evento no encontrado</p>;

  const initials = getInitials(data.creator.name);

  return (
    <div>
      {eventData.imageUrl ? (
        <div>
          <Image
            src={eventData.imageUrl}
            alt={`Portada de evento: ${eventData.title}`}
            width={1000}
            height={500}
            className="w-full max-h-100 object-cover"
            priority
          />
        </div>
      ) : (
        <p>hola</p>
      )}
      <div className="my-5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold">{eventData.title}</h1>
            <Badge>{eventData.category}</Badge>
          </div>
          <p>{eventData.description}</p>
          <div className="mt-2 flex items-center gap-10">
            <div className="flex items-center gap-1">
              <MapPinIcon className="w-5 h-5" />
              <span className="font-semibold">{eventData.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="w-5 h-5" />
              <span className="font-semibold">
                El evento comienza el{" "}
                {formatInTimeZone(
                  new Date(data.startsAt),
                  "America/Argentina/Buenos_Aires",
                  "eeee d 'de' MMMM 'de' yyyy, 'A las' HH:mm 'hs'",
                  { locale: es }
                )}
              </span>
            </div>
          </div>
        </div>
        <div>
          <span className="text-sm font-medium text-stone-700">
            Evento creado por:
          </span>
          <Link
            href={`/profile/user/${data.creator.id}`}
            className="flex items-center gap-2"
          >
            <Avatar className="h-9 w-9 font-medium">
              <AvatarImage
                src={data.creator.image ?? ""}
                alt={data.creator.name}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <p className="text-sm font-bold">{data.creator.name}</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function EventIdSkeleton() {
  return (
    <div>
      <Skeleton className="w-full h-100" />
      <div className="my-10 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-60 h-8" />
            <Skeleton className="w-12 h-6" />
          </div>
          <Skeleton className="w-100 h-6 mt-3" />
        </div>
      </div>
    </div>
  );
}
