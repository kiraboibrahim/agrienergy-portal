import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useDeleteProductMutation } from "../services/product";

export default function useDeleteProduct(redirectTo = "/products") {
  const navigate = useNavigate();
  const [_deleteProduct, { isLoading }] = useDeleteProductMutation();
  async function deleteProduct(escoId) {
    const { unwrap } = _deleteProduct(escoId);
    try {
      await unwrap();
      toast.success("Product deleted");
      navigate(redirectTo);
    } catch (err) {
      toast.error("Product deletion failed");
    } finally {
    }
  }

  return [deleteProduct, isLoading];
}
