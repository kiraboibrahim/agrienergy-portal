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
import { useParams } from "react-router";
import Loading from "../common/utils/Loading";
import { useGetEscoQuery } from "../../services/esco";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import TextInput from "../common/fields/TextInput";
import { Form } from "formik";
import CSVChippedSelect from "../common/fields/CSVChippedSelect";
import EscoProfileSchema from "../../validation-schemas/esco/EscoProfileSchema";
import difference from "../../utils/difference";
import isEmpty from "../../utils/isEmpty";
import toTitleCase from "../../utils/toTitleCase";
import DirtyFormik from "../common/fields/DirtyFormik";
import { useState } from "react";
import resolvePhotoSrc from "../../utils/resolve-photo-src";
import useDeleteEsco from "../../hooks/useDeleteEsco";
import useUpdateEsco from "../../hooks/useUpdateEsco";
import Error from "../common/utils/Error";

export default function EscoProfile() {
  const { id: escoId } = useParams();
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
                <img src={resolvePhotoSrc(esco.coverPhoto)} alt={esco.name} />
              </AspectRatio>
            </Box>
            {/* Absolute overlapping avatar */}
            <Avatar
              size="lg"
              src={resolvePhotoSrc(esco.profilePhoto)}
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
                {toTitleCase(esco.name)}
              </Typography>
              <Typography level="body-xs" color="neutral">
                Manage your credentials and profile details below
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
                disabled={isDeletingEsco}
                loading={isDeletingEsco}
                startDecorator={<DeleteOutlinedIcon />}
                onClick={async () => {
                  await deleteEsco(escoId);
                }}
                sx={{ fontWeight: "bold" }}
              >
                Delete ESCO
              </Button>
              <Button startDecorator={<RefreshOutlinedIcon />}>Reset</Button>
            </ButtonGroup>
          </Stack>
        </Sheet>

        <DirtyFormik
          initialValues={{ ...esco }}
          validationSchema={EscoProfileSchema}
          onSubmit={async (values) => {
            const updatedValues = difference(esco, values);
            if (!isEmpty(updatedValues)) {
              await updateEsco(escoId, updatedValues);
            }
          }}
          onDirty={(isDirty) => setIsDirtyProfile(isDirty)}
        >
          <Form>
            <Stack spacing={3}>
              {/* SECTION 1: Corporate Identity & Verification */}
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
                  Identity and contacts
                </Typography>
                <Typography level="body-xs" color="neutral" sx={{ mb: 3 }}>
                  Provide the official name and verified contact info
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={2.5}>
                  <TextInput name="name" label="Name" />
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                    <TextInput
                      sx={{ flexGrow: 1 }}
                      name="phoneNumber"
                      label="Phone number"
                    />
                    <TextInput
                      sx={{ flexGrow: 1 }}
                      name="website"
                      label="Website"
                    />
                  </Stack>
                  <TextInput
                    label="Business Email"
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
                </Stack>
              </Sheet>

              {/* SECTION 2: Geographical Coordinates & Address */}
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
                  Define precise coordinates and address for company operations
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={2.5}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
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
                  </Stack>
                  <TextInput
                    name="address"
                    label="Physical Address"
                  />
                </Stack>
              </Sheet>

              {/* SECTION 3: Business Specifications */}
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
                  ESCO Business Parameters
                </Typography>
                <Typography level="body-xs" color="neutral" sx={{ mb: 3 }}>
                  Set legal parameters and primary areas of energy specialization
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={2.5}>
                  <TextInput
                    name="incorporationDate"
                    label="Incorporation Date"
                    type="date"
                  />
                  <CSVChippedSelect
                    isDynamic={true}
                    name="specialization"
                    label="Areas of Specialization"
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
                  disabled={!isDirtyProfile || isUpdatingEsco}
                >
                  Undo Changes
                </Button>
                <Button
                  size="lg"
                  color="primary"
                  variant="solid"
                  startDecorator={<SaveOutlinedIcon />}
                  sx={{
                    flexGrow: 2,
                    borderRadius: "xl",
                    fontWeight: "600",
                    background: "linear-gradient(135deg, #0288d1 0%, #01579b 100%)",
                    boxShadow: "0 4px 12px rgba(2,136,209,0.2)",
                    transition: "all 0.2s",
                    "&:hover": {
                      background: "linear-gradient(135deg, #039be5 0%, #0288d1 100%)",
                    },
                  }}
                  type="submit"
                  disabled={!isDirtyProfile || isUpdatingEsco}
                  loading={isUpdatingEsco}
                  loadingPosition="start"
                >
                  Save ESCO Profile
                </Button>
              </Stack>
            </Stack>
          </Form>
        </DirtyFormik>
      </Box>
    );
  }
}
