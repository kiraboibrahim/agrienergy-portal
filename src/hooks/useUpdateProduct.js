import { toast } from "react-toastify";
import { useUpdateProductMutation } from "../services/product";
import parseError from "../components/common/utils/parse-error";

export default function useUpdateProduct() {
  const [_updateProduct, { isLoading }] = useUpdateProductMutation();
  async function updateProduct(productId, body) {
    const bodyCopy = structuredClone(body);
    const { categories } = bodyCopy;
    // Format the categories in the structure expected by the API
    if (!!categories?.length) {
      bodyCopy["categoriesIds"] = categories.map((category) => category.id);
      delete bodyCopy["categories"];
    }
    const { unwrap } = _updateProduct({ productId, ...bodyCopy });
    try {
      const data = await unwrap();
      toast.success("Product updated");
      return data;
    } catch (err) {
      toast.error(`Product update failed. Reason: ${parseError(err)}`);
    }
  }

  return [updateProduct, isLoading];
}
