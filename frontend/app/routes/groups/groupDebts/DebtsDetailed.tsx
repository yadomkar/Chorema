import { Container, Divider, FormControlLabel, Stack, Switch, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../../layout/components/Loader.js";
import { getDebtsForAGroup } from "../../api/index.js";
import { useGetGroupDetails } from "../editgroup/index.js";

import './debts.css';


const useDebtsForAGroup = (groupId: string) => {
  const [debts, setDebts] = useState<any[]>([]);
  const [isSimplifyDebts, setIsSimplifyDebts] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDebtsForAGroup = async () => {
      setLoading(true);
      try {
        const response = await getDebtsForAGroup(groupId, isSimplifyDebts);
        setDebts(response.data);
      } catch (error) {
        console.error("Error fetching group debts:", error);
        // Handle error appropriately
      } finally {
        setLoading(false);
      }
    };
    if (groupId) {
      fetchDebtsForAGroup();
    }
  }, [groupId, isSimplifyDebts]);

  return { debts, loading, setIsSimplifyDebts, isSimplifyDebts };
};

const DefaultDebts = () => {
  const { groupId } = useParams();

  const { group, loading } = useGetGroupDetails(groupId ?? "");
  const { debts, loading: isDebtLoading, setIsSimplifyDebts, isSimplifyDebts } = useDebtsForAGroup(groupId ?? "");


  const getDebtUI = () => {
    return debts.map((debt) => {
      return (
        <Stack
          key={debt.id}
          direction="row"
          justifyContent={"space-between"}
          sx={{ mx: 1, my: 2 }}
        >


          {debt.credit > 0 && (
            <>
              <div className="debtListItem">
                <Typography>
                  <b>{debt.user}</b> owes <i>{debt.credit}</i> karma in total

                  <div style={{ marginLeft: 10 }}>
                    <ul>
                      {debt.data.map((d: any) => {
                        return (
                          <li key={d.debtor}>
                            <Typography>{d.debtor} owes <i>{d.debt_amount}</i> to {d.creditor}</Typography>
                          </li>
                        );
                      })}

                    </ul>
                  </div>
                </Typography>
              </div>
            </>
          )}

          {debt.debit != 0 && (
            <div className="debtListItem">
              <Typography>
                <b>{debt.user}</b> gets back <i>{Math.abs(debt.debit)}</i> karma in total

                <div style={{ marginLeft: 10 }}>
                  <ul>
                    {debt?.data?.map((d: any) => {
                      return (
                        <li key={d.debtor}>
                          <Typography>{d.debtor} owes <i>{d.debt_amount}</i> to {d.creditor}</Typography>
                        </li>
                      );
                    })}

                  </ul>
                </div>
              </Typography>
            </div>
          )}
        </Stack >
      )
    })
  }

  return (
    <Container maxWidth="sm" sx={{ my: 4 }}>
      <Typography
        sx={{ my: 2, fontWeight: 800, order: -3 }}
        variant="h3"
        align="center"
      >
        Group balances - {group?.group_name}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Stack
        direction="row"
        justifyContent={"space-between"}
        sx={{ mx: 2 }}
      >
        <Typography
          sx={{ my: 2 }}
          variant="h4"
          align="center"
        >
          Debts
        </Typography>

        <FormControlLabel
          label="Simplify debts"
          control={
            <Switch
              defaultValue="false"
              value={isSimplifyDebts}
              onChange={(e) => setIsSimplifyDebts(e.target.checked)}
            />
          }
          labelPlacement="start"
        />

      </Stack>

      {(loading || isDebtLoading) ? <Loader /> : getDebtUI()}
    </Container>
  );
}

export default DefaultDebts;
