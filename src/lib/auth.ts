import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import type { User } from "@/types";

/** Get current user from Authorization header or cookie token */
export async function getCurrentUser(
  request?: Request
): Promise<User | null> {
  let token = "";

  // 1) Try Authorization header
  if (request) {
    const auth = request.headers.get("Authorization");
    if (auth?.startsWith("Bearer ")) {
      token = auth.slice(7);
    }
  }

  // 2) Fallback: cookie
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get("sb-access-token")?.value ?? "";
  }

  if (!token) return null;

  const {
    data: { user: supaUser },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !supaUser) return null;

  // Fetch full user profile with limits
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", supaUser.id)
    .single();

  if (!profile) return null;

  return profile as unknown as User;
}

/** Require auth or return 401 */
export async function requireAuth(request?: Request): Promise<User> {
  const user = await getCurrentUser(request);
  if (!user) {
    throw new AuthError("未登录或登录已过期", 401);
  }
  return user;
}

/** Require admin role */
export async function requireAdmin(request?: Request): Promise<User> {
  const user = await requireAuth(request);
  if (user.license?.type !== "enterprise") {
    throw new AuthError("需要管理员权限", 403);
  }
  return user;
}

export class AuthError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}
