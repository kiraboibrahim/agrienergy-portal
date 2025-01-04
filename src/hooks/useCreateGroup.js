import { toast } from "react-toastify";
import parseError from "../components/common/utils/parse-error";
import { useState } from "react";
import { useCreateGroupMutation } from "../services/group";
import { useCreateGroupMembersMutation } from "../services/group";

export default function useCreateGroup() {
  const [isLoading, setIsLoading] = useState(false);
  const [_createGroup] = useCreateGroupMutation();
  const [_createGroupMembers] = useCreateGroupMembersMutation();
  async function createGroupMembers(
    groupId,
    farmers = [],
    agroProcessors = []
  ) {
    if (!farmers?.length && !agroProcessors?.length) {
      return;
    }
    const body = {};
    if (!!farmers?.length) {
      body["farmerIds"] = farmers.map((farmer) => farmer.id);
    }
    if (!!agroProcessors?.length) {
      body["agroProcessorIds"] = agroProcessors.map(
        (agroProcessor) => agroProcessor.id
      );
    }
    const { unwrap } = _createGroupMembers({ groupId, ...body });
    return await unwrap();
  }
  async function createGroup(body) {
    const {
      phoneNumber,
      address,
      email,
      name,
      website,
      type,
      description,
      farmers = [],
      agroProcessors = [],
    } = body;
    const admin = {
      firstName: name,
      lastName: name,
      address,
      phoneNumber,
    };
    const groupDetails = {
      name,
      type,
      phoneNumber,
      email,
      website,
      address,
      description,
    };
    const _body = { admin, ...groupDetails };
    const { unwrap } = _createGroup(_body);
    try {
      setIsLoading(true);
      const group = await unwrap();
      await createGroupMembers(group.id, farmers, agroProcessors);
      toast.success("Group created");
      return group;
    } catch (err) {
      toast.error(`Group creation failed. Reason: ${parseError(err)}`);
    } finally {
      setIsLoading(false);
    }
  }

  return [createGroup, isLoading];
}
