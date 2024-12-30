import { UG_PHONE_NUMBER_REGEX } from "../../constants";
import * as Yup from "yup";

export const FarmerDetailsSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(UG_PHONE_NUMBER_REGEX, "Provide a valid Ugandan phone number"),
});

export const FarmerLocationSchema = Yup.object({
  latitude: Yup.string().required(),
  longitude: Yup.string().required(),
  address: Yup.string().required(),
});

export const FarmDetailsSchema = Yup.object({
  farmName: Yup.string().required("Farm name is required"),
  farmEstablishedOn: Yup.date().required(),
  farmSize: Yup.string().required("Farm size is required"),
  farmDescription: Yup.string()
    .required("Farm description is required")
    .max(300, "Farm description can't exceed 300 characters"),
  animalsKept: Yup.string().required(
    "You have to choose atleast one animal you rear"
  ),
  animalsPerType: Yup.string()
    .ensure()
    .required("You have to specify the number of animals reared per type"),
  cropsGrown: Yup.string().required(
    "You have to choose atleast one crop you grow"
  ),
  acreagePerCrop: Yup.string()
    .ensure()
    .required("You have to specify the number of acres for each crop"),
});

const FarmerProfileSchema =
  FarmDetailsSchema.concat(FarmerLocationSchema).concat(FarmDetailsSchema);

export default FarmerProfileSchema;
