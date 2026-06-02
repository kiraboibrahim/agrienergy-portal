import {
  Card,
  Box,
  CardContent,
  Chip,
  Link,
  Avatar,
  Menu,
  Dropdown,
  MenuItem,
  MenuButton,
  Typography,
  IconButton,
  AspectRatio,
} from "@mui/joy";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import resolvePhotoSrc from "../../utils/resolve-photo-src";
import toTitleCase from "../../utils/toTitleCase";
import useDeleteGroup from "../../hooks/useDeleteGroup";
import { useGetGroupsQuery } from "../../services/group";
import Empty from "../common/utils/Empty";
import Error from "../common/utils/Error";
import PaginatedGridList from "../common/layouts/PaginatedGridList";
import Loading from "../common/utils/Loading";
import { useState } from "react";
import ConfirmationModal from "../common/utils/ConfirmationModal";

function GroupItem({ group }) {
  const [deleteGroup, isDeletingGroup] = useDeleteGroup();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: "xl",
        boxShadow: "sm",
        overflow: "hidden",
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "md",
          borderColor: "neutral.300",
        },
        bgcolor: "background.surface",
      }}
      color={isDeletingGroup ? "danger" : "neutral"}
    >
      <Box sx={{ position: "relative", width: "100%" }}>
        <AspectRatio ratio="16/9">
          <img
            src={resolvePhotoSrc(group.coverPhoto)}
            alt={group.name}
            loading="lazy"
          />
        </AspectRatio>
        
        {/* Action button overlay on cover photo */}
        <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}>
          <Dropdown>
            <MenuButton
              slots={{ root: IconButton }}
              slotProps={{
                root: {
                  variant: "soft",
                  color: "neutral",
                  size: "sm",
                  sx: {
                    borderRadius: "50%",
                    bgcolor: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(6px)",
                    boxShadow: "sm",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                    },
                  },
                },
              }}
            >
              <MoreVertIcon />
            </MenuButton>
            <Menu placement="bottom-end">
              <MenuItem variant="soft" color="danger" onClick={() => setIsConfirmModalOpen(true)}>
                <Typography
                  level="body-sm"
                  startDecorator={<DeleteOutlinedIcon color="danger" />}
                  textColor="danger.500"
                >
                  Delete Group
                </Typography>
              </MenuItem>
            </Menu>
          </Dropdown>
        </Box>
      </Box>

      <CardContent sx={{ pt: 0, px: 2, pb: 2, position: "relative" }}>
        {/* Floating Avatar & Category Tag */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 1 }}>
          <Avatar
            src={resolvePhotoSrc(group.profilePhoto)}
            sx={{
              width: 64,
              height: 64,
              border: "3px solid var(--joy-palette-background-surface)",
              boxShadow: "md",
              marginTop: "-32px",
              zIndex: 5,
              bgcolor: "neutral.softBg",
            }}
          >
            {group.name[0]}
          </Avatar>
          
          <Chip
            color="neutral"
            variant="soft"
            size="sm"
            startDecorator={<GroupsOutlinedIcon sx={{ fontSize: "1rem" }} />}
            sx={{ fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px" }}
          >
            Group
          </Chip>
        </Box>

        {/* Text content details */}
        <Box sx={{ mt: 1 }}>
          <Link
            component={RouterLink}
            to={`/groups/${group.id}`}
            overlay
            underline="none"
            textColor="text.primary"
            sx={{
              display: "block",
              fontWeight: "bold",
              fontSize: "lg",
              mb: 0.5,
              "&:hover": { color: "neutral.800" },
            }}
          >
            {toTitleCase(group.name)}
          </Link>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.tertiary" }}>
            <PlaceOutlinedIcon sx={{ fontSize: "1rem", color: "neutral.500" }} />
            <Typography
              level="body-xs"
              textColor="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {group.address}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <ConfirmationModal
        open={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={async () => {
          setIsConfirmModalOpen(false);
          await deleteGroup(group.id);
        }}
        isLoading={isDeletingGroup}
        title="Delete Group"
        message={`Are you sure you want to delete the group "${group.name}"? This action cannot be undone.`}
      />
    </Card>
  );
}

export default function GroupList() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const {
    data: groups,
    error: fetchError,
    isLoading,
    isFetching,
  } = useGetGroupsQuery({ page, search: searchParams.get("search") });

  if (isLoading) {
    return <Loading />;
  }
  if (!!fetchError) {
    return <Error error={fetchError} />;
  }
  return (
    <PaginatedGridList
      data={groups}
      renderItem={(item) => <GroupItem group={item} />}
      renderEmpty={() => <Empty>No groups found</Empty>}
      onSelectPage={setPage}
      isFetching={isFetching}
    />
  );
}
