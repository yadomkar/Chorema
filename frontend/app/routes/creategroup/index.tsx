import { Button, Container, TextField, Typography } from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { createNewGroup } from "../api/index.js";
import { useCurrentUserWithRedirection } from "../utils/index.js";

const CreateGroup = () => {

  const user = useCurrentUserWithRedirection();

  const navigate = useNavigate();

  const handleCreateGroup = React.useCallback(async (event: React.FormEvent) => {
    event.preventDefault();

    const group_name: string = (event.target as any).group_name.value;
    const user_id: string = user?.user_id as string;

    try {
      const res = await createNewGroup({ group_name, members: [user_id] });

      alert(`Group ${res.data?.group_name} created successfully `);

      navigate(`/group/edit/${res?.data?.id}`);
    } catch (error) {
      alert('Something went wrong, please try again');
    }

  }, [navigate, user])

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "1rem",
        flexGrow: 0.8,
        my: "20vh"
      }}
    >
      <Typography
        sx={{ my: 2, fontWeight: 800, order: -3 }}
        variant="h3"
        align="center"
      >
        Create Group
      </Typography>

      <form id="create-group-form" onSubmit={handleCreateGroup}>
        <TextField
          key="group-name"
          name="group_name"
          type="text"
          variant="outlined"
          label="Group name"
          placeholder="Enter your group name..."
          InputLabelProps={{ shrink: true }}
          // onChange={handleChange}
          fullWidth
          required
        />
      </form>

      <Button
        color="inherit"
        form="create-group-form"
        type="submit"
        variant="outlined"
        size="large"
        children="Create now"
        fullWidth
        sx={{ mt: 2 }}
      />

    </Container>
  );
};

export default CreateGroup;
