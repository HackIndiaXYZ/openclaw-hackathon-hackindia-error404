import { useSession } from "next-auth/react";

export function useAuth() {
  const sessionContext = useSession();
  const session = sessionContext?.data;
  const status = sessionContext?.status || "loading";

  return {
    user: (session?.user as any) || null,
    isAuthenticated: status === "authenticated",
    loading: status === "loading",
    campus: (session?.user as any)?.campus || null,
    uid: (session?.user as any)?.uid || null,
    roles: (session?.user as any)?.roles || ["student"],
  };
}
