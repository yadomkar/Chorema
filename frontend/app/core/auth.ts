import { type User, type UserCredential } from "firebase/auth";
import * as React from "react";
import { UserDetailObject } from "../routes/auth/Login.hooks.js";
import {
  auth,
  type SignInMethod,
  type SignInOptions
} from "./firebase.js";

let idTokenPromise: Promise<string | null> | undefined;
let idTokenPromiseResolve:
  | ((value: Promise<string> | null) => void)
  | undefined;

const unsubscribeIdTokenChanged = auth.onIdTokenChanged((user) => {
  if (user) {
    idTokenPromise = user.getIdToken();
    idTokenPromiseResolve?.(idTokenPromise as Promise<string>);
  } else {
    idTokenPromise = Promise.resolve(null);
    idTokenPromiseResolve?.(null);
  }
});

if (import.meta.hot) {
  import.meta.hot.dispose(unsubscribeIdTokenChanged);
}

export const SignInMethods: SignInMethod[] = [
  "google.com",
  "apple.com",
  "anonymous",
];

/**
 * The currently logged-in (authenticated) user object.
 *
 * @example
 *   const { useCurrentUser } from "../core/auth.js";
 *
 *   function Example(): JSX.Element {
 *     const me = useCurrentUser();
 *     // => { uid: "xxx", email: "me@example.com", ... }
 *     // => Or, `null` when not authenticated
 *     // => Or, `undefined` when not initialized
 *   }
 */
export function useCurrentUser() {

  const token = localStorage.getItem('token');
  const session_id = localStorage.getItem('session_id');

  const user: UserDetailObject = JSON.parse(localStorage.getItem('user') || '{}');

  return token && session_id ? user : undefined;
}

export const signOut = () => {
  return new Promise((resolve) => {
    localStorage.clear();
    resolve(true);
  });
}

export function useSignOut() {
  return React.useCallback(() => signOut(), []);
}

export {
  type SignInMethod,
  type SignInOptions,
  type User,
  type UserCredential
};

