import {
  AspectRatio,
  Avatar,
  Card,
  CardContent,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/joy";
import { Link as RouterLink, useParams } from "react-router-dom";
import AgricultureOutlinedIcon from "@mui/icons-material/AgricultureOutlined";
import { useState } from "react";
import Loading from "../common/utils/Loading";
import { useGetFarmerInstallationsQuery } from "../../services/farmer";
import { useGetEscoInstallationsQuery } from "../../services/esco";
import StarRating from "../common/utils/StarRating";
import Error from "../common/utils/Error";
import resolvePhotoSrc from "../../utils/resolve-photo-src";
import Empty from "../common/utils/Empty";
import PaginatedGridList from "../common/layouts/PaginatedGridList";
import getFarmerFullName from "../../utils/getFarmerFullName";
import { useGetGroupInstallationsQuery } from "../../services/group";
import { useGetAgroProcessorInstallationsQuery } from "../../services/agroProcessor";

function InstallationItem({ installation }) {
  return (
    <Card size="sm" variant="soft" sx={{ borderRadius: "lg" }}>
      <CardContent orientation="horizontal">
        <Avatar
          src={resolvePhotoSrc(installation.esco.profilePhoto)}
          sx={{ marginRight: 1 }}
        >
          {installation.esco.name}
        </Avatar>
        <Typography
          level="body-sm"
          sx={{
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontWeight: "bold",
            width: 1,
            alignSelf: "center",
          }}
        >
          {installation.esco.name}
        </Typography>
      </CardContent>
      <AspectRatio>
        <img
          src={resolvePhotoSrc(installation.product.coverPhoto)}
          alt={installation.name}
        />
      </AspectRatio>
      <StarRating value={3} />

      <Stack direction="row">
        <IconButton>
          <AgricultureOutlinedIcon />
        </IconButton>
        <Typography level="body-sm" sx={{ alignSelf: "center" }}>
          {!!installation?.farmer
            ? getFarmerFullName(installation.farmer)
            : "N/A"}
        </Typography>
      </Stack>
      <Link
        sx={{
          display: "block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        component={RouterLink}
        to="#"
        overlay
        underline="none"
      >
        <Typography level="body-md">{installation.product.name}</Typography>
      </Link>
    </Card>
  );
}

export function FarmerInstallationList() {
  const { id: farmerId } = useParams();

  const [page, setPage] = useState(1);
  const {
    data: installations,
    error,
    isFetching,
  } = useGetFarmerInstallationsQuery({ farmerId, page });
  return (
    <InstallationList
      installations={installations}
      error={error}
      isFetching={isFetching}
      onSelectPage={setPage}
    />
  );
}

export function EscoInstallationList() {
  const { id: escoId } = useParams();
  const [page, setPage] = useState(1);
  const {
    data: installations,
    error,
    isFetching,
  } = useGetEscoInstallationsQuery({ escoId, page });
  return (
    <InstallationList
      installations={installations}
      error={error}
      isFetching={isFetching}
      onSelectPage={setPage}
    />
  );
}

export function AgroProcessorInstallationList() {
  const { id: agroProcessorId } = useParams();
  const [page, setPage] = useState(1);
  const {
    data: installations,
    error,
    isFetching,
  } = useGetAgroProcessorInstallationsQuery({ agroProcessorId, page });

  return (
    <InstallationList
      installations={installations}
      error={error}
      isFetching={isFetching}
      onSelectPage={setPage}
    />
  );
}

export function GroupInstallationList() {
  const { id: groupId } = useParams();
  const [page, setPage] = useState(1);
  const {
    data: installations,
    error,
    isFetching,
  } = useGetGroupInstallationsQuery({ groupId, page });

  return (
    <InstallationList
      installations={installations}
      error={error}
      isFetching={isFetching}
      onSelectPage={setPage}
    />
  );
}

function InstallationList({
  installations,
  error = null,
  isFetching = false,
  onSelectPage = (page) => page,
}) {
  if (isFetching) {
    return <Loading />;
  }
  if (!!error) {
    return <Error error={error} />;
  }
  return (
    <PaginatedGridList
      data={installations}
      renderItem={(item) => <InstallationItem installation={item} />}
      renderEmpty={() => <Empty>No installations found</Empty>}
      onSelectPage={onSelectPage}
    />
  );
}
