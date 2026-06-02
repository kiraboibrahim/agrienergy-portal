import {
  AspectRatio,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Sheet,
  Stack,
  Typography,
  Divider,
} from "@mui/joy";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
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
import ConfirmationModal from "../common/utils/ConfirmationModal";
import { ANIMALS, CROPS } from "../../constants";
import useDeleteFarmer from "../../hooks/useDeleteFarmer";
import useUpdateFarmer from "../../hooks/useUpdateFarmer";
import difference from "../../utils/difference";
import FarmerProfileSchema from "../../validation-schemas/farmer/FarmerProfileSchema";
import toTitleCase from "../../utils/toTitleCase";
import getFarmerFullName from "../../utils/getFarmerFullName";
import Error from "../common/utils/Error";

export default function FarmerProfile() {
  const [isDirty, setIsDirty] = useState(false);
  const { id: farmerId } = useParams();
  const { data: farmer, error, isFetching } = useGetFarmerQuery(farmerId);
  const [deleteFarmer, isDeletingFarmer] = useDeleteFarmer();
  const [updateFarmer, isUpdatingFarmer] = useUpdateFarmer();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

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
          marginBottom: 5,
          maxWidth: 800,
          marginLeft: "auto",
          marginRight: "auto",
          position: "relative",
        }}
      >
        {/* Full-width Responsive Banner Card */}
        <Sheet
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "xl",
            boxShadow: "sm",
            border: "1px solid rgba(0,0,0,0.08)",
            mb: 4,
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Box sx={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px", overflow: "hidden" }}>
              <AspectRatio ratio={{ xs: "21/9", sm: "24/7" }}>
                <img
                  src={resolvePhotoSrc(farmer.coverPhoto)}
                  alt={farmer.firstName}
                />
              </AspectRatio>
            </Box>
            {/* Absolute overlapping avatar */}
            <Avatar
              size="lg"
              src={resolvePhotoSrc(farmer.profilePhoto)}
              sx={{
                position: "absolute",
                left: { xs: 20, sm: 30 },
                bottom: -40,
                width: 90,
                height: 90,
                border: "4px solid white",
                boxShadow: "md",
                zIndex: 2,
              }}
            />
          </Box>
          {/* Banner Spacer & Action buttons on header */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            sx={{
              pt: 6,
              pb: 3,
              px: { xs: 2, sm: 4 },
              bgcolor: "background.surface",
            }}
          >
            <Box>
              <Typography level="h4" sx={{ fontWeight: "700" }}>
                {toTitleCase(getFarmerFullName(farmer))}
              </Typography>
              <Typography level="body-xs" color="neutral">
                Manage your profile information and credentials below
              </Typography>
            </Box>
            <ButtonGroup
              variant="outlined"
              color="neutral"
              size="sm"
              sx={{
                borderRadius: "lg",
                boxShadow: "none",
                alignSelf: { xs: "stretch", sm: "auto" },
              }}
            >
              <Button
                color="danger"
                variant="soft"
                disabled={isDeletingFarmer}
                loading={isDeletingFarmer}
                startDecorator={<DeleteOutlinedIcon />}
                onClick={() => setIsConfirmModalOpen(true)}
                sx={{ fontWeight: "bold" }}
              >
                Delete Profile
              </Button>
              <Button startDecorator={<RefreshOutlinedIcon />}>Reset</Button>
            </ButtonGroup>
          </Stack>
        </Sheet>

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
            <Stack spacing={3}>
              {/* SECTION 1: Personal Details */}
              <Sheet
                variant="outlined"
                sx={{
                  p: { xs: 2.5, sm: 4 },
                  borderRadius: "xl",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "xs",
                }}
              >
                <Typography level="h4" sx={{ fontWeight: "700", mb: 0.5 }}>
                  Identity & Contact details
                </Typography>
                <Typography level="body-xs" color="neutral" sx={{ mb: 3 }}>
                  Provide the primary contact information for this farmer
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={2.5}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
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
                </Stack>
              </Sheet>

              {/* SECTION 2: Location Information */}
              <Sheet
                variant="outlined"
                sx={{
                  p: { xs: 2.5, sm: 4 },
                  borderRadius: "xl",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "xs",
                }}
              >
                <Typography level="h4" sx={{ fontWeight: "700", mb: 0.5 }}>
                  Address
                </Typography>
                <Typography level="body-xs" color="neutral" sx={{ mb: 3 }}>
                  Specify coordinates and address for energy routing and mapping
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={2.5}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
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
                  <TextInput
                    label="Address"
                    name="address"
                    value={farmer.address}
                  />
                </Stack>
              </Sheet>

              {/* SECTION 3: Farm Operations */}
              <Sheet
                variant="outlined"
                sx={{
                  p: { xs: 2.5, sm: 4 },
                  borderRadius: "xl",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "xs",
                }}
              >
                <Typography level="h4" sx={{ fontWeight: "700", mb: 0.5 }}>
                  Farm Operations & Production parameters
                </Typography>
                <Typography level="body-xs" color="neutral" sx={{ mb: 3 }}>
                  Describe the agricultural products, livestock, and crop capacities
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={2.5}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                    <TextInput
                      sx={{ flexGrow: 1 }}
                      label="Farm name"
                      name="farmName"
                      value={farmer.farmName}
                    />
                    <TextInput
                      sx={{ flexGrow: 1 }}
                      label="Farm size (Acres)"
                      name="farmSize"
                    />
                    <TextInput
                      sx={{ flexGrow: 1 }}
                      label="Established date"
                      name="farmEstablishedOn"
                      type="date"
                    />
                  </Stack>
                  <Textarea
                    label="Farm description"
                    name="farmDescription"
                  />

                  <Divider sx={{ my: 1 }} />

                  <CSVChippedSelect
                    options={ANIMALS}
                    label="Animals selection"
                    name="animalsKept"
                  />
                  <TextInput
                    name="animalsPerType"
                    label="Animal capacities (For each selected, how many are reared?)"
                    placeholder="10,15,20"
                  />

                  <Divider sx={{ my: 1 }} />

                  <CSVChippedSelect
                    options={CROPS}
                    label="Crops grown"
                    name="cropsGrown"
                  />
                  <TextInput
                    name="acreagePerCrop"
                    label="Crop capacities (For each selected, how many acres?)"
                    placeholder="10,15,20"
                  />
                </Stack>
              </Sheet>

              {/* Actions Footer */}
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  pt: 2,
                  width: "100%",
                }}
              >
                <Button
                  sx={{
                    flexGrow: 1,
                    borderRadius: "xl",
                    fontWeight: "600",
                    transition: "all 0.2s",
                  }}
                  type="reset"
                  size="lg"
                  variant="soft"
                  color="neutral"
                  disabled={!isDirty || isUpdatingFarmer}
                >
                  Undo Changes
                </Button>
                <Button
                  size="lg"
                  color="success"
                  variant="solid"
                  startDecorator={<SaveOutlinedIcon />}
                  sx={{
                    flexGrow: 2,
                    borderRadius: "xl",
                    fontWeight: "600",
                    background: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)",
                    boxShadow: "0 4px 12px rgba(27,94,32,0.2)",
                    transition: "all 0.2s",
                    "&:hover": {
                      background: "linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)",
                    },
                  }}
                  type="submit"
                  disabled={!isDirty || isUpdatingFarmer}
                  loading={isUpdatingFarmer}
                  loadingPosition="start"
                >
                  Save Farmer Profile
                </Button>
              </Stack>
            </Stack>
          </Form>
        </DirtyFormik>
        <ConfirmationModal
          open={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={async () => {
            setIsConfirmModalOpen(false);
            await deleteFarmer(farmerId);
          }}
          isLoading={isDeletingFarmer}
          title="Delete Farmer Profile"
          message={`Are you sure you want to delete the profile of ${getFarmerFullName(farmer)}? This action cannot be undone.`}
        />
      </Box>
    );
  }
}
