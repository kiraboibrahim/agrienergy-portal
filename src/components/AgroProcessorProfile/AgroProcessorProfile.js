import {
  AspectRatio,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Sheet,
  Stack,
} from "@mui/joy";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import { useParams } from "react-router";
import Loading from "../common/utils/Loading";
import TextInput from "../common/fields/TextInput";
import Textarea from "../common/fields/Textarea";
import { Form } from "formik";
import DirtyFormik from "../common/fields/DirtyFormik";
import { useState } from "react";
import resolvePhotoSrc from "../../utils/resolve-photo-src";
import CSVChippedSelect from "../common/fields/CSVChippedSelect";
import useDeleteAgroProcessor from "../../hooks/useDeleteAgroProcessor";
import useUpdateAgroProcessor from "../../hooks/useUpdateAgroProcessor";
import difference from "../../utils/difference";
import Error from "../common/utils/Error";
import AgroProcessorProfileSchema from "../../validation-schemas/agroProcessor/AgroProcessorProfileSchema";
import { useGetAgroProcessorQuery } from "../../services/agroProcessor";

export default function AgroProcessorProfile() {
  const [isDirty, setIsDirty] = useState(false);
  const { id: agroProcessorId } = useParams();
  const {
    data: agroProcessor,
    error,
    isFetching,
  } = useGetAgroProcessorQuery(agroProcessorId);
  const [deleteAgroProcessor, isDeletingAgroProcessor] =
    useDeleteAgroProcessor();
  const [updateAgroProcessor, isUpdatingAgroProcessor] =
    useUpdateAgroProcessor();

  if (!!error) {
    return <Error error={error} />;
  }
  if (isFetching) {
    return <Loading />;
  }
  if (!!agroProcessor) {
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
              <img
                src={resolvePhotoSrc(agroProcessor.coverPhoto)}
                alt={agroProcessor.name}
              />
            </AspectRatio>
            <Avatar
              size="lg"
              variant="solid"
              src={resolvePhotoSrc(agroProcessor.profilePhoto)}
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
            disabled={isDeletingAgroProcessor}
            loading={isDeletingAgroProcessor}
            loadingPosition="start"
            startDecorator={<DeleteOutlinedIcon />}
            onClick={async () => await deleteAgroProcessor(agroProcessorId)}
          >
            Delete
          </Button>

          <Button startDecorator={<LockResetOutlinedIcon />}>Reset</Button>
        </ButtonGroup>
        <DirtyFormik
          initialValues={{
            ...agroProcessor,
          }}
          validationSchema={AgroProcessorProfileSchema}
          onSubmit={async (values) => {
            const updatedValues = difference(agroProcessor, values);
            return await updateAgroProcessor(agroProcessorId, updatedValues);
          }}
          onDirty={(isDirty) => setIsDirty(isDirty)}
        >
          <Form>
            <Box sx={{ marginTop: 4 }}>
              <TextInput sx={{ marginBottom: 2 }} label="Name" name="name" />
              <TextInput
                sx={{ marginBottom: 2 }}
                label="Phone number"
                name="phoneNumber"
                endDecorator={
                  agroProcessor.isVerified ? (
                    <VerifiedOutlinedIcon color="success" />
                  ) : (
                    <Button variant="soft" size="sm" color="danger">
                      Verify
                    </Button>
                  )
                }
              />

              <TextInput
                sx={{ marginBottom: 2 }}
                label="Address"
                name="address"
              />
              <TextInput
                sx={{ marginBottom: 2 }}
                label="Website"
                name="website"
              />

              <TextInput
                sx={{ marginBottom: 2 }}
                label="Incorporation Date"
                name="incorporationDate"
              />

              <CSVChippedSelect
                sx={{ marginTop: 2 }}
                label="Equipment"
                name="equipment"
                isDynamic={true}
              />

              <Textarea
                sx={{ marginTop: 2 }}
                label="Equipment description"
                name="equipmentDescription"
              />

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
                  disabled={!isDirty || isUpdatingAgroProcessor}
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
                  disabled={!isDirty || isUpdatingAgroProcessor}
                  loading={isUpdatingAgroProcessor}
                  loadingPosition="start"
                >
                  Save
                </Button>
              </Stack>
            </Box>
          </Form>
        </DirtyFormik>
      </Box>
    );
  }
}
