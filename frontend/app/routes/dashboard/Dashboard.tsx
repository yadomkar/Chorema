/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography
} from "@mui/material";

import { Create, Delete, FindInPage } from "@mui/icons-material";

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePageEffect } from "../../core/page.js";
import Loader from "../../layout/components/Loader.js";
import { getAllGroups } from "../api/index.js";
import { useCurrentUserWithRedirection } from "../utils/index.js";

const useGetAllGroups = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      const response = await getAllGroups();
      const data = response.data;
      setGroups(data);
      setLoading(false);
    };
    fetchGroups();
  }, []);

  return { groups, loading };
};

export function Component(): JSX.Element {
  usePageEffect({ title: "Chorema" });

  const user = useCurrentUserWithRedirection();
  const navigate = useNavigate();

  const { groups, loading } = useGetAllGroups();

  const onCreateGroup = useCallback(() => {
    navigate("/group/create");
  }, [navigate]);

  if (loading) {
    return <Loader />
  }

  if (groups?.length === 0) {
    return (
      <Container sx={{ py: "20px" }} maxWidth="sm">
        <Typography sx={{ mb: 2 }} variant="h3" align="center">
          Welcome {user?.first_name ?? "to Chorema"}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "center" }}>
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
            display: "flex",
          }}
        >
          <Button variant="outlined" onClick={onCreateGroup}>
            Create group
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Container sx={{ py: "20px" }} maxWidth="sm">
        <Typography sx={{ mb: 2 }} variant="h3" align="center">
          Welcome {user?.first_name ?? "to Chorema"}
        </Typography>

        <Divider />

        <br />

        <Box
          sx={{
            justifyContent: "center",
            gridGap: "1rem",
          }}
        >
          <Typography sx={{ my: 2 }} variant="h4" align="center">
            Your Groups
          </Typography>
          <br />

          <List sx={{ width: '100%' }}>
            {groups?.map((group) => {
              return (
                <>
                  <ListItem secondaryAction={
                    <>
                      <IconButton edge="end" aria-label="edit">
                        <Create onClick={() => { navigate(`/group/edit/${group?.id}`) }} />
                      </IconButton>
                      <IconButton edge="end" aria-label="edit" sx={{ ml: 1 }}>
                        <Delete onClick={() => { }} />
                      </IconButton>
                    </>
                  }
                    sx={{
                      border: '0.8px solid cornflowerblue', borderRadius: 3, backgroundColor: 'white'
                    }}
                  >
                    <ListItemButton sx={{ padding: 0 }}>
                      <ListItemText primary={group.group_name} onClick={() => { navigate(`/group/view/${group?.id}`) }} secondary={`${group.members?.length ?? 0} members`} />
                    </ListItemButton>

                  </ListItem>
                  <Divider sx={{ my: 2 }} />
                </>
              );
            })}

          </List>
        </Box>


      </Container >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          width: "100%",
          bottom: "40px",
        }}
      >
        <Button
          children="Create Group"
          variant="outlined"
          onClick={onCreateGroup}
          fullWidth
          sx={{ mx: 4 }}
        />
      </div>
    </>
  );
}

export default Component;

Component.displayName = "Dashboard";
