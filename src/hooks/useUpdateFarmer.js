import { toast } from "react-toastify";
import { useUpdateFarmerMutation } from "../services/farmer";
import parseError from "../components/common/utils/parse-error";

export default function useUpdateFarmer() {
  const [_updateFarmer, { isLoading }] = useUpdateFarmerMutation();
  async function updateFarmer(farmerId, body) {
    const { unwrap } = _updateFarmer({ farmerId, ...body });
    try {
      const data = await unwrap();
      toast.success("Farmer updated");
      return data;
    } catch (err) {
      toast.error(`Farmer update failed. Reason: ${parseError(err)}`);
    }
  }

  return [updateFarmer, isLoading];
}
