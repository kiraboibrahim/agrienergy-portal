import { toast } from "react-toastify";
import parseError from "../components/common/utils/parse-error";
import { usePromoteProductMutation } from "../services/product";

export default function usePromoteProduct() {
  const [_promoteProduct, { isLoading }] = usePromoteProductMutation();
  async function promoteProduct(productId, body) {
    const { recipient, group } = body;
    const bodyCopy = structuredClone(body);
    if (recipient === "GROUP") {
      bodyCopy["groupId"] = group.at(0).id;
      delete bodyCopy["group"];
    }
    const { unwrap } = _promoteProduct({ productId, ...bodyCopy });
    try {
      const data = await unwrap();
      toast.success("Product promoted");
      return data;
    } catch (err) {
      toast.error(`Product promotion failed. Reason: ${parseError(err)}`);
    }
  }

  return [promoteProduct, isLoading];
}
