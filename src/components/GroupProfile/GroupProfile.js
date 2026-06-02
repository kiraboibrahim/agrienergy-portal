import {
  AspectRatio,
  Avatar,
  AvatarGroup,
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
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import { Form } from "formik";
import difference from "../../utils/difference";
import isEmpty from "../../utils/isEmpty";
import DirtyFormik from "../common/fields/DirtyFormik";
import { useState } from "react";
import resolvePhotoSrc from "../../utils/resolve-photo-src";
import { useGetGroupQuery } from "../../services/group";
import Error from "../common/utils/Error";
import GroupProfileSchema from "../../validation-schemas/group/GroupProfileSchema";
import getGroupMembers from "../../utils/getGroupMembers";
import toTitleCase from "../../utils/toTitleCase";
import FarmerSelect from "../common/fields/FarmerSelect";
import LocalSelect from "../common/fields/LocalSelect";
import TextInput from "../common/fields/TextInput";
import Textarea from "../common/fields/Textarea";
import useUpdateGroup from "../../hooks/useUpdateGroup";
import useDeleteGroup from "../../hooks/useDeleteGroup";
import AgroProcessorSelect from "../common/fields/AgroProcessorSelect";
import ConfirmationModal from "../common/utils/ConfirmationModal";

export default function GroupProfile() {
  const { id: groupId } = useParams();
  const [isDirtyProfile, setIsDirtyProfile] = useState(false);
  const [deleteGroup, isDeletingGroup] = useDeleteGroup();
  const [updateGroup, isUpdatingGroup] = useUpdateGroup();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const {
    data: group,
    error: fetchError,
    isFetching,
  } = useGetGroupQuery(groupId);

  if (isFetching) return <Loading />;
  if (!!fetchError) return <Error error={fetchError} />;

  if (!!group) {
    const groupMembers = getGroupMembers(group);
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
                <img src={resolvePhotoSrc(group.coverPhoto)} alt={group.name} />
              </AspectRatio>
            </Box>
            {/* Absolute overlapping avatar group */}
            <AvatarGroup
              sx={{
                position: "absolute",
                left: { xs: 20, sm: 30 },
                bottom: -30,
                zIndex: 2,
                "& .MuiAvatar-root": {
                  border: "3px solid white",
                  boxShadow: "md",
                },
              }}
            >
              <Avatar
                size="md"
                variant="solid"
                src={resolvePhotoSrc(group.profilePhoto)}
              />
              {groupMembers.slice(0, 4).map((member, index) => {
                return (
                  <Avatar
                    key={index}
                    src={resolvePhotoSrc(member.profilePhoto)}
                    size="md"
                    variant="solid"
                  />
                );
              })}
            </AvatarGroup>
          </Box>
          {/* Banner Spacer & Action buttons on header */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            sx={{
              pt: 5,
              pb: 3,
              px: { xs: 2, sm: 4 },
              bgcolor: "background.surface",
            }}
          >
            <Box>
              <Typography level="h4" sx={{ fontWeight: "700" }}>
                {toTitleCase(group.name)}
              </Typography>
              <Typography level="body-xs" color="neutral">
                Manage group info and association configurations below
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
                disabled={isDeletingGroup}
                loading={isDeletingGroup}
                startDecorator={<DeleteOutlinedIcon />}
                onClick={() => setIsConfirmModalOpen(true)}
                sx={{ fontWeight: "bold" }}
              >
                Delete Group
              </Button>
              <Button startDecorator={<RefreshOutlinedIcon />}>Reset</Button>
            </ButtonGroup>
          </Stack>
        </Sheet>

        <Typography level="h3" sx={{ fontWeight: "800", mb: 3 }}>
          {toTitleCase(group.name)}
        </Typography>

        <DirtyFormik
          initialValues={{ ...group }}
          validationSchema={GroupProfileSchema}
          onSubmit={async (values) => {
            const updatedValues = difference(group, values);
            if (!isEmpty(updatedValues)) {
              await updateGroup(groupId, updatedValues);
            }
          }}
          onDirty={(isDirty) => setIsDirtyProfile(isDirty)}
        >
          <Form>
            <Stack spacing={3}>
              {/* SECTION 1: Group Identity */}
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
                  Group Profile & Identity
                </Typography>
                <Typography level="body-xs" color="neutral" sx={{ mb: 3 }}>
                  Provide organization name, legal framework, and mission statement
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={2.5}>
                  <TextInput name="name" label="Group / Cooperative Name" />
                  <LocalSelect
                    label="What kind of group is this?"
                    name="type"
                    options={["SACCO", "COOPERATIVE", "OTHER"]}
                  />
                  <Textarea
                    name="description"
                    label="Tell us more about this group"
                  />
                </Stack>
              </Sheet>

              {/* SECTION 2: Communications & Routing */}
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
                  Communications & Location details
                </Typography>
                <Typography level="body-xs" color="neutral" sx={{ mb: 3 }}>
                  Primary contact channels and administrative headquarters address
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={2.5}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                    <TextInput
                      sx={{ flexGrow: 1 }}
                      name="phoneNumber"
                      label="Phone number"
                    />
                    <TextInput
                      sx={{ flexGrow: 1 }}
                      name="email"
                      label="Email"
                      type="email"
                    />
                  </Stack>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                    <TextInput
                      sx={{ flexGrow: 1 }}
                      name="address"
                      label="Physical address"
                    />
                    <TextInput
                      sx={{ flexGrow: 1 }}
                      name="website"
                      label="Website"
                    />
                  </Stack>
                </Stack>
              </Sheet>

              {/* SECTION 3: Member Associations */}
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
                  Member Associations
                </Typography>
                <Typography level="body-xs" color="neutral" sx={{ mb: 3 }}>
                  Assign and manage member associations (farmers and agro-processors)
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={2.5}>
                  <FarmerSelect
                    name="farmers"
                    placeholder="Search to add farmers"
                  />
                  <AgroProcessorSelect
                    name="agroProcessors"
                    placeholder="Search to add agro processors"
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
                  disabled={!isDirtyProfile || isUpdatingGroup}
                >
                  Undo Changes
                </Button>
                <Button
                  size="lg"
                  color="neutral"
                  variant="solid"
                  startDecorator={<SaveOutlinedIcon />}
                  sx={{
                    flexGrow: 2,
                    borderRadius: "xl",
                    fontWeight: "600",
                    background: "linear-gradient(135deg, #455a64 0%, #263238 100%)",
                    boxShadow: "0 4px 12px rgba(69,90,100,0.2)",
                    transition: "all 0.2s",
                    "&:hover": {
                      background: "linear-gradient(135deg, #546e7a 0%, #455a64 100%)",
                    },
                  }}
                  type="submit"
                  disabled={!isDirtyProfile || isUpdatingGroup}
                  loading={isUpdatingGroup}
                  loadingPosition="start"
                >
                  Save Group Profile
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
            await deleteGroup(groupId);
          }}
          isLoading={isDeletingGroup}
          title="Delete Group"
          message={`Are you sure you want to delete the group "${group.name}"? This action cannot be undone.`}
        />
      </Box>
    );
  }
}
