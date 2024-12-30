import { toast } from "react-toastify";
import { useCreateAgroProcessorMutation } from "../services/agroProcessor";
import parseError from "../components/common/utils/parse-error";

export default function useCreateAgroProcessor() {
  const [_createAgroProcessor, { isLoading }] =
    useCreateAgroProcessorMutation();
  async function createAgroProcessor(body) {
    const _body = { ...body, password: "123456" };
    const { unwrap } = _createAgroProcessor(_body);
    try {
      const data = await unwrap();
      toast.success("Agro processor created");
      return data;
    } catch (err) {
      toast.error(`Agro processor creation failed. Reason: ${parseError(err)}`);
    }
  }

  return [createAgroProcessor, isLoading];
}
