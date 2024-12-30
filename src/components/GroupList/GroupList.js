import {
  Card,
  Box,
  CardContent,
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

function GroupItem({ group }) {
  const [deleteGroup, isDeletingGroup] = useDeleteGroup();
  return (
    <Card
      size="sm"
      variant="soft"
      sx={{ borderRadius: "lg" }}
      color={isDeletingGroup ? "danger" : "neutral"}
    >
      <CardContent orientation="horizontal">
        <Box>
          <Avatar
            src={resolvePhotoSrc(group.profilePhoto)}
            sx={{ marginRight: 0.5 }}
          >
            {group.name}
          </Avatar>
        </Box>
        <Link
          component={RouterLink}
          to={`/groups/${group.id}`}
          overlay
          underline="none"
          color="neutral"
          sx={{
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontWeight: "bold",
            alignSelf: "center",
            marginRight: "auto",
            maxWidth: 1,
          }}
          level="body-md"
        >
          {toTitleCase(group.name)}
          <Typography
            level="body-xs"
            sx={{
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {group.address}
          </Typography>
        </Link>
        <Dropdown>
          <MenuButton slots={{ root: IconButton }}>
            <MoreVertIcon />
          </MenuButton>
          <Menu>
            <MenuItem onClick={async () => await deleteGroup(group.id)}>
              <Typography
                level="body-sm"
                startDecorator={<DeleteOutlinedIcon />}
              >
                Delete
              </Typography>
            </MenuItem>
          </Menu>
        </Dropdown>
      </CardContent>
      <AspectRatio>
        <img
          src={resolvePhotoSrc(group.coverPhoto)}
          alt={group.name}
          loading="lazy"
        />
      </AspectRatio>
    </Card>
  );
}

export default function GroupList() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const {
    data: groups,
    error: fetchError,
    isFetching,
  } = useGetGroupsQuery({ page, search: searchParams.get("search") });

  if (isFetching) {
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
    />
  );
}
