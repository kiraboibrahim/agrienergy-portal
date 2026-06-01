import {
  AspectRatio,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Typography,
  Link,
} from "@mui/joy";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import { Link as RouterLink } from "react-router-dom";
import { useGetFarmerOffersQuery } from "../../services/farmer";
import { useGetEscoOffersQuery } from "../../services/esco";
import { useParams } from "react-router";
import Loading from "../common/utils/Loading";
import Empty from "../common/utils/Empty";
import { useState } from "react";
import resolvePhotoSrc from "../../utils/resolve-photo-src";
import PaginatedGridList from "../common/layouts/PaginatedGridList";
import toTitleCase from "../../utils/toTitleCase";
import getFarmerFullName from "../../utils/getFarmerFullName";
import Error from "../common/utils/Error";
import { useGetGroupOffersQuery } from "../../services/group";
import { useGetAgroProcessorOffersQuery } from "../../services/agroProcessor";

function OfferItem({
  offer: {
    product,
    esco,
    farmer,
    group,
    agroProcessor,
    isAccepted,
    expiryDate,
  },
}) {
  const recipient = farmer || group || agroProcessor;
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
    return "";
  };
  const getUrl = () => {
    if (!!farmer) {
      return `/farmers/${farmer.id}`;
    }
    if (!!group) {
      return `/groups/${group.id}`;
    }
    if (!!agroProcessor) {
      return `/agro-processors/${agroProcessor.id}`;
    }
    return "";
  };

  const getOfferStatus = () => {
    const isPending = isAccepted === null;
    const isRejected = isAccepted;
    const isExpired =
      (isPending || isRejected) && Date.parse(expiryDate) < Date.now();
    return isExpired
      ? "Expired"
      : isPending
      ? "Pending"
      : isRejected
      ? "Rejected"
      : isAccepted
      ? "Accepted"
      : "Unknown";
  };

  const getStatusColor = () => {
    const status = getOfferStatus();
    if (status === "Accepted") return "success";
    if (status === "Pending") return "warning";
    if (status === "Rejected" || status === "Expired") return "danger";
    return "neutral";
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
          borderColor: "primary.200",
        },
        bgcolor: "background.surface",
        p: 0,
      }}
    >
      {/* Hero Image with overlays */}
      <Box sx={{ position: "relative", width: "100%" }}>
        <AspectRatio ratio="16/9">
          <img src={resolvePhotoSrc(product.coverPhoto)} alt={product.name} />
        </AspectRatio>

        {/* Floating Status Badge */}
        <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 10 }}>
          <Chip
            variant="solid"
            color={getStatusColor()}
            size="sm"
            sx={{ fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px" }}
          >
            {getOfferStatus()}
          </Chip>
        </Box>

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
          <Avatar size="sm" src={resolvePhotoSrc(esco.profilePhoto)} sx={{ width: 20, height: 20 }}>
            {esco.name[0]}
          </Avatar>
          <Typography
            level="body-xs"
            textColor="text.primary"
            sx={{ fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {toTitleCase(esco.name)}
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ p: 2 }}>
        {/* Product Name */}
        <Link
          component={RouterLink}
          to={`/products/${product.id}`}
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
            mb: 1.5,
            "&:hover": { color: "primary.600" },
          }}
        >
          {toTitleCase(product.name)}
        </Link>

        {/* Recipient Row */}
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
          <Avatar size="sm" src={resolvePhotoSrc(recipient?.profilePhoto)}>
            {getRecipientName()[0]}
          </Avatar>
          <Typography
            level="body-xs"
            textColor="text.secondary"
            fontWeight="bold"
            sx={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {toTitleCase(getRecipientName())}
          </Typography>
          <IconButton
            size="sm"
            variant="soft"
            color="neutral"
            component={RouterLink}
            to={getUrl()}
            sx={{ borderRadius: "50%", minWidth: 28, minHeight: 28 }}
          >
            <ChevronRightOutlinedIcon sx={{ fontSize: "1rem" }} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

export function FarmerOfferList() {
  const { id: farmerId } = useParams();
  const [page, setPage] = useState(1);
  const {
    data: offers,
    isLoading,
    isFetching,
    error,
  } = useGetFarmerOffersQuery({ farmerId, page });

  return (
    <OfferList
      error={error}
      isLoading={isLoading}
      isFetching={isFetching}
      offers={offers}
      onSelectPage={setPage}
    />
  );
}

export function GroupOfferList() {
  const { id: groupId } = useParams();
  const [page, setPage] = useState(1);
  const {
    data: offers,
    isLoading,
    isFetching,
    error,
  } = useGetGroupOffersQuery({ groupId, page });

  return (
    <OfferList
      error={error}
      isLoading={isLoading}
      isFetching={isFetching}
      offers={offers}
      onSelectPage={setPage}
    />
  );
}
export function AgroProcessorOfferList() {
  const { id: agroProcessorId } = useParams();
  const [page, setPage] = useState(1);
  const {
    data: offers,
    isLoading,
    isFetching,
    error,
  } = useGetAgroProcessorOffersQuery({ agroProcessorId, page });

  return (
    <OfferList
      error={error}
      isLoading={isLoading}
      isFetching={isFetching}
      offers={offers}
      onSelectPage={setPage}
    />
  );
}

export function EscoOfferList() {
  const { id: escoId } = useParams();
  const [page, setPage] = useState(1);
  const {
    data: offers,
    isLoading,
    isFetching,
    error,
  } = useGetEscoOffersQuery({ escoId, page });

  return (
    <OfferList
      offers={offers}
      error={error}
      isLoading={isLoading}
      isFetching={isFetching}
      onSelectPage={setPage}
    />
  );
}

function OfferList({
  offers,
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
      data={offers}
      renderItem={(item) => <OfferItem offer={item} />}
      renderEmpty={() => <Empty>No offers found</Empty>}
      onSelectPage={onSelectPage}
      isFetching={isFetching}
    />
  );
}
