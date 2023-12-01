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
  useHandleSignup,
  useState
} from "./Login.hooks.js";
import { Notice } from "./Notice.js";

export function Component(): JSX.Element {
  const [state, setState] = useState();
  const handleChange = useHandleChange(setState);
  const handleSignup = useHandleSignup(state);
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

      <form id="login-form" onSubmit={handleSignup}>
        <>
          <TextField
            key="first_name"
            name="first_name"
            type="text"
            variant="outlined"
            label="First name"
            placeholder="Enter your First name..."
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            fullWidth
            required
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            key="last_name"
            name="last_name"
            type="text"
            variant="outlined"
            label="Last name"
            placeholder="Enter your Last name..."
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            fullWidth
            required
            style={{ marginBottom: "1rem" }}
          />
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
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            key="password"
            name="password"
            type="password"
            variant="outlined"
            label="Password"
            placeholder="Enter your password..."
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            fullWidth
            required
            style={{ marginBottom: "1rem" }}
          />
        </>
      </form>

      <Button
        color="inherit"
        form="login-form"
        type="submit"
        variant="outlined"
        size="large"
        children="Sign Up"
        fullWidth
      />

      <Divider
        sx={{ color: "divider", order: isSignUp ? undefined : -1 }}
        children="OR"
      />

      <Notice sx={{ mt: 4 }} />
    </Container>
  );
}

Component.displayName = "Signup";
