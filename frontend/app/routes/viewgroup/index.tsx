import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../layout/components/Loader.js";
import { getGroupTransactions } from "../api/index.js";

const useGetGroupTransactions = (groupId: string) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupTransactions = async () => {
      try {
        const response = await getGroupTransactions(groupId);
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching group transactions:", error);
        // Handle error appropriately
      }
      setLoading(false);
    };
    if (groupId) {
      fetchGroupTransactions();
    }
  }, [groupId]);

  return { transactions, loading };
};

const formatDateTime = (dateString: string) => {
  return format(new Date(dateString), "PPpp"); // Adjust date format as needed
};

const ViewGroup = () => {
  const { groupId } = useParams();
  const { transactions, loading } = useGetGroupTransactions(groupId);
  const navigate = useNavigate();
  if (loading) {
    return <Loader />;
  }

  if (transactions.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ my: 4 }}>
        <Typography
          sx={{ my: 2, fontWeight: 800, order: -3 }}
          variant="h3"
          align="center"
        >
          View Group Transactions
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography sx={{ my: 2 }} variant="h5" align="center">
          You do not have any transactions yet. Add now!
        </Typography>

        <Box
          sx={{
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Button variant="outlined" onClick={() => { navigate('/') }}>
            Add a transaction
          </Button>
        </Box>

      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ my: 4 }}>
      <Typography
        sx={{ my: 2, fontWeight: 800, order: -3 }}
        variant="h3"
        align="center"
      >
        View Group Transactions
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {transactions.map((transaction) => (
        <Paper key={transaction.id} sx={{ my: 2, p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {transaction.name}
              </Typography>
              <Box sx={{ my: 1 }}>
                <Typography variant="body1">
                  {transaction.done_by_name}
                </Typography>
                <Typography variant="body2">
                  {formatDateTime(transaction.created_at)}
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {Math.round(transaction.karma_value)} Points
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Container>
  );
};

export default ViewGroup;

ViewGroup.displayName = "ViewGroup";
