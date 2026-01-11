import Link from "next/link";
import { NavigationMenuDemo } from "./nav-menu";
import { SessionNav } from "./user/session-nav";
import { Search } from "./search";
import { GalleryVerticalEnd } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "./ui/skeleton";

const LINKS = [
  { href: "events/new", name: "Crear evento" },
  { href: "help", name: "Ayuda" },
] as const;

export default function Navbar() {
  return (
    <header className="border-b rounded-b-xl">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Link
            href={"/"}
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Eventia
          </Link>
          <nav className="flex items-center gap-6">
            <ul className="flex items-center gap-3">
              <NavigationMenuDemo />
              {LINKS.map((link) => (
                <Link
                  href={`/${link.href}`}
                  key={link.href}
                  className="block space-y-1 rounded-md p-3 no-underline outline-hidden transition-colors hover:bg-accent focus:bg-accent text-sm font-medium leading-none cursor-default"
                >
                  {link.name}
                </Link>
              ))}
            </ul>
            <Search />
          </nav>
        </div>
        <Suspense
          fallback={
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-50" />
              </div>
            </div>
          }
        >
          <SessionNav />
        </Suspense>
      </div>
    </header>
  );
}
