import { Form, Formik } from "formik";
import TextInput from "../common/fields/TextInput";
import CSVChippedSelect from "../common/fields/CSVChippedSelect";
import { Button } from "@mui/joy";
import EscoProfileSchema from "../../validation-schemas/esco/EscoProfileSchema";
import useCreateEsco from "../../hooks/useCreateEsco";

export default function CreateEscoForm() {
  const [createEsco, isCreatingEsco] = useCreateEsco();
  return (
    <Formik
      validationSchema={EscoProfileSchema}
      initialValues={{
        name: "",
        email: "",
        phoneNumber: "",
        website: "",
        latitude: "",
        longitude: "",
        incorporationDate: "",
        specialization: "",
      }}
      onSubmit={async (values) => {
        await createEsco(values);
      }}
    >
      <Form>
        <TextInput name="name" label="Name" required sx={{ marginBottom: 2 }} />
        <TextInput
          name="email"
          label="Email"
          type="email"
          required
          sx={{ marginBottom: 2 }}
        />
        <TextInput
          name="phoneNumber"
          label="Phone number"
          type="tel"
          required
          sx={{ marginBottom: 2 }}
        />
        <TextInput
          name="website"
          label="Website"
          placeholder="example.com"
          sx={{ marginBottom: 2 }}
        />
        <TextInput
          name="address"
          label="Address"
          required
          sx={{ marginBottom: 2 }}
        />
        <TextInput
          name="latitude"
          label="Latitude"
          type="number"
          sx={{ marginBottom: 2 }}
        />
        <TextInput
          name="longitude"
          label="Longitude"
          type="number"
          sx={{ marginBottom: 2 }}
        />
        <TextInput
          name="incorporationDate"
          label="Date of Incorporation"
          type="date"
          required
          sx={{ marginBottom: 2 }}
        />
        <CSVChippedSelect
          isDynamic={true}
          name="specialization"
          label="What do you specialize in?"
          required
          sx={{ marginBottom: 2 }}
        />

        <Button
          type="submit"
          sx={{ borderRadius: 60, width: 1 }}
          color="success"
          loading={isCreatingEsco}
          loadingPosition="start"
          disabled={isCreatingEsco}
        >
          Create Esco
        </Button>
      </Form>
    </Formik>
  );
}
