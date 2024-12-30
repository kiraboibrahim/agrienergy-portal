import * as Yup from "yup";

export const ALL_FARMERS_RECIPIENT = "ALL_FARMERS";
export const ALL_GROUPS_RECIPIENT = "ALL_GROUPS";
export const GROUP_RECIPIENT = "GROUP";

export const PROMOTION_RECIPIENTS = [
  ALL_GROUPS_RECIPIENT,
  ALL_FARMERS_RECIPIENT,
  GROUP_RECIPIENT,
];
const PromotionSchema = Yup.object({
  recipient: Yup.string()
    .required("Choose the recipients of the promotion")
    .oneOf(PROMOTION_RECIPIENTS),
  group: Yup.array().when("recipient", {
    is: GROUP_RECIPIENT,
    then: (schema) => schema.required().min(1, "You have to choose a group"),
    otherwise: (schema) => schema.nullable(),
  }),
  message: Yup.string().required("A promotion message is required"),
});

export default PromotionSchema;
