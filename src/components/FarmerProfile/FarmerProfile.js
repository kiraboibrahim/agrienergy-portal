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
import { useGetFarmerQuery } from "../../services/farmer";
import Loading from "../common/utils/Loading";
import TextInput from "../common/fields/TextInput";
import Textarea from "../common/fields/Textarea";
import { Form } from "formik";
import DirtyFormik from "../common/fields/DirtyFormik";
import { useState } from "react";
import resolvePhotoSrc from "../../utils/resolve-photo-src";
import CSVChippedSelect from "../common/fields/CSVChippedSelect";
import { ANIMALS, CROPS } from "../../constants";
import useDeleteFarmer from "../../hooks/useDeleteFarmer";
import useUpdateFarmer from "../../hooks/useUpdateFarmer";
import difference from "../../utils/difference";
import FarmerProfileSchema from "../../validation-schemas/farmer/FarmerProfileSchema";
import Error from "../common/utils/Error";

export default function FarmerProfile() {
  const [isDirty, setIsDirty] = useState(false);
  const { id: farmerId } = useParams();
  const { data: farmer, error, isFetching } = useGetFarmerQuery(farmerId);
  const [deleteFarmer, isDeletingFarmer] = useDeleteFarmer();
  const [updateFarmer, isUpdatingFarmer] = useUpdateFarmer();

  if (!!error) {
    return <Error error={error} />;
  }
  if (isFetching) {
    return <Loading />;
  }
  if (!!farmer) {
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
                src={resolvePhotoSrc(farmer.coverPhoto)}
                alt={farmer.firstName}
              />
            </AspectRatio>
            <Avatar
              size="lg"
              variant="solid"
              src={resolvePhotoSrc(farmer.profilePhoto)}
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
            disabled={isDeletingFarmer}
            loading={isDeletingFarmer}
            loadingPosition="start"
            startDecorator={<DeleteOutlinedIcon />}
            onClick={async () => await deleteFarmer(farmerId)}
          >
            Delete
          </Button>

          <Button startDecorator={<LockResetOutlinedIcon />}>Reset</Button>
        </ButtonGroup>
        <DirtyFormik
          initialValues={{
            ...farmer,
          }}
          validationSchema={FarmerProfileSchema}
          onSubmit={async (values) => {
            const updatedValues = difference(farmer, values);
            await updateFarmer(farmerId, updatedValues);
          }}
          onDirty={(isDirty) => setIsDirty(isDirty)}
        >
          <Form>
            <Box sx={{ marginTop: 4 }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextInput
                  sx={{ flexGrow: 1 }}
                  name="firstName"
                  label="First name"
                />
                <TextInput
                  sx={{ flexGrow: 1 }}
                  label="Last name"
                  name="lastName"
                />
              </Stack>
              <TextInput
                sx={{ marginTop: 2 }}
                label="Phone number"
                name="phoneNumber"
                endDecorator={
                  farmer.isVerified ? (
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
                  label="Latitude"
                  name="latitude"
                />
                <TextInput
                  sx={{ flexGrow: 1 }}
                  label="Longitude"
                  name="longitude"
                />
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ marginTop: 3 }}
              >
                <TextInput
                  sx={{ flexGrow: 1 }}
                  label="Farm name"
                  name="farmName"
                  value={farmer.farmName}
                />

                <TextInput
                  sx={{ flexGrow: 1 }}
                  label="Farm size"
                  name="farmSize"
                />

                <TextInput
                  sx={{ flexGrow: 1 }}
                  label="Farm date"
                  name="farmEstablishedOn"
                  type="date"
                />
              </Stack>
              <Textarea
                sx={{ marginTop: 2 }}
                label="Farm description"
                name="farmDescription"
              />

              <CSVChippedSelect
                options={ANIMALS}
                sx={{ marginTop: 2 }}
                label="Animals"
                name="animalsKept"
              />
              <TextInput
                name="animalsPerType"
                label="For each animal selected, how many animals do you rear?"
                placeholder="10,15,20"
                sx={{ marginBottom: 1 }}
              />

              <CSVChippedSelect
                options={CROPS}
                sx={{ marginTop: 2 }}
                label="Crops"
                name="cropsGrown"
              />
              <TextInput
                name="acreagePerCrop"
                label="For each crop selected, how many acres per crop?"
                placeholder="10,15,20"
                sx={{ marginTop: 2 }}
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
                  disabled={!isDirty || isUpdatingFarmer}
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
                  disabled={!isDirty || isUpdatingFarmer}
                  loading={isUpdatingFarmer}
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
