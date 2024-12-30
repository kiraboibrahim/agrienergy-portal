import { toast } from "react-toastify";
import { useDeleteGroupMutation } from "../services/group";
import { useNavigate } from "react-router";
import parseError from "../components/common/utils/parse-error";

export default function useDeleteGroup(redirectTo = "/groups") {
  const navigate = useNavigate();
  const [_deleteGroup, { isLoading }] = useDeleteGroupMutation();
  async function deleteGroup(groupId) {
    const { unwrap } = _deleteGroup(groupId);
    try {
      await unwrap();
      toast.success("Group deleted");
      navigate(redirectTo);
    } catch (err) {
      toast.error(`Group deletion failed. Reason: ${parseError(err)}`);
    }
  }
  return [deleteGroup, isLoading];
}
