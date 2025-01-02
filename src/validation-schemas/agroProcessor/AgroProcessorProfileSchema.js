import * as Yup from "yup";
import { DOMAIN_REGEX, UG_PHONE_NUMBER_REGEX } from "../../constants";

const AgroProcessorProfileSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(
      UG_PHONE_NUMBER_REGEX,
      "Phone number isn't a valid Ugandan phone number"
    ),
  address: Yup.string().required("Address is required"),
  website: Yup.string()
    .required("Website is required")
    .matches(DOMAIN_REGEX, "Invalid website domain"),
  incorporationDate: Yup.date().required("Date of incorporation is required"),
  equipment: Yup.string().required("Equipment is required"),
  equipmentDescription: Yup.string().required(
    "A description of your equipment is required"
  ),
});

export default AgroProcessorProfileSchema;
