import { toast } from "react-toastify";
import { useUpdateEscoMutation } from "../services/esco";
import parseError from "../components/common/utils/parse-error";

export default function useUpdateEsco() {
  const [_updateEsco, { isLoading }] = useUpdateEscoMutation();
  async function updateEsco(escoId, body) {
    const { unwrap } = _updateEsco({ escoId, ...body });
    try {
      const response = await unwrap();
      toast.success("Esco updated");
      return response;
    } catch (err) {
      toast.error(`Esco update failed. Reason: ${parseError(err)}`);
    }
  }

  return [updateEsco, isLoading];
}
