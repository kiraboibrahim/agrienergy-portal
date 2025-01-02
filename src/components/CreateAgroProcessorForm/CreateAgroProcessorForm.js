import { Form, Formik } from "formik";
import TextInput from "../common/fields/TextInput";
import Textarea from "../common/fields/Textarea";
import CSVChippedSelect from "../common/fields/CSVChippedSelect";
import { Button } from "@mui/joy";
import AgroProcessorProfileSchema from "../../validation-schemas/agroProcessor/AgroProcessorProfileSchema";
import useCreateAgroProcessor from "../../hooks/useCreateAgroProcessor";

export default function CreateAgroProcessorForm() {
  const [createAgroProcessor, isCreatingAgroProcessor] =
    useCreateAgroProcessor();
  return (
    <Formik
      validationSchema={AgroProcessorProfileSchema}
      initialValues={{
        name: "",
        phoneNumber: "",
        address: "",
        website: "",
        incorporationDate: "",
        equipment: "",
        equipmentDescription: "",
      }}
      onSubmit={async (values) => {
        return await createAgroProcessor(values);
      }}
    >
      <Form>
        <TextInput sx={{ marginBottom: 2 }} label="Name" name="name" required />
        <TextInput
          sx={{ marginBottom: 2 }}
          label="Phone number"
          name="phoneNumber"
          required
        />

        <TextInput
          sx={{ marginBottom: 2 }}
          label="Address"
          name="address"
          required
        />
        <TextInput
          sx={{ marginBottom: 2 }}
          label="Website"
          name="website"
          required
        />

        <TextInput
          sx={{ marginBottom: 2 }}
          type="date"
          label="Incorporation Date"
          name="incorporationDate"
          required
        />

        <CSVChippedSelect
          sx={{ marginBottom: 2 }}
          label="Equipment"
          name="equipment"
          isDynamic={true}
          required
        />

        <Textarea
          sx={{ marginBottom: 2 }}
          label="Equipment description"
          name="equipmentDescription"
          required
        />

        <Button
          type="submit"
          sx={{ width: 1, borderRadius: 60 }}
          color="success"
          loadingPosition="start"
          loading={isCreatingAgroProcessor}
          disabled={isCreatingAgroProcessor}
        >
          Create Agro Processor
        </Button>
      </Form>
    </Formik>
  );
}
