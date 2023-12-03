import { LoadingButton } from "@mui/lab";
import { Container, Divider, TextField, Typography } from "@mui/material";
import { FormEvent, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { addChoreToAGroup } from "../../api/index.js";

const CreateChore = () => {
  const { groupId } = useParams();

  const [chore, setChore] = useState<{ name: string, karma_value?: string | null }>({ name: "", karma_value: null });
  const [choreAdding, setChoreAdding] = useState(false);

  const onAddChore = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setChoreAdding(true);

    try {
      const payload = {
        group: groupId ?? '',
        ...chore,
        karma_value: (chore?.karma_value) ? parseInt(chore?.karma_value) : 0
      }
      const res = await addChoreToAGroup(payload);
      console.log(res)

      alert(`Chore ${chore.name} added successfully `);
      setChore({ name: "", karma_value: null });
    } catch (error) {
      alert('Something went wrong, please try again');
    } finally {
      setChoreAdding(false);
    }
  }, [chore, groupId]);


  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "1rem",
        flexGrow: 0.8,
        my: "20px"
      }}
    >

      <Typography
        sx={{ my: 2, fontWeight: 800, order: -3 }}
        variant="h3"
        align="center"
      >
        Add a chore to this group
      </Typography>

      <Divider sx={{ mb: 2 }} />


      <form id="chore-add-form" onSubmit={onAddChore}>

        <TextField
          key="name"
          name="name"
          type="text"
          variant="outlined"
          label="Chore name"
          placeholder="Chore name..."
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setChore((prev) => ({ ...prev, name: e.target.value }))}
          value={chore.name}
          fullWidth
          required
          style={{ marginBottom: "1rem" }}
        />

        <TextField
          key="karma_value"
          name="karma_value"
          type="number"
          variant="outlined"
          label="Karma points"
          placeholder="Enter karma points for the chore"
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setChore((prev) => ({ ...prev, karma_value: e.target.value }))}
          value={chore.karma_value}
          fullWidth
          required
          style={{ marginBottom: "1rem" }}
        />
      </form>

      <LoadingButton
        form="chore-add-form"
        color="inherit"
        type="button"
        variant="outlined"
        size="large"
        children="Add Chore"
        fullWidth
        sx={{ mt: 2 }}
        loading={choreAdding}
        onClick={onAddChore}
      />
    </Container>
  );
};

export default CreateChore;
