import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import { redirect } from "next/navigation";

// Use to get the current session
export async function getSession() {
  return await getIronSession<SessionData>(await cookies(), sessionOptions);
}

// Use in Server Components / Route Handlers to protect pages
export async function requireAuth(path?: string[]) {
  const session = await getSession();

  if (!session.loginToken) {
    redirect(path ? `/login?redirectTo=/${path.join("/")}` : "/login");
  }
  return session;
}

// Role-based access using Convergence userGroup
// currently not used, but can be used in the future if needed
export async function requireGroup(group: string) {
  const session = await requireAuth();
  if (session.userGroup !== group) {
    redirect("/unauthorized");
  }
  return session;
}
