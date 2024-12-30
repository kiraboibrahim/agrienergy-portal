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
} from "@mui/joy";
import { useParams } from "react-router";
import Loading from "../common/utils/Loading";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
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

export default function GroupProfile() {
  const { id: groupId } = useParams();
  // Determines whether edits have been made to the profile form, if yes, the form is dirty
  const [isDirtyProfile, setIsDirtyProfile] = useState(false);
  const [deleteGroup, isDeletingGroup] = useDeleteGroup();
  const [updateGroup, isUpdatingGroup] = useUpdateGroup();

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
              <img src={resolvePhotoSrc(group.coverPhoto)} alt={group.name} />
            </AspectRatio>
            <AvatarGroup
              sx={{
                position: "absolute",
                left: 10,
                bottom: -20,
              }}
            >
              <Avatar
                size="sm"
                variant="solid"
                src={resolvePhotoSrc(group.profilePhoto)}
              ></Avatar>
              {groupMembers.slice(0, 4).map((member) => {
                return (
                  <Avatar
                    src={resolvePhotoSrc(member.profilePhoto)}
                    size="sm"
                    variant="solid"
                  />
                );
              })}
            </AvatarGroup>
          </Box>
        </Sheet>
        <ButtonGroup
          variant="soft"
          color="warning"
          buttonFlex={1}
          sx={{ marginTop: 4 }}
        >
          <Button
            disabled={isDeletingGroup}
            loading={isDeletingGroup}
            loadingPosition="start"
            startDecorator={<DeleteOutlinedIcon />}
            onClick={async () => {
              await deleteGroup(groupId);
            }}
          >
            Delete
          </Button>

          <Button startDecorator={<LockResetOutlinedIcon />}>Reset</Button>
        </ButtonGroup>
        <Typography level="h3" sx={{ marginTop: 3, marginBottom: 2 }}>
          {toTitleCase(group.name)}
        </Typography>
        <DirtyFormik
          initialValues={{ ...group }}
          validationSchema={GroupProfileSchema}
          onSubmit={async (values) => {
            // Submit only values that were updated
            const updatedValues = difference(group, values);
            if (!isEmpty(updatedValues)) {
              await updateGroup(groupId, updatedValues);
            }
          }}
          onDirty={(isDirty) => setIsDirtyProfile(isDirty)}
        >
          <Form>
            <TextInput name="name" label="Name" sx={{ marginBottom: 2 }} />
            <TextInput
              name="phoneNumber"
              label="Phone number"
              sx={{ marginBottom: 2 }}
            />
            <TextInput
              name="email"
              label="Email"
              type="email"
              sx={{ marginBottom: 2 }}
            />
            <TextInput
              name="address"
              label="Address"
              sx={{ marginBottom: 2 }}
            />
            <TextInput
              name="website"
              label="Website"
              sx={{ marginBottom: 2 }}
            />
            <LocalSelect
              label="What kind of group is this?"
              name="type"
              defaultValue="SACCO"
              options={["SACCO", "COOPERATIVE", "OTHER"]}
              sx={{ marginBottom: 2 }}
            ></LocalSelect>
            <Textarea
              name="description"
              label="Tell us more about this group"
            />
            <Typography level="title" sx={{ marginTop: 2 }}>
              Members
            </Typography>
            <FarmerSelect
              name="farmers"
              placeholder="Search to add farmers"
              sx={{ marginBottom: 2 }}
            />
            <AgroProcessorSelect
              name="agroProcessors"
              placeholder="Search to add agro processors"
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
                disabled={!isDirtyProfile || isUpdatingGroup}
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
                disabled={!isDirtyProfile || isUpdatingGroup}
                loading={isUpdatingGroup}
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
