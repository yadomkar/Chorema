/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useCurrentUser } from "../../core/auth.js";
import { usePageEffect } from "../../core/page.js";

export function Component(): JSX.Element {
  const [{ input, ...state }, setState] = useState();
  const handleChange = useHandleChange(setState);
  const handleSubmit = useHandleSubmit(input, setState);

  usePageEffect({ title: "Account Details" });

  return (
    <Container sx={{ my: 4 }} maxWidth="sm">
      <Typography sx={{ mb: 4 }} variant="h2" children="Account Details" />

      {state.error && (
        <Alert sx={{ mb: 3 }} severity={"error"} children={state.error} />
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          name="displayName"
          label="Display Name"
          value={input.displayName}
          helperText={" "}
          onChange={handleChange}
          disabled={state.loading}
          InputLabelProps={{ shrink: true }}
          fullWidth
          required
        />

        <TextField
          name="email"
          type="email"
          label="Email"
          value={input.email}
          helperText={" "}
          onChange={handleChange}
          disabled={state.loading}
          InputLabelProps={{ shrink: true }}
          fullWidth
          required
        />

        <Button
          variant="contained"
          type="submit"
          children="Update Profile"
          disabled={state.loading}
        />
      </Box>
    </Container>
  );
}

function useState() {
  const me = useCurrentUser();
  const [state, setState] = React.useState({
    input: {
      displayName: me?.first_name ?? "",
      email: me?.email ?? "",
    },
    loading: me === undefined,
    error: undefined as string | undefined,
  });

  React.useEffect(() => {
    if (me?.user_id) {
      setState((prev) => ({
        ...prev,
        input: {
          ...prev.input,
          displayName: me.first_name ?? "",
          email: me.email ?? "",
        },
        loading: false,
      }));
    }
  }, [setState, me]);

  return [state, setState] as const;
}

function useHandleChange(setState: SetState) {
  return React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setState((prev) => ({
        ...prev,
        input: { ...prev.input, [name]: value },
      }));
    },
    [setState],
  );
}

function useHandleSubmit(input: Input, setState: SetState) {
  const saveProfile = () => { /* TODO */ }

  return React.useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setState((prev) => ({ ...prev, loading: true }));
      try {
        await saveProfile();
        setState((prev) => ({ ...prev, loading: false, error: undefined }));
      } catch (err) {
        const error = (err as Error)?.message ?? "Failed.";
        setState((prev) => ({ ...prev, loading: false, error }));
      }
    },
    [setState, saveProfile],
  );
}

Component.displayName = "AccountDetails";

type Input = ReturnType<typeof useState>[0]["input"];
type SetState = ReturnType<typeof useState>[1];
