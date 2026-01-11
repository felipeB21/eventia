"use client";

import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import {
  MusicIcon,
  DumbbellIcon,
  PartyPopperIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  NavigationIcon,
  VerifiedIcon,
} from "lucide-react";

export function NavigationMenuDemo() {
  const isMobile = useIsMobile();

  return (
    <NavigationMenu viewport={isMobile} className="z-50">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Eventos</NavigationMenuTrigger>

          <NavigationMenuContent>
            <div className="grid w-130 grid-cols-2 gap-4 p-4">
              <div>
                <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
                  Explorar
                </h4>

                <ul className="space-y-2">
                  <IconLink
                    href="/events/today"
                    icon={<ClockIcon className="h-4 w-4" />}
                    label="Hoy"
                    description="Eventos que suceden hoy"
                  />

                  <IconLink
                    href="/events/nearby"
                    icon={<NavigationIcon className="h-4 w-4" />}
                    label="Cerca de mí"
                    description="Eventos según tu ubicación"
                  />

                  <IconLink
                    href="/events/this-week"
                    icon={<CalendarIcon className="h-4 w-4" />}
                    label="Esta semana"
                    description="Próximos eventos"
                  />

                  <IconLink
                    href="/events/verified"
                    icon={<VerifiedIcon className="h-4 w-4" />}
                    label="Verificados"
                    description="Eventos verificados"
                  />
                </ul>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
                  Categorías
                </h4>

                <ul className="space-y-2">
                  <IconLink
                    href="/events/category/deportes"
                    icon={<DumbbellIcon className="h-4 w-4" />}
                    label="Deportes"
                    description="Fútbol, running, surf"
                  />

                  <IconLink
                    href="/events/category/musica"
                    icon={<MusicIcon className="h-4 w-4" />}
                    label="Música"
                    description="Conciertos y shows"
                  />

                  <IconLink
                    href="/events/category/aire-libre"
                    icon={<MapPinIcon className="h-4 w-4" />}
                    label="Aire libre"
                    description="Naturaleza y outdoor"
                  />

                  <IconLink
                    href="/events/category/social"
                    icon={<PartyPopperIcon className="h-4 w-4" />}
                    label="Social"
                    description="Meetups y encuentros"
                  />
                </ul>
              </div>

              <div className="col-span-2">
                <NavigationMenuLink asChild>
                  <Link
                    href="/"
                    className="flex w-full flex-col rounded-md bg-muted p-4 no-underline transition-colors hover:bg-accent"
                  >
                    <span className="text-sm font-medium">
                      Ver todos los eventos
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Explora todos los eventos verificados
                    </span>
                  </Link>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function IconLink({
  href,
  icon,
  label,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  description?: string;
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="flex flex-col gap-1 rounded-md px-3 py-2 text-sm no-underline transition-colors hover:bg-accent focus:bg-accent"
        >
          <div className="flex items-center gap-2 font-medium">
            {icon}
            <span>{label}</span>
          </div>

          {description && (
            <p className="text-xs text-muted-foreground leading-snug">
              {description}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
