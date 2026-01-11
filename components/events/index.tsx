import { api } from "@/lib/api";
import Link from "next/link";
import ColorChangeCards from "../color-change-card";
import { Button } from "../ui/button";
import { cacheLife } from "next/cache";

export async function IndexEvents() {
  "use cache";
  cacheLife("hours");
  const { data } = await api.events.get({ query: { limit: 5, offset: 0 } });

  if (!data || data.length === 0) return <p>Todavía no hay eventos</p>;

  return (
    <div className="my-5 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((dta) => (
          <Link href={`/events/${dta.id}`} key={dta.id} className="block">
            <ColorChangeCards event={dta} />
          </Link>
        ))}
      </div>

      <Link href={"/events"} className="block">
        <Button className="w-full">Ver Más</Button>
      </Link>
    </div>
  );
}
