import { LoadingButton } from '@mui/lab';
import { Button, Container, Divider, Stack, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../layout/components/Loader.js";
import { getGroupDetails, updateGroupDetails } from "../../api/index.js";
import { useDeleteGroup } from '../../utils/index.js';


export type GroupDetails = {
  group_name: string;
  members: string[];
  id: string;
  updated_at: string;
  created_at: string;
}

export const useGetGroupDetails = (groupId?: string) => {
  const [group, setGroup] = useState<GroupDetails>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      const response = await getGroupDetails(groupId ?? "");
      const data = response.data;;
      setGroup(data);
      setLoading(false);
    };
    fetchGroup();
  }, [groupId]);
  return { group, loading };
}

const EditGroup = () => {
  const { groupId } = useParams();

  const [memberId, setMemberId] = useState("");
  const [isUpdateMemberLoading, setIsUpdateMemberLoading] = useState(false);

  const { group, loading } = useGetGroupDetails(groupId);
  const { onDeleteGroup, isSubmitInFlight: isDeleteInProgress } = useDeleteGroup(groupId ?? '');

  const navigate = useNavigate();

  const onAddMember = useCallback(async () => {
    setIsUpdateMemberLoading(true);
    try {
      const res = await updateGroupDetails(groupId ?? "", { members: [memberId], group_name: group?.group_name });
      console.log(res)
      setMemberId("");
      alert(`Member ${memberId} added successfully `);
    } catch (error) {
      alert('Something went wrong, please try again');
    }
    setIsUpdateMemberLoading(false);
  }, [group, groupId, memberId])

  console.log(group);

  if (loading) {
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
        Edit  Group {group?.group_name}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Typography sx={{ mb: 1 }}>
        Add a member to this group
      </Typography>
      <TextField
        key="add-member"
        name="member"
        type="email"
        variant="outlined"
        label="Email"
        placeholder="Enter your email to add..."
        InputLabelProps={{ shrink: true }}
        onChange={(e) => setMemberId(e.target.value)}
        value={memberId}
        fullWidth
        required
      />

      <LoadingButton
        color="inherit"
        type="button"
        variant="outlined"
        size="large"
        children="Add Member"
        fullWidth
        sx={{ mt: 2, mb: 4 }}
        loading={isUpdateMemberLoading}
        onClick={onAddMember}
      />


      <Stack direction="row" spacing={2}>

        <Button
          color="primary"
          type="button"
          variant="contained"
          size="large"
          children="Add chores"
          onClick={() => navigate('/group/create-chore/' + groupId)}
          fullWidth
          sx={{ mt: 1 }}
        />
        <LoadingButton
          color="warning"
          type="button"
          variant="contained"
          size="large"
          children="Delete group"
          fullWidth
          sx={{ mt: 1 }}
          loading={isDeleteInProgress as boolean}
          onClick={onDeleteGroup}
        />
      </Stack>
    </Container>
  )
}

export default EditGroup;

EditGroup.displayName = 'EditGroup';
