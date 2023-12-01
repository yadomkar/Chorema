import { useNavigate } from "react-router-dom";
import { useCurrentUserWithRedirection } from "../utils/index.js";

const CreateGroup = () => {

  const user = useCurrentUserWithRedirection();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
  }

  return (
    <div>Create Group</div>
  );
};

export default CreateGroup;
