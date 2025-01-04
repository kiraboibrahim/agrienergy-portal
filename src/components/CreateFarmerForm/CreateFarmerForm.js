import FormWizard, { FormWizardStep } from "../common/forms/FormWizard";
import TextInput from "../common/fields/TextInput";
import CSVChippedSelect from "../common/fields/CSVChippedSelect";
import { ANIMALS, CROPS } from "../../constants";
import Textarea from "../common/fields/Textarea";
import { Stack } from "@mui/joy";
import useCreateFarmer from "../../hooks/useCreateFarmer";
import {
  FarmerDetailsSchema,
  FarmerLocationSchema,
  FarmDetailsSchema,
} from "../../validation-schemas/farmer/FarmerProfileSchema";
export default function CreateFarmerForm() {
  const [createFarmer] = useCreateFarmer();

  return (
    <FormWizard
      steps={{ 1: "Farmer Details", 2: "Location", 3: "Farm Details" }}
      onSubmit={async (values) => {
        await createFarmer(values);
      }}
    >
      <FormWizardStep stepIndex={1} validationSchema={FarmerDetailsSchema}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ marginBottom: 2 }}
        >
          <TextInput
            name="firstName"
            label="First name"
            required
            sx={{ flexGrow: 1, marginBottom: { xs: 2, sm: 0 } }}
          />
          <TextInput
            sx={{ flexGrow: 1 }}
            label="Last name"
            name="lastName"
            required
          />
        </Stack>
        <TextInput
          name="phoneNumber"
          type="tel"
          label="Phone number"
          required
        />
      </FormWizardStep>

      <FormWizardStep stepIndex={2} validationSchema={FarmerLocationSchema}>
        <TextInput
          name="latitude"
          label="Latitude"
          type="number"
          required
          sx={{ marginBottom: 2 }}
        />
        <TextInput
          name="longitude"
          label="Longitude"
          type="number"
          required
          sx={{ marginBottom: 2 }}
        />
        <TextInput
          name="address"
          label="Address"
          required
          sx={{ marginBottom: 2 }}
        />
      </FormWizardStep>

      <FormWizardStep stepIndex={3} validationSchema={FarmDetailsSchema}>
        <TextInput
          name="farmName"
          label="Farm name"
          sx={{ marginBottom: 2 }}
          required
        />
        <TextInput
          name="farmEstablishedOn"
          label="When was the farm established?"
          type="date"
          required
          sx={{ marginBottom: 2 }}
        />
        <TextInput
          name="farmSize"
          label="Farm size"
          sx={{ marginBottom: 2 }}
          required
        />
        <Textarea
          name="farmDescription"
          label="Farm description"
          required
          sx={{ marginBottom: 2 }}
        />
        <CSVChippedSelect
          name="animalsKept"
          label="What animals do you rear?"
          options={ANIMALS}
          required
          sx={{ marginBottom: 2 }}
        />
        <TextInput
          name="animalsPerType"
          label="For each animal selected, how many animals do you rear?"
          placeholder="10,15,20"
          required
          sx={{ marginBottom: 2 }}
        />
        <CSVChippedSelect
          name="cropsGrown"
          label="What crops do you grow?"
          options={CROPS}
          required
          sx={{ marginBottom: 2 }}
        />
        <TextInput
          name="acreagePerCrop"
          label="For each crop selected, how many acres per crop?"
          required
          placeholder="10,15,20"
        />
      </FormWizardStep>
    </FormWizard>
  );
}
