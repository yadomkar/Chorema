/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */
import { Box, Button, CircularProgress, Container, Divider, Typography } from "@mui/material";

import { FindInPage } from '@mui/icons-material';


import { useEffect, useState } from "react";
import { usePageEffect } from "../../core/page.js";
import { getAllGroups } from "../api/index.js";
import { useCurrentUserWithRedirection } from "../utils/index.js";


const useGetAllGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      const response = await getAllGroups();
      const data = response.data;;
      setGroups(data);
      setLoading(false);
    };
    fetchGroups();
  }, []);

  return { groups, loading };
}

export function Component(): JSX.Element {
  usePageEffect({ title: "Chorema" });


  const user = useCurrentUserWithRedirection();

  const { groups, loading } = useGetAllGroups();


  if (loading) {
    return (
      <Container sx={{ py: "20vh" }} maxWidth="sm">
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (groups?.length === 0) {
    return (
      <Container sx={{ py: "20px" }} maxWidth="sm">
        <Typography sx={{ mb: 2 }} variant="h3" align="center">
          Welcome {user?.first_name ?? "to Chorema"}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <FindInPage fontSize="large" />
        </Box>

        <Typography sx={{ my: 2 }} variant="h5" align="center">
          You are not currently in any groups.
        </Typography>

        <Typography sx={{ my: 2 }} variant="h5" align="center">
          Go ahead and create one!
        </Typography>

        <Box
          sx={{
            justifyContent: "center",
            display: 'flex',
          }}
        >
          <Button variant="outlined">
            Create group
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ py: "20px" }} maxWidth="sm">
      <Typography sx={{ mb: 2 }} variant="h3" align="center">
        Welcome {user?.first_name ?? "to Chorema"}
      </Typography>

      <Divider />


      <Box
        sx={{
          justifyContent: "center",
          gridGap: "1rem",
        }}
      >

      </Box>
    </Container>
  );
}

export default Component;

Component.displayName = "Dashboard";
