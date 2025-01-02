import * as Yup from "yup";
import { DOMAIN_REGEX, UG_PHONE_NUMBER_REGEX } from "../../constants";

export const SACCO_GROUP_TYPE = "SACCO";
export const COOPERATIVE_GROUP_TYPE = "COOPERATIVE";
export const OTHER_GROUP_TYPE = "OTHER";
export const GROUP_TYPES = [
  SACCO_GROUP_TYPE,
  COOPERATIVE_GROUP_TYPE,
  OTHER_GROUP_TYPE,
];

export const GroupDetailsSchema = Yup.object({
  name: Yup.string().required(),
  type: Yup.string().oneOf(GROUP_TYPES).required(),
  email: Yup.string().email().optional().nullable(),
  phoneNumber: Yup.string().required().matches(UG_PHONE_NUMBER_REGEX),
  address: Yup.string().required(),
  website: Yup.string().matches(DOMAIN_REGEX).optional().nullable(),
  description: Yup.string().required().max(300),
});

export const GroupMembersSchema = Yup.object({
  farmers: Yup.array().optional(),
  agroProcessors: Yup.array().optional(),
});

const GroupProfileSchema = GroupDetailsSchema.concat(GroupMembersSchema);

export default GroupProfileSchema;
