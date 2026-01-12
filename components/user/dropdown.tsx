"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  CreditCard,
  EllipsisVerticalIcon,
  LogOut,
  Settings2,
  User2Icon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import Link from "next/link";
import { getInitials } from "@/lib/utils";

export function DropdownMenuUser({
  user,
}: {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}) {
  const [isLoading, setIsLoading] = useState(false);
  const initials = getInitials(user.name);

  const handleLogout = async () => {
    setIsLoading(true);
    const { data } = await authClient.signOut();
    if (data?.success) {
      window.location.reload();
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="p-5 flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image ?? ""} alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <p>{user.name}</p>
            <span className="text-xs text-stone-700">{user.email}</span>
          </div>
          <EllipsisVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/profile/user/${user.id}`}>
              Perfil
              <DropdownMenuShortcut>
                <User2Icon />
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={"/profile/subscription"}>
              Suscripcion
              <DropdownMenuShortcut>
                <CreditCard />
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={"/profile/settings"}>
              Ajustes
              <DropdownMenuShortcut>
                <Settings2 />
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleLogout()}>
          {isLoading ? "Cerrando Sesión" : "Cerrar Sesión"}
          <DropdownMenuShortcut>
            <LogOut />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
