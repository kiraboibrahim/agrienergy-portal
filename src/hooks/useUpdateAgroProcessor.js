import { toast } from "react-toastify";
import parseError from "../components/common/utils/parse-error";
import { useUpdateAgroProcessorMutation } from "../services/agroProcessor";
export default function useUpdateAgroProcessor() {
  const [_updateAgroProcessor, { isLoading }] =
    useUpdateAgroProcessorMutation();
  async function updateAgroProcessor(agroProcessorId, body) {
    const { unwrap } = _updateAgroProcessor({ agroProcessorId, ...body });
    try {
      const data = await unwrap();
      toast.success("Agro processor updated");
      return data;
    } catch (err) {
      toast.error(`Agro processor update failed. Reason: ${parseError(err)}`);
    }
  }

  return [updateAgroProcessor, isLoading];
}
