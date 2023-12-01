import * as React from "react";
import { useNavigate } from "react-router-dom";
import { SignInMethod, signIn } from "../../core/firebase.js";

import axios from "axios";

/**
 * Handles login / signup via Email
 */
export function useHandleSubmit(
  state: State,
): [submit: React.FormEventHandler, inFlight: boolean] {
  const [inFlight, setInFlight] = React.useState(false);

  return [
    React.useCallback(
      async (event) => {
        event.preventDefault();
        try {
          setInFlight(true);
          console.log(state.email);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          throw new Error("Not implemented");
        } finally {
          setInFlight(false);
        }
      },
      [state.email],
    ),
    inFlight,
  ];
}



export function useHandleSignup(data: any) {
  const navigate = useNavigate();
  return React.useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(data);

    const { email, password, first_name, last_name } = data;


    const payload = {
      email,
      password,
      first_name,
      last_name
    }
    console.log('useHandleSignup');


    try {
      const res = await axios.post('/api/signup/', payload, { baseURL: 'http://localhost/' });

      console.log(res);

      alert('Signup successful!... Redirecting to login page.!!')

      navigate('/login')

    } catch (err) {

      alert('Signup failed! Please try again.')
    }
  }, [data, navigate]);
}

export const useHandleSignin = (data: { email: string; password: string }) => {
  const navigate = useNavigate();
  return React.useCallback(async (event: React.FormEvent) => {
    event.preventDefault();

    const { email, password } = data;

    const res: any = await axios.post('/api/login/', { email, password }, { baseURL: 'http://localhost/' });

    const { session_id, token } = res.data;

    localStorage.setItem('session_id', session_id);
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);

    alert('Login successful!... Redirecting to dashboard.!!')

    navigate('/dashboard')
  }, [data, navigate]);
}

/**
 * The initial state of the Login component
 */
export function useState() {
  return React.useState({
    email: "",
    code: "",
    saml: false,
    otpSent: undefined as boolean | null | undefined,
    error: undefined as string | null | undefined,
  });
}

export function useHandleChange(setState: SetState) {
  return React.useCallback(
    function (event: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = event.target as Input;
      setState((prev) =>
        prev[name] === value ? prev : { ...prev, [name]: value },
      );
    },
    [setState],
  );
}

export function useSwitchSAML(setState: SetState) {
  return React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setState((prev) => ({
        ...prev,
        saml: !prev.saml,
        otpSent: false,
        code: "",
      }));
    },
    [setState],
  );
}

export function useHandleSignIn(setState: SetState) {
  const navigate = useNavigate();

  return React.useCallback(
    async function (event: React.MouseEvent<HTMLElement>) {
      try {
        const method = event.currentTarget.dataset.method as SignInMethod;
        const credential = await signIn({ method });
        if (credential.user) {
          setState((prev) => (prev.error ? { ...prev, error: null } : prev));
          navigate("/");
        }
      } catch (err) {
        const error = (err as Error)?.message ?? "Login failed.";
        setState((prev) => ({ ...prev, error }));
      }
    },
    [navigate, setState],
  );
}

export type Mode = "login" | "signup";
export type State = ReturnType<typeof useState>[0];
export type SetState = ReturnType<typeof useState>[1];
export type Input = { name: keyof State; value: string };
