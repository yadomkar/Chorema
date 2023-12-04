import {
  Box,
  Button,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loader from "../../../layout/components/Loader.js";
import {
  equalizeGroupDebts,
  getGroupDebts,
  getGroupMinimizedDebts,
  getGroupTransactions,
} from "../../api/index.js";

import './viewGroup.css';

export type TransactionDetail = {
  name: string;
  done_by_name: string;
  created_at: string;
  karma_value: number;
  id: string;
};
const useGetGroupTransactions = (groupId: string) => {
  const [transactions, setTransactions] = useState<TransactionDetail[]>([]);
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

  return { transactions: transactions as TransactionDetail[], loading };
};

const useEqualizeGroupDebts = (groupId: string) => {
  const [loading, setLoading] = useState(false);

  const equalizeDebts = async () => {
    try {
      setLoading(true);
      await equalizeGroupDebts(groupId);
    } catch (error) {
      console.error("Error equalizing group debts:", error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  return { equalizeDebts, loading };
};

const formatDateTime = (dateString: string) => {
  return format(new Date(dateString), "PPpp"); // Adjust date format as needed
};

const useGetGroupDebts = (groupId: string) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupDebts = async () => {
      try {
        const response = await getGroupDebts(groupId);
        processDebts(response.data);
      } catch (error) {
        console.error("Error fetching group debts:", error);
        // Handle error appropriately
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchGroupDebts();
    }
  }, [groupId]);

  const processDebts = (data: any) => {
    const processedDebts = [];
    data.forEach((userDebt: any) => {
      userDebt.data.forEach((debt: any) => {
        const debtorFirstName = debt.debtor.split(" ")[0];
        const creditorFirstName = debt.creditor.split(" ")[0];

        const transaction = `${debtorFirstName} owes ${creditorFirstName} ${debt.debt_amount} points`;

        if (!processedDebts.includes(transaction)) {
          processedDebts.push(transaction);
        }
      });
    });
    setDebts(processedDebts);
  };

  return { debts, loading };
};

const useGetGroupMinimizedDebts = (groupId: string) => {
  const [minimizedDebts, setMinimizedDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupDebts = async () => {
      try {
        const response = await getGroupMinimizedDebts(groupId);
        processDebts(response.data);
      } catch (error) {
        console.error("Error fetching group debts:", error);
        // Handle error appropriately
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchGroupDebts();
    }
  }, [groupId]);

  const processDebts = (data) => {
    const processedDebts = [];
    data.forEach((userDebt) => {
      userDebt.data.forEach((debt) => {
        const debtorFirstName = debt.debtor.split(" ")[0];
        const creditorFirstName = debt.creditor.split(" ")[0];

        const transaction = `${debtorFirstName} owes ${creditorFirstName} ${debt.debt_amount} points`;

        if (!processedDebts.includes(transaction)) {
          processedDebts.push(transaction);
        }
      });
    });
    setMinimizedDebts(processedDebts);
  };

  return { minimizedDebts, loading };
};

const ViewGroup = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { transactions, loading: loadingTransactions } =
    useGetGroupTransactions(groupId ?? "");
  const [isMinimized, setIsMinimized] = useState(false);

  const { debts, loading: loadingDebts } = useGetGroupDebts(groupId ?? "");
  const { minimizedDebts, loading: loadingMinimizedDebts } =
    useGetGroupMinimizedDebts(groupId ?? "");
  const { equalize, loading: loadingEqualize } = useEqualizeGroupDebts(
    groupId ?? "",
  );
  const location = useLocation();
  const groupName = location.state?.groupName;

  const loading =
    loadingTransactions ||
    loadingDebts ||
    loadingMinimizedDebts ||
    loadingEqualize;

  if (loading) {
    return <Loader />;
  }

  const toggleDebtsView = (event) => {
    setIsMinimized(event.target.checked);
  };

  const displayedDebts = isMinimized ? minimizedDebts : debts;

  if (transactions.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ my: 4 }}>
        <Typography
          sx={{ my: 2, fontWeight: 800, order: -3 }}
          variant="h3"
          align="center"
        >
          View Transactions history
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
          <Button
            variant="outlined"
            onClick={() => {
              navigate(`/group/create-transaction/${groupId}`);
            }}
          >
            Add a transaction
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="sm" sx={{ my: 4, pb: 10 }}>
        <Typography
          sx={{ my: 2, fontWeight: 800, order: -3 }}
          variant="h3"
          align="center"
        >
          {groupName}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Container maxWidth="sm" sx={{ my: 4 }}>
          {/* Existing code */}
        </Container>

        {/* New section for displaying debts */}
        <Container maxWidth="sm" sx={{ my: 4 }}>
          <Typography
            sx={{ my: 2, fontWeight: 800 }}
            variant="h4"
            align="center"
            display="flex"
            justifyContent="center"
          >
            Group Debts
          </Typography>

          <Stack direction="row" justifyContent={"space-between"}>
            <Typography sx={{ my: 2 }} className="viewDetailed">View Detailed</Typography>
            <FormControlLabel
              label="Simplify debts"
              control={
                <Switch
                  checked={isMinimized}
                  onChange={toggleDebtsView}
                  color="primary"
                />
              }
              labelPlacement="start"
            />
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {displayedDebts.length === 0 ? (
            <Typography variant="body1" align="center">
              No debts to display.
            </Typography>
          ) : (
            <Paper sx={{ p: 2 }}>
              {displayedDebts.map((debt, index) => (
                <Typography key={index} variant="body1" sx={{ mb: 1 }}>
                  {debt}
                </Typography>
              ))}
            </Paper>
          )}
        </Container>
        <Typography sx={{ my: 2, fontWeight: 800 }} variant="h4" align="center">
          Group Transaction
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {transactions.map((transaction) => (
          <Paper key={transaction.id} sx={{ my: 2, p: 2, borderRadius: 4 }}>
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
      <div style={{ height: "100px" }} />
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
          children="Add a transaction"
          variant="outlined"
          onClick={() => navigate(`/group/create-transaction/${groupId}`)}
          fullWidth
          sx={{ mx: 4 }}
          size="large"
        />
      </div>
    </>
  );
};

export default ViewGroup;

ViewGroup.displayName = "ViewGroup";
