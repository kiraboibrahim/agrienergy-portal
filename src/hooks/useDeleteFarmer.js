import { toast } from "react-toastify";
import { useDeleteFarmerMutation } from "../services/farmer";
import { useNavigate } from "react-router";

export default function useDeleteFarmer(redirectTo = "/farmers") {
  const navigate = useNavigate();
  const [_deleteFarmer, { isLoading }] = useDeleteFarmerMutation();
  async function deleteFarmer(farmerId) {
    const { unwrap } = _deleteFarmer(farmerId);
    try {
      await unwrap();
      toast.success("Farmer deleted");
      navigate(redirectTo);
    } catch (err) {
      toast.error("Farmer deletion failed");
    }
  }
  return [deleteFarmer, isLoading];
}
