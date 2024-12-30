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
import { useState } from "react";
import Loading from "../common/utils/Loading";
import resolvePhotoSrc from "../../utils/resolve-photo-src";
import Empty from "../common/utils/Empty";
import Error from "../common/utils/Error";
import PaginatedGridList from "../common/layouts/PaginatedGridList";
import toTitleCase from "../../utils/toTitleCase";
import getFarmerFullName from "../../utils/getFarmerFullName";
import { useGetAgroProcessorsQuery } from "../../services/agroProcessor";
import useDeleteAgroProcessor from "../../hooks/useDeleteAgroProcessor";

function AgroProcessorItem({ agroProcessor }) {
  const [deleteAgroProcessor, isDeletingAgroProcessor] =
    useDeleteAgroProcessor();
  return (
    <Card
      size="sm"
      variant="soft"
      sx={{ borderRadius: "lg" }}
      color={isDeletingAgroProcessor ? "danger" : "neutral"}
    >
      <CardContent orientation="horizontal">
        <Box>
          <Avatar
            src={resolvePhotoSrc(agroProcessor.profilePhoto)}
            sx={{ marginRight: 0.5 }}
          >
            {getFarmerFullName(agroProcessor)}
          </Avatar>
        </Box>
        <Link
          component={RouterLink}
          to={`/agro-processors/${agroProcessor.id}`}
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
          {toTitleCase(agroProcessor.name)}
          <Typography
            level="body-xs"
            sx={{
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {toTitleCase(agroProcessor.address)}
          </Typography>
        </Link>

        <Dropdown>
          <MenuButton slots={{ root: IconButton }}>
            <MoreVertIcon />
          </MenuButton>
          <Menu>
            <MenuItem
              onClick={async () => await deleteAgroProcessor(agroProcessor.id)}
            >
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
          src={resolvePhotoSrc(agroProcessor.coverPhoto)}
          alt={agroProcessor.name}
          loading="lazy"
        />
      </AspectRatio>
    </Card>
  );
}

export default function AgroProcessorList() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const {
    data: agroProcessors,
    error: fetchError,
    isFetching,
  } = useGetAgroProcessorsQuery({ page, search: searchParams.get("search") });

  if (isFetching) {
    return <Loading />;
  }
  if (!!fetchError) {
    return <Error error={fetchError} />;
  }
  return (
    <PaginatedGridList
      data={agroProcessors}
      renderItem={(item) => <AgroProcessorItem agroProcessor={item} />}
      renderEmpty={() => <Empty>No agro processors found</Empty>}
      onSelectPage={setPage}
    />
  );
}
