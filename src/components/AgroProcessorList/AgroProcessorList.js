import {
  AspectRatio,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
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
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { useState } from "react";
import Loading from "../common/utils/Loading";
import resolvePhotoSrc from "../../utils/resolve-photo-src";
import Empty from "../common/utils/Empty";
import Error from "../common/utils/Error";
import PaginatedGridList from "../common/layouts/PaginatedGridList";
import toTitleCase from "../../utils/toTitleCase";
import { useGetAgroProcessorsQuery } from "../../services/agroProcessor";
import useDeleteAgroProcessor from "../../hooks/useDeleteAgroProcessor";
import ConfirmationModal from "../common/utils/ConfirmationModal";

function AgroProcessorItem({ agroProcessor }) {
  const [deleteAgroProcessor, isDeletingAgroProcessor] =
    useDeleteAgroProcessor();
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
          borderColor: "warning.300",
        },
        bgcolor: "background.surface",
      }}
      color={isDeletingAgroProcessor ? "danger" : "neutral"}
    >
      <Box sx={{ position: "relative", width: "100%" }}>
        <AspectRatio ratio="16/9">
          <img
            src={resolvePhotoSrc(agroProcessor.coverPhoto)}
            alt={agroProcessor.name}
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
                  Delete Processor
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
            src={resolvePhotoSrc(agroProcessor.profilePhoto)}
            sx={{
              width: 64,
              height: 64,
              border: "3px solid var(--joy-palette-background-surface)",
              boxShadow: "md",
              marginTop: "-32px",
              zIndex: 5,
              bgcolor: "warning.softBg",
            }}
          >
            {agroProcessor.name[0]}
          </Avatar>
          
          <Chip
            color="warning"
            variant="soft"
            size="sm"
            startDecorator={<StorefrontOutlinedIcon sx={{ fontSize: "1rem" }} />}
            sx={{ fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px" }}
          >
            Processor
          </Chip>
        </Box>

        {/* Text content details */}
        <Box sx={{ mt: 1 }}>
          <Link
            component={RouterLink}
            to={`/agro-processors/${agroProcessor.id}`}
            overlay
            underline="none"
            textColor="text.primary"
            sx={{
              display: "block",
              fontWeight: "bold",
              fontSize: "lg",
              mb: 0.5,
              "&:hover": { color: "warning.600" },
            }}
          >
            {toTitleCase(agroProcessor.name)}
          </Link>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.tertiary" }}>
            <PlaceOutlinedIcon sx={{ fontSize: "1rem", color: "warning.500" }} />
            <Typography
              level="body-xs"
              textColor="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {toTitleCase(agroProcessor.address)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <ConfirmationModal
        open={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={async () => {
          setIsConfirmModalOpen(false);
          await deleteAgroProcessor(agroProcessor.id);
        }}
        isLoading={isDeletingAgroProcessor}
        title="Delete Agro Processor"
        message={`Are you sure you want to delete "${agroProcessor.name}"? This action cannot be undone.`}
      />
    </Card>
  );
}

export default function AgroProcessorList() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const {
    data: agroProcessors,
    error: fetchError,
    isLoading,
    isFetching,
  } = useGetAgroProcessorsQuery({ page, search: searchParams.get("search") });

  if (isLoading) {
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
      isFetching={isFetching}
    />
  );
}
