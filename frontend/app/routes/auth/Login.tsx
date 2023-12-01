/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import {
  Alert,
  Button,
  Container,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import {
  useHandleChange,
  useHandleSignin,
  useHandleSubmit,
  useState,
} from "./Login.hooks.js";
import { Notice } from "./Notice.js";

/**
 * The login and registration page inspired by Notion. Example:
 *
 *    https://www.notion.so/login
 *    https://www.notion.so/signup
 */
export function Component(): JSX.Element {
  const [state, setState] = useState();
  const handleChange = useHandleChange(setState);
  const handleSignIn = useHandleSignin(state);
  const [handleSubmit, submitInFlight] = useHandleSubmit(state);
  const { pathname } = useLocation();
  const isSignUp = pathname === "/signup";

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "1rem",
        flexGrow: 0.8,
      }}
    >
      <Typography
        sx={{ mb: 2, fontWeight: 800, order: -3 }}
        variant="h1"
        align="center"
        children="Login"
      />

      {state.error && (
        <Alert
          sx={{ mb: 2, order: -2 }}
          severity="error"
          children={state.error}
        />
      )}


      <form id="login-form" onSubmit={handleSignIn}>
        <TextField
          key="email"
          name="email"
          type="email"
          variant="outlined"
          label="Email"
          placeholder="Enter your email address..."
          InputLabelProps={{ shrink: true }}
          onChange={handleChange}
          disabled={submitInFlight}
          fullWidth
          required
        />
        <br />
        <br />
        <TextField
          key="passwords"
          name="password"
          type="password"
          variant="outlined"
          label="Password"
          placeholder="Enter your password..."
          InputLabelProps={{ shrink: true }}
          onChange={handleChange}
          disabled={submitInFlight}
          fullWidth
          required
        />
      </form>

      <Button
        color="inherit"
        form="login-form"
        type="submit"
        variant="outlined"
        size="large"
        children="Sign In"
        disabled={submitInFlight}
        fullWidth
      />

      <Divider
        sx={{ color: "divider", order: isSignUp ? undefined : -1 }}
        children="OR"
      />
      <Notice sx={{ mt: 4 }} />
    </Container >
  );
}

Component.displayName = "Login";
