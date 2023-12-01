/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import {
  Button,
  Container,
  TextField,
  Typography
} from "@mui/material";
import {
  useHandleChange,
  useHandleSignin,
  useState
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
        fullWidth
      />

      <Notice sx={{ mt: 4 }} />
    </Container >
  );
}

Component.displayName = "Login";
