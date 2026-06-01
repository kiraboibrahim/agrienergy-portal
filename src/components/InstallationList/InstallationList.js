import {
  AspectRatio,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Link,
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
import toTitleCase from "../../utils/toTitleCase";

function InstallationItem({ installation }) {
  const { farmer, group, agroProcessor } = installation;
  const getRecipientName = () => {
    if (!!farmer) {
      return getFarmerFullName(farmer);
    }
    if (!!group) {
      return group.name;
    }
    if (!!agroProcessor) {
      return agroProcessor.name;
    }
    return "N/A";
  };
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
          borderColor: "success.200",
        },
        bgcolor: "background.surface",
        p: 0,
      }}
    >
      {/* Hero product image with ESCO overlay */}
      <Box sx={{ position: "relative", width: "100%" }}>
        <AspectRatio ratio="16/9">
          <img
            src={resolvePhotoSrc(installation.product.coverPhoto)}
            alt={installation.product.name}
          />
        </AspectRatio>

        {/* Glassmorphic ESCO Capsule */}
        <Box
          sx={{
            position: "absolute",
            bottom: 8,
            left: 8,
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(6px)",
            py: 0.5,
            px: 1.5,
            borderRadius: "full",
            boxShadow: "sm",
            zIndex: 5,
            maxWidth: "calc(100% - 16px)",
          }}
        >
          <Avatar
            size="sm"
            src={resolvePhotoSrc(installation.esco.profilePhoto)}
            sx={{ width: 20, height: 20 }}
          >
            {installation.esco.name[0]}
          </Avatar>
          <Typography
            level="body-xs"
            textColor="text.primary"
            sx={{ fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {installation.esco.name}
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ p: 2 }}>
        {/* Product title */}
        <Link
          component={RouterLink}
          to="#"
          overlay
          underline="none"
          textColor="text.primary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontWeight: "bold",
            fontSize: "md",
            lineHeight: "1.3",
            mb: 1,
            "&:hover": { color: "success.600" },
          }}
        >
          {installation.product.name}
        </Link>

        {/* Star Rating */}
        <Box sx={{ mb: 1 }}>
          <StarRating value={3} />
        </Box>

        {/* Recipient metadata bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1,
            borderRadius: "md",
            bgcolor: "background.level1",
          }}
        >
          <Chip
            size="sm"
            variant="soft"
            color="success"
            startDecorator={<AgricultureOutlinedIcon sx={{ fontSize: "0.9rem" }} />}
            sx={{ fontWeight: "bold" }}
          >
            {toTitleCase(getRecipientName())}
          </Chip>
        </Box>
      </CardContent>
    </Card>
  );
}

export function FarmerInstallationList() {
  const { id: farmerId } = useParams();

  const [page, setPage] = useState(1);
  const {
    data: installations,
    error,
    isLoading,
    isFetching,
  } = useGetFarmerInstallationsQuery({ farmerId, page });
  return (
    <InstallationList
      installations={installations}
      error={error}
      isLoading={isLoading}
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
    isLoading,
    isFetching,
  } = useGetEscoInstallationsQuery({ escoId, page });
  return (
    <InstallationList
      installations={installations}
      error={error}
      isLoading={isLoading}
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
    isLoading,
    isFetching,
  } = useGetAgroProcessorInstallationsQuery({ agroProcessorId, page });

  return (
    <InstallationList
      installations={installations}
      error={error}
      isLoading={isLoading}
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
    isLoading,
    isFetching,
  } = useGetGroupInstallationsQuery({ groupId, page });

  return (
    <InstallationList
      installations={installations}
      error={error}
      isLoading={isLoading}
      isFetching={isFetching}
      onSelectPage={setPage}
    />
  );
}

function InstallationList({
  installations,
  error = null,
  isLoading = false,
  isFetching = false,
  onSelectPage = (page) => page,
}) {
  if (isLoading) {
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
      isFetching={isFetching}
    />
  );
}
