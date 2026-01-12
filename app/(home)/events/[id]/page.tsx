import EventId, { EventIdSkeleton } from "@/components/events/event-id";
import { Suspense } from "react";

export default function EventIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div>
      <Suspense fallback={<EventIdSkeleton />}>
        <EventContent idPromise={params} />
      </Suspense>
    </div>
  );
}

async function EventContent({
  idPromise,
}: {
  idPromise: Promise<{ id: string }>;
}) {
  const { id } = await idPromise;
  return <EventId id={id} />;
}
