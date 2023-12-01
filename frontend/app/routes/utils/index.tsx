import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../core/auth.js";

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
