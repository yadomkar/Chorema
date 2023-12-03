import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../core/auth.js";
import { onDeleteAGroup } from "../api/index.js";

export const useCurrentUserWithRedirection = () => {
  const user = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [navigate, user]);

  return user;
}


export const useDeleteGroup = (groupId: string) => {
  const [isSubmitInFlight, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const onDeleteGroup = useCallback(async () => {
    setIsDeleting(true);
    try {
      const res = await onDeleteAGroup(groupId);
      console.log(res)
      alert(`Group deleted successfully `);
      navigate('/dashboard');
    } catch (error) {
      alert('Something went wrong, please try again');
    }
    setIsDeleting(false);
  }, [groupId, navigate])

  return { onDeleteGroup, isSubmitInFlight }
}
