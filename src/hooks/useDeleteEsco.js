import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useDeleteEscoMutation } from "../services/esco";

export default function useDeleteEsco(redirectTo = "/escos") {
  const navigate = useNavigate();
  const [_deleteEsco, { isLoading }] = useDeleteEscoMutation();
  async function deleteEsco(escoId) {
    const { unwrap } = _deleteEsco(escoId);
    try {
      await unwrap();
      toast.success("Esco deleted");
      navigate(redirectTo);
    } catch (err) {
      toast.error("Esco deletion failed");
    }
  }

  return [deleteEsco, isLoading];
}
