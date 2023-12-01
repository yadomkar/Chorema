/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */
import { Box, Container, Typography } from "@mui/material";

import FindInPageIcon from '@mui/icons-material/FindInPage';


import { useEffect, useState } from "react";
import { getAllGroups } from "../../api/index.js";
import { useCurrentUserWithRedirection } from "../../core/auth.js";
import { usePageEffect } from "../../core/page.js";


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
  const { groups, loading } = useGetAllGroups();


  const user = useCurrentUserWithRedirection();

  if (loading) {
    return (
      <Container sx={{ py: "20vh" }} maxWidth="sm">
        <FindInPageIcon />
      </Container>
    );
  }

  return (
    <Container sx={{ py: "20px" }} maxWidth="sm">
      <Typography sx={{ mb: 2 }} variant="h3" align="center">
        Welcome {user?.first_name ?? "to Chorema"}
      </Typography>


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

Component.displayName = "Dashboard";
