import { getSessionServer } from "@/lib/auth-server";
import { DropdownMenuUser } from "./dropdown";
import Link from "next/link";
import { Button } from "../ui/button";

export async function SessionNav() {
  const session = await getSessionServer();
  return (
    <>
      {session?.user ? (
        <DropdownMenuUser user={session.user} />
      ) : (
        <div className="flex items-center gap-3">
          <Link href={"/sign-in"}>
            <Button variant={"ghost"}>Iniciar Sesión</Button>
          </Link>
          <Link href={"/sign-up"}>
            <Button>Registrarse</Button>
          </Link>
        </div>
      )}
    </>
  );
}
