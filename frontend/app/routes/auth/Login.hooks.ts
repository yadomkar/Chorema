import * as React from "react";
import { useNavigate } from "react-router-dom";

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



export function useHandleSignup(data: { email: string; password: string; first_name: string; last_name: string }) {
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

type SigninResponse = {
  first_name: string;
  last_name: string;
  token: string;
  session_id: string;
}

export type UserDetailObject = {
  email: string;
  first_name: string;
  last_name: string;
  token: string;
  session_id: string;
}

export const useHandleSignin = (data: { email: string; password: string }) => {
  const navigate = useNavigate();
  return React.useCallback(async (event: React.FormEvent) => {
    event.preventDefault();

    const { email, password } = data;

    const res = await axios.post<SigninResponse>('/api/login/', { email, password }, { baseURL: 'http://localhost/' });

    const { session_id, token, first_name, last_name } = res.data;

    localStorage.setItem('session_id', session_id);
    localStorage.setItem('token', token);

    const userObject: UserDetailObject = {
      email,
      first_name,
      last_name,
      token,
      session_id
    }

    localStorage.setItem('user', JSON.stringify(userObject));

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
    password: "",
    first_name: "",
    last_name: "",
    saml: false,
    otpSent: false,
    code: "",
    error: null,
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

export type Mode = "login" | "signup";
export type State = ReturnType<typeof useState>[0];
export type SetState = ReturnType<typeof useState>[1];
export type Input = { name: keyof State; value: string };
