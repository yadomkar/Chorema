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
import { AuthIcon } from "../../icons/AuthIcon.js";
import {
  useHandleChange,
  useHandleSignIn,
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
  const handleSignIn = useHandleSignIn(setState);
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
        children={isSignUp ? "Sign Up" : "Login"}
      />

      {state.error && (
        <Alert
          sx={{ mb: 2, order: -2 }}
          severity="error"
          children={state.error}
        />
      )}

      {state.otpSent && (
        <Alert sx={{ mb: 2 }} severity="success">
          Please enter the One Time Password (OTP) that has been sent to your
          email address.
        </Alert>
      )}

      <form id="login-form" onSubmit={handleSubmit}>
        {state.otpSent ? (
          <TextField
            key="code"
            name="code"
            variant="outlined"
            label="OTP code"
            placeholder="Enter OTP code..."
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: { fontWeight: 700 } }}
            onChange={handleChange}
            disabled={submitInFlight}
            autoComplete="off"
            autoFocus
            fullWidth
            required
          />
        ) : (
          <>
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
          </>
        )}
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

      <Button
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light" ? "white" : undefined,
          order: isSignUp ? undefined : -2,
        }}
        color="inherit"
        type="submit"
        variant="outlined"
        size="large"
        children="Continue as anonymous"
        startIcon={<AuthIcon color="inherit" variant="anonymous" />}
        onClick={handleSignIn}
        data-method="anonymous"
        fullWidth
      />

      <Notice sx={{ mt: 4 }} />
    </Container>
  );
}

Component.displayName = "Login";
