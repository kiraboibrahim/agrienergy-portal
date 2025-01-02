import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useDeleteAgroProcessorMutation } from "../services/agroProcessor";
import parseError from "../components/common/utils/parse-error";

export default function useDeleteAgroProcessor(
  redirectTo = "/agro-processors"
) {
  const navigate = useNavigate();
  const [_deleteAgroProcessor, { isLoading }] =
    useDeleteAgroProcessorMutation();
  async function deleteAgroProcessor(agroProcessorId) {
    const { unwrap } = _deleteAgroProcessor(agroProcessorId);
    try {
      await unwrap();
      toast.success("Agro-processor deleted");
      navigate(redirectTo);
    } catch (err) {
      toast.error(`Agro-processor deletion failed. Reason: ${parseError(err)}`);
    }
  }
  return [deleteAgroProcessor, isLoading];
}
