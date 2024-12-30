import {
  AspectRatio,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Sheet,
  Stack,
} from "@mui/joy";
import { useParams } from "react-router";
import Loading from "../common/utils/Loading";
import { useGetEscoQuery } from "../../services/esco";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import TextInput from "../common/fields/TextInput";
import { Form } from "formik";
import CSVChippedSelect from "../common/fields/CSVChippedSelect";
import EscoProfileSchema from "../../validation-schemas/esco/EscoProfileSchema";
import difference from "../../utils/difference";
import isEmpty from "../../utils/isEmpty";
import DirtyFormik from "../common/fields/DirtyFormik";
import { useState } from "react";
import resolvePhotoSrc from "../../utils/resolve-photo-src";
import useDeleteEsco from "../../hooks/useDeleteEsco";
import useUpdateEsco from "../../hooks/useUpdateEsco";
import Error from "../common/utils/Error";

export default function EscoProfile() {
  const { id: escoId } = useParams();
  // Determines whether edits have been made to the profile form, if yes, the form is dirty
  const [isDirtyProfile, setIsDirtyProfile] = useState(false);
  const [deleteEsco, isDeletingEsco] = useDeleteEsco();
  const [updateEsco, isUpdatingEsco] = useUpdateEsco();
  const {
    data: esco,
    error: escoFetchError,
    isFetching: isFetchingEsco,
  } = useGetEscoQuery(escoId);

  if (isFetchingEsco) return <Loading />;

  if (!!escoFetchError) return <Error error={escoFetchError} />;

  if (!!esco) {
    return (
      <Box
        sx={{
          padding: 2,
          marginBottom: 3,
          maxWidth: 800,
          marginLeft: "auto",
          marginRight: "auto",
          position: "relative",
        }}
      >
        <Sheet
          sx={{
            display: "flex",
            justifyContent: "center",
            borderRadius: "md",
          }}
          variant="soft"
          color="success"
        >
          <Box sx={{ width: 400, position: "relative" }}>
            <AspectRatio variant="plain">
              <img src={resolvePhotoSrc(esco.coverPhoto)} alt={esco.name} />
            </AspectRatio>
            <Avatar
              size="lg"
              variant="solid"
              src={resolvePhotoSrc(esco.profilePhoto)}
              sx={{
                position: "absolute",
                left: 10,
                bottom: -20,
                boxShadow: "md",
              }}
            ></Avatar>
          </Box>
        </Sheet>
        <ButtonGroup
          variant="soft"
          color="warning"
          buttonFlex={1}
          sx={{ marginTop: 4 }}
        >
          <Button
            disabled={isDeletingEsco}
            loading={isDeletingEsco}
            loadingPosition="start"
            startDecorator={<DeleteOutlinedIcon />}
            onClick={async () => {
              await deleteEsco(escoId);
            }}
          >
            Delete
          </Button>

          <Button startDecorator={<LockResetOutlinedIcon />}>Reset</Button>
        </ButtonGroup>

        <DirtyFormik
          initialValues={{ ...esco }}
          validationSchema={EscoProfileSchema}
          onSubmit={async (values) => {
            // Submit only values that were updated
            const updatedValues = difference(esco, values);
            if (!isEmpty(updatedValues)) {
              await updateEsco(escoId, updatedValues);
            }
          }}
          onDirty={(isDirty) => setIsDirtyProfile(isDirty)}
        >
          <Form>
            <Box sx={{ marginTop: 4 }}>
              <TextInput name="name" label="Name" />
              <TextInput
                sx={{ marginTop: 2 }}
                name="phoneNumber"
                label="Phone number"
              />
              <TextInput sx={{ marginTop: 2 }} name="website" label="Website" />
              <TextInput
                sx={{ marginTop: 2 }}
                label="Email"
                name="email"
                endDecorator={
                  esco.isVerified ? (
                    <VerifiedOutlinedIcon color="success" />
                  ) : (
                    <Button variant="soft" size="sm" color="danger">
                      Verify
                    </Button>
                  )
                }
              />
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ marginTop: 2 }}
              >
                <TextInput
                  sx={{ flexGrow: 1 }}
                  name="latitude"
                  label="Latitude"
                />
                <TextInput
                  sx={{ flexGrow: 1 }}
                  name="longitude"
                  label="Longitude"
                />
                <TextInput
                  sx={{ flexGrow: 1 }}
                  name="address"
                  label="Address"
                />
              </Stack>
              <TextInput
                sx={{ marginTop: 2 }}
                name="incorporationDate"
                label="Incorporation Date"
                type="date"
              />
              <CSVChippedSelect
                isDynamic={true}
                sx={{ marginTop: 2 }}
                name="specialization"
                label="Specialization"
              />
            </Box>
            <Stack
              direction="row"
              sx={{
                marginTop: 3,
                width: "100%",
              }}
            >
              <Button
                sx={{ flexGrow: 1 }}
                type="reset"
                size="md"
                variant="soft"
                color="success"
                disabled={!isDirtyProfile || isUpdatingEsco}
              >
                Undo Changes
              </Button>
              <Button
                size="md"
                color="success"
                variant="solid"
                startDecorator={<SaveOutlinedIcon />}
                sx={{ flexGrow: 2, marginLeft: 2 }}
                type="submit"
                disabled={!isDirtyProfile || isUpdatingEsco}
                loading={isUpdatingEsco}
                loadingPosition="start"
              >
                Save
              </Button>
            </Stack>
          </Form>
        </DirtyFormik>
      </Box>
    );
  }
}
