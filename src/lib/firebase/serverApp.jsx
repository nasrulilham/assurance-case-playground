import { initializeServerApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { cookies } from "next/headers";

export async function getAuthenticatedAppForUser() {
  const session = cookies().get("__session")?.value;

  const firebaseServerApp = initializeServerApp(
    initializeApp({}), // Konfigurasi Firebase
    { authIdToken: session }
  );

  const auth = getAuth(firebaseServerApp);
  await auth.authStateReady(); // Tunggu hingga state siap

  return { 
    firebaseServerApp, 
    currentUser: auth.currentUser 
  };
}