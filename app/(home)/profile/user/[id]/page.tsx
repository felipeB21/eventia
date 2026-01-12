import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/api";
import { getInitials } from "@/lib/utils";
import { Suspense } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

async function UserContent({
  idPromise,
}: {
  idPromise: Promise<{ id: string }>;
}) {
  const { id } = await idPromise;
  const { data, error } = await api.user.profile({ id }).get();

  if (error || !data) return <p>Usuario no encontrado</p>;

  const initials = getInitials(data.name);

  return (
    <div className="flex items-center gap-4">
      <button className="w-fit">
        <Avatar className="h-20 w-20">
          <AvatarImage src={data.image ?? ""} alt={data.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </button>
      <div>
        <h1 className="text-2xl font-bold">{data.name}</h1>
        <p className="text-muted-foreground">
          Se unio el {""}
          {formatInTimeZone(
            new Date(data.createdAt),
            "America/Argentina/Buenos_Aires",
            "eeee d 'de' MMMM 'de' yyyy",
            { locale: es }
          )}
        </p>
      </div>
    </div>
  );
}

export default function UserProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="container mx-auto">
      <Suspense
        fallback={
          <div className="flex items-center gap-4">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="w-38 h-5" />
              <Skeleton className="w-68 h-4 " />
            </div>
          </div>
        }
      >
        <UserContent idPromise={params} />
      </Suspense>
    </div>
  );
}
