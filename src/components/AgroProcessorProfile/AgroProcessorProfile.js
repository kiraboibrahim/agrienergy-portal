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
import toTitleCase from "../../utils/toTitleCase";
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
                  src={resolvePhotoSrc(agroProcessor.coverPhoto)}
                  alt={agroProcessor.name}
                />
              </AspectRatio>
            </Box>
            {/* Absolute overlapping avatar */}
            <Avatar
              size="lg"
              src={resolvePhotoSrc(agroProcessor.profilePhoto)}
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
                {toTitleCase(agroProcessor.name)}
              </Typography>
              <Typography level="body-xs" color="neutral">
                Manage your agro-processing factory details below
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
                disabled={isDeletingAgroProcessor}
                loading={isDeletingAgroProcessor}
                startDecorator={<DeleteOutlinedIcon />}
                onClick={async () => await deleteAgroProcessor(agroProcessorId)}
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
            <Stack spacing={3}>
              {/* SECTION 1: Identity & Credentials */}
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
                  Processor Identity & Contacts
                </Typography>
                <Typography level="body-xs" color="neutral" sx={{ mb: 3 }}>
                  Official registration credentials and verified contact channels
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={2.5}>
                  <TextInput name="name" label="Factory / Corporate Name" />
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                    <TextInput
                      sx={{ flexGrow: 1 }}
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
                      sx={{ flexGrow: 1 }}
                      label="Website URL"
                      name="website"
                    />
                  </Stack>
                </Stack>
              </Sheet>

              {/* SECTION 2: Geographical Specs */}
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
                  Operations & Location details
                </Typography>
                <Typography level="body-xs" color="neutral" sx={{ mb: 3 }}>
                  Define physical logistics address and incorporation metrics
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={2.5}>
                  <TextInput
                    name="address"
                    label="Physical Address"
                  />
                  <TextInput
                    name="incorporationDate"
                    label="Incorporation Date"
                  />
                </Stack>
              </Sheet>

              {/* SECTION 3: Processing Equipment & Inventory */}
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
                  Processing Machinery & Equipment
                </Typography>
                <Typography level="body-xs" color="neutral" sx={{ mb: 3 }}>
                  Detail primary equipment assets and energy operations capacities
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={2.5}>
                  <CSVChippedSelect
                    label="Machinery Inventory"
                    name="equipment"
                    isDynamic={true}
                  />
                  <Textarea
                    label="Inventory Specification Description"
                    name="equipmentDescription"
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
                  disabled={!isDirty || isUpdatingAgroProcessor}
                >
                  Undo Changes
                </Button>
                <Button
                  size="lg"
                  color="warning"
                  variant="solid"
                  startDecorator={<SaveOutlinedIcon />}
                  sx={{
                    flexGrow: 2,
                    borderRadius: "xl",
                    fontWeight: "600",
                    background: "linear-gradient(135deg, #e65100 0%, #ff8f00 100%)",
                    boxShadow: "0 4px 12px rgba(230,81,0,0.2)",
                    transition: "all 0.2s",
                    "&:hover": {
                      background: "linear-gradient(135deg, #f57c00 0%, #e65100 100%)",
                    },
                  }}
                  type="submit"
                  disabled={!isDirty || isUpdatingAgroProcessor}
                  loading={isUpdatingAgroProcessor}
                  loadingPosition="start"
                >
                  Save Agro Processor Profile
                </Button>
              </Stack>
            </Stack>
          </Form>
        </DirtyFormik>
      </Box>
    );
  }
}
