import { removeAuthCookie } from "@/lib/auth";
import { success } from "@/lib/api-response";

export async function POST() {
  await removeAuthCookie();
  return success({ message: "Logged out" });
}
