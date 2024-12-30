import { toast } from "react-toastify";
import { useCreateEscoMutation } from "../services/esco";
import parseError from "../components/common/utils/parse-error";

export default function useCreateEsco() {
  const [_createEsco, { isLoading }] = useCreateEscoMutation();
  async function createEsco(body) {
    const { unwrap } = _createEsco(body);
    try {
      const data = await unwrap();
      toast.success("Esco created");
      return data;
    } catch (err) {
      toast.error(`Esco creation failed. Reason: ${parseError(err)}`);
    }
  }

  return [createEsco, isLoading];
}
