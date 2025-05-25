import { onIdTokenChanged } from "@/lib/firebase/auth";
import { setCookie, deleteCookie } from "cookies-next";

function useUserSession(initialUser) {
  useEffect(() => {
    return onIdTokenChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        await setCookie("__session", token);
      } else {
        await deleteCookie("__session");
      }
      if (initialUser?.uid === user?.uid) return;
      window.location.reload(); // Refresh untuk sinkronisasi server-client
    });
  }, [initialUser]);

  return initialUser;
}