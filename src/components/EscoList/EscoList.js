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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useGetEscosQuery } from "../../services/esco";
import { useState } from "react";
import Loading from "../common/utils/Loading";
import Error from "../common/utils/Error";
import resolvePhotoSrc from "../../utils/resolve-photo-src";
import Empty from "../common/utils/Empty";
import useDeleteEsco from "../../hooks/useDeleteEsco";
import toTitleCase from "../../utils/toTitleCase";
import PaginatedGridList from "../common/layouts/PaginatedGridList";

function EscoItem({ esco }) {
  const [deleteEsco, isDeletingEsco] = useDeleteEsco();
  return (
    <Card
      size="sm"
      variant="soft"
      sx={{ borderRadius: "lg" }}
      color={isDeletingEsco ? "danger" : "neutral"}
    >
      <CardContent orientation="horizontal">
        <Box>
          <Avatar
            src={resolvePhotoSrc(esco.profilePhoto)}
            sx={{ marginRight: 0.5 }}
          >
            {esco.name}
          </Avatar>
        </Box>
        <Link
          component={RouterLink}
          to={`/escos/${esco.id}`}
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
          {toTitleCase(esco.name)}
          <Typography
            level="body-xs"
            sx={{
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {esco.address}
          </Typography>
        </Link>
        <Dropdown>
          <MenuButton slots={{ root: IconButton }}>
            <MoreVertIcon />
          </MenuButton>
          <Menu>
            <MenuItem onClick={async () => await deleteEsco(esco.id)}>
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
          src={resolvePhotoSrc(esco.coverPhoto)}
          alt={esco.name}
          loading="lazy"
        />
      </AspectRatio>
    </Card>
  );
}

export default function EscoList() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const {
    data: escos,
    error: fetchError,
    isFetching,
  } = useGetEscosQuery({ page, search: searchParams.get("search") });

  if (isFetching) {
    return <Loading />;
  }

  if (fetchError) {
    return <Error error={fetchError} />;
  }

  return (
    <PaginatedGridList
      data={escos}
      renderItem={(item) => <EscoItem esco={item} />}
      renderEmpty={() => <Empty>No escos found</Empty>}
      onSelectPage={setPage}
    />
  );
}
