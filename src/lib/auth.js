/* ==========================================
   FIREBASE AUTH IMPORTS
========================================== */

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

/* ==========================================
   FIREBASE AUTH INSTANCE
========================================== */

import { auth } from "./firebase";

/* ==========================================
   GOOGLE AUTH PROVIDER

   Used for Google Sign-In
========================================== */

const provider =
  new GoogleAuthProvider();

/* ==========================================
   LOGIN WITH GOOGLE

   Opens Google authentication popup.

   Returns:
   - Firebase User Object
   - Authentication Token
========================================== */

export const loginWithGoogle =
  () =>
    signInWithPopup(
      auth,
      provider
    );

/* ==========================================
   LOGOUT USER

   Signs out currently logged-in user.
========================================== */

export const logout =
  () =>
    signOut(auth);