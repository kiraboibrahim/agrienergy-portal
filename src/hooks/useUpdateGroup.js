import { toast } from "react-toastify";
import parseError from "../components/common/utils/parse-error";
import { useUpdateGroupMutation } from "../services/group";

export default function useUpdateGroup() {
  const [_updateGroup, { isLoading }] = useUpdateGroupMutation();
  function formatBody(body) {
    const bodyCopy = structuredClone(body);
    const { farmers, agroProcessors } = bodyCopy;
    if (!!farmers?.length) {
      bodyCopy["farmerIds"] = farmers.map((farmer) => farmer.id);
      delete bodyCopy["farmers"];
    }
    if (!!agroProcessors?.length) {
      bodyCopy["agroProcessorIds"] = agroProcessors.map(
        (agroProcessor) => agroProcessor.id
      );
      delete bodyCopy["agroProcessors"];
    }
    return bodyCopy;
  }

  async function updateGroup(groupId, body) {
    const _body = formatBody(body);
    const { unwrap } = _updateGroup({ groupId, ..._body });
    try {
      const group = await unwrap();
      toast.success("Group update");
      return group;
    } catch (err) {
      toast.error(`Group update failed. Reason: ${parseError(err)}`);
    }
  }

  return [updateGroup, isLoading];
}
