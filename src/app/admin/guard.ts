import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/auth";

/** Call at the top of every admin page (not the login page). */
export async function requireAdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
