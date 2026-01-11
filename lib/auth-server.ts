import { headers } from "next/headers";
import { auth } from "./auth";

export async function getSessionServer() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}
