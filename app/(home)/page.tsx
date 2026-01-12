import { IndexEvents } from "@/components/events";
import SkeletonLoader from "@/components/events/skeleton";
import { Suspense } from "react";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Todos los Eventos</h1>
      <Suspense fallback={<SkeletonLoader />}>
        <IndexEvents />
      </Suspense>
    </div>
  );
}
