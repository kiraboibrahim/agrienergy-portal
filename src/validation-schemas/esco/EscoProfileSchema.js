import * as Yup from "yup";
import { DOMAIN_REGEX, UG_PHONE_NUMBER_REGEX } from "../../constants";

const EscoProfileSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Provide atleast 3 characters")
    .max(100, "Name can't be longer than 100 characters"),
  email: Yup.string().email().required("Email is required"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(UG_PHONE_NUMBER_REGEX, {
      message: "Provide a valid Ugandan phone number",
    }),

  website: Yup.string()
    .matches(DOMAIN_REGEX, {
      message: "Provide a valid domain e.g www.example.com",
    })
    .notRequired(),
  latitude: Yup.number().notRequired(),
  longitude: Yup.number().notRequired(),
  incorporationDate: Yup.date().required("Date of incorporation is required"),
  address: Yup.string().required("Address is required"),
  specialization: Yup.string().required("Specialization is required"),
});
export default EscoProfileSchema;
