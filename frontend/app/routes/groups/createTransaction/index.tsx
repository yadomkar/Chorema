import { LoadingButton } from "@mui/lab";
import { Container, Divider, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../../layout/components/Loader.js";
import { addTransactionToAGroup, getChoresList } from "../../api/index.js";
import { useGetGroupDetails } from "../editgroup/index.js";

type StateType = {
  name: string,
  karma_value?: string | null
  description?: string;
  chore: string;
}


export type ChoreDetail = {
  id: string
  name: string
  description: string
  karma_value: string
  group: string
  assigned_to: string
  is_recurring: boolean
  created_at: string
  due_date: string
  completed_at: string
  status: string
}

const useGetChoresList = (groupId: string): { choresList: ChoreDetail[], loading: boolean } => {
  const [choresList, setChoresList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChoresList = async () => {
      try {
        const response = await getChoresList(groupId);
        setChoresList(response.data);
      } catch (error) {
        console.error("Error fetching group chores:", error);
        // Handle error appropriately
      }
      setLoading(false);
    };
    if (groupId) {
      fetchChoresList();
    }
  }, [groupId]);

  return { choresList, loading };
}
const CreateTransaction = () => {
  const { groupId } = useParams();

  const [transaction, setTransaction] = useState<StateType>({ name: "", karma_value: null, description: "", chore: "" });
  const [isTransactionAdding, setTransactionState] = useState(false);

  const { choresList, loading } = useGetChoresList(groupId ?? "");
  const { group, loading: groupLoading } = useGetGroupDetails(groupId ?? "");

  const onAddATransaction = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setTransactionState(true);
    try {
      const payload = {
        group: groupId ?? '',
        ...transaction,
        karma_value: (transaction?.karma_value) ? parseInt(transaction?.karma_value) : 0,
        members: group?.members ?? []
      }
      const res = await addTransactionToAGroup(payload);
      console.log(res)

      alert(`Chore ${transaction.name} added successfully `);
      setTransaction({ name: "", karma_value: null, description: "", chore: "" });
    } catch (error) {
      alert('Something went wrong, please try again');
    } finally {
      setTransactionState(false);
    }
  }, [group, groupId, transaction]);

  if (loading || groupLoading) {
    return <Loader />
  }

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
        Add a completed chore
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <form id="transaction-add-form" onSubmit={onAddATransaction}>
        <TextField
          key="name"
          name="name"
          type="text"
          variant="outlined"
          label="Transaction name"
          placeholder="Enter a transaction name..."
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setTransaction((prev) => ({ ...prev, name: e.target.value }))}
          value={transaction.name}
          fullWidth
          required
          style={{ marginBottom: "1rem" }}
        />

        <TextField
          key="description"
          name="description"
          type="text"
          variant="outlined"
          label="Transaction description"
          placeholder="Enter a transaction description..."
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setTransaction((prev) => ({ ...prev, description: e.target.value }))}
          value={transaction.description}
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
          onChange={(e) => setTransaction((prev) => ({ ...prev, karma_value: e.target.value }))}
          value={transaction.karma_value}
          fullWidth
          required
          style={{ marginBottom: "1rem" }}
          disabled
        />

        <div>
          <InputLabel id="object-value-default-label" children="Select a chore" />
          <Select
            id="object-value-default-label"
            value={transaction.chore}
            onChange={(e) => setTransaction((prev) => ({ ...prev, chore: e.target.value, karma_value: choresList.find((chore) => chore.id === e.target.value)?.karma_value }))}
            fullWidth
          >
            {choresList.map((chore: ChoreDetail) => (
              <MenuItem key={chore.id} value={chore.id}>{chore.name}</MenuItem>
            ))}
          </Select>

        </div>

      </form>

      <LoadingButton
        form="transaction-add-form"
        color="inherit"
        type="submit"
        variant="outlined"
        size="large"
        children="Complete Chore"
        fullWidth
        sx={{ mt: 2 }}
        loading={isTransactionAdding}
      />
    </Container>
  )
}

export default CreateTransaction;
