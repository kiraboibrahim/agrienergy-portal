import {
  AspectRatio,
  Avatar,
  Box,
  Card,
  CardContent,
  Dropdown,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  Typography,
} from "@mui/joy";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useGetFarmersQuery } from "../../services/farmer";
import { useState } from "react";
import Loading from "../common/utils/Loading";
import resolvePhotoSrc from "../../utils/resolve-photo-src";
import Empty from "../common/utils/Empty";
import Error from "../common/utils/Error";
import PaginatedGridList from "../common/layouts/PaginatedGridList";
import toTitleCase from "../../utils/toTitleCase";
import useDeleteFarmer from "../../hooks/useDeleteFarmer";
import getFarmerFullName from "../../utils/getFarmerFullName";

function FarmerItem({ farmer }) {
  const [deleteFarmer, isDeletingFarmer] = useDeleteFarmer();
  return (
    <Card
      size="sm"
      variant="soft"
      sx={{ borderRadius: "lg" }}
      color={isDeletingFarmer ? "danger" : "neutral"}
    >
      <CardContent orientation="horizontal">
        <Box>
          <Avatar
            src={resolvePhotoSrc(farmer.profilePhoto)}
            sx={{ marginRight: 0.5 }}
          >
            {getFarmerFullName(farmer)}
          </Avatar>
        </Box>
        <Link
          component={RouterLink}
          to={`/farmers/${farmer.id}`}
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
          {toTitleCase(getFarmerFullName(farmer))}
          <Typography
            level="body-xs"
            sx={{
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {toTitleCase(farmer.address)}
          </Typography>
        </Link>

        <Dropdown>
          <MenuButton slots={{ root: IconButton }}>
            <MoreVertIcon />
          </MenuButton>
          <Menu>
            <MenuItem onClick={async () => await deleteFarmer(farmer.id)}>
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
          src={resolvePhotoSrc(farmer.coverPhoto)}
          alt={farmer.name}
          loading="lazy"
        />
      </AspectRatio>
    </Card>
  );
}

export default function FarmerList() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const {
    data: farmers,
    error: fetchError,
    isFetching,
  } = useGetFarmersQuery({ page, search: searchParams.get("search") });

  if (isFetching) {
    return <Loading />;
  }
  if (!!fetchError) {
    return <Error error={fetchError} />;
  }
  return (
    <PaginatedGridList
      data={farmers}
      renderItem={(item) => <FarmerItem farmer={item} />}
      renderEmpty={() => <Empty>No farmers found</Empty>}
      onSelectPage={setPage}
    />
  );
}
