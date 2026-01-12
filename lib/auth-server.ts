import { headers } from "next/headers";
import { auth } from "./auth";

export async function getSessionServer() {
  "use cache: private";
  return await auth.api.getSession({
    headers: await headers(),
  });
}
