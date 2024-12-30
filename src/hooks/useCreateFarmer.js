import { toast } from "react-toastify";
import { useCreateFarmerMutation } from "../services/farmer";
import parseError from "../components/common/utils/parse-error";

export default function useCreateFarmer() {
  const [_createFarmer, { isLoading }] = useCreateFarmerMutation();
  async function createFarmer(body) {
    const { unwrap } = _createFarmer(body);
    try {
      const data = await unwrap();
      toast.success("Farmer created");
      return data;
    } catch (err) {
      toast.error(`Farmer creation failed. Reason: ${parseError(err)}`);
    }
  }

  return [createFarmer, isLoading];
}
