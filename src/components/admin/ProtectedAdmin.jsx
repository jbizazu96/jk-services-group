"use client";

import { useEffect, useState } from "react";


import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

export default function ProtectedAdmin({
  children,
}) {

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);

  const [authorized, setAuthorized] =
    useState(false);

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (firebaseUser) => {

          if (!firebaseUser) {

            setLoading(false);

            return;
          }

          setUser(firebaseUser);

            console.log(
            "Logged in email:",
            firebaseUser.email
            );

          try {

            const adminRef = doc(
              db,
              "admins",
              firebaseUser.email
            );

            const adminDoc = await getDoc(adminRef);

            console.log("User Email:", firebaseUser.email);
            console.log("Admin Exists:", adminDoc.exists());

            if (adminDoc.exists()) {
            console.log("Admin Data:", adminDoc.data());
            }

            if (
            adminDoc.exists() &&
            adminDoc.data().active === true
            ) {
            console.log("AUTHORIZED");
            setAuthorized(true);
            } else {
            console.log("DENIED");
            setAuthorized(false);
            }

          } catch (error) {

            console.error(error);

            setAuthorized(false);

          }

          setLoading(false);
        }
      );

    return () => unsubscribe();

  }, []);

  if (loading) {

    return (
      <div className="
        min-h-screen
        flex
        items-center
        justify-center
      ">
        Loading...
      </div>
    );
  }

  if (!user) {

    return (

      <div className="
        min-h-screen
        bg-slate-950
        flex
        items-center
        justify-center
      ">

        <div className="
          bg-white/5
          border border-white/10
          rounded-3xl
          p-10
          text-center
          max-w-md
          w-full
          text-white
        ">

          <h1 className="text-4xl font-black mb-4">
            J&K Admin
          </h1>

          <p className="text-gray-400 mb-8">
            Sign in with your Google account.
          </p>

          <button
            onClick={() =>
              signInWithPopup(
                auth,
                new GoogleAuthProvider()
              )
            }
            className="
              w-full
              bg-yellow-500
              hover:bg-yellow-400
              text-black
              py-4
              rounded-xl
              font-bold
            "
          >
            Sign In With Google
          </button>

        </div>

      </div>

    );
  }

  if (!authorized) {

  return (

    <div className="
      min-h-screen
      bg-slate-950
      flex
      items-center
      justify-center
      text-white
    ">

      <div className="text-center max-w-md">

        <h1 className="text-5xl font-black mb-4">
          Access Denied
        </h1>

        <p className="text-gray-400 mb-8">
          This Google account is not authorized
          to access the J&K Service Group
          administration portal.
        </p>

        <div className="flex gap-4 justify-center">

          <button
            onClick={async () => {

              await auth.signOut();

              window.location.reload();

            }}
            className="
              bg-red-500
              hover:bg-red-600
              px-6
              py-3
              rounded-xl
              font-bold
            "
          >
            Sign Out
          </button>

          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="
              bg-white/10
              hover:bg-white/20
              px-6
              py-3
              rounded-xl
              font-bold
            "
          >
            Home
          </button>

        </div>

      </div>

    </div>

  );
}

  return children;
}