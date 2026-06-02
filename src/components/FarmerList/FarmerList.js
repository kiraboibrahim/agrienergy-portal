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
import ConfirmationModal from "../common/utils/ConfirmationModal";

function FarmerItem({ farmer }) {
  const [deleteFarmer, isDeletingFarmer] = useDeleteFarmer();
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
          borderColor: "success.300",
        },
        bgcolor: "background.surface",
      }}
      color={isDeletingFarmer ? "danger" : "neutral"}
    >
      <Box sx={{ position: "relative", width: "100%" }}>
        <AspectRatio ratio="16/9">
          <img
            src={resolvePhotoSrc(farmer.coverPhoto)}
            alt={getFarmerFullName(farmer)}
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
                  Delete Profile
                </Typography>
              </MenuItem>
            </Menu>
          </Dropdown>
        </Box>
      </Box>

      <CardContent sx={{ pt: 0, px: 2, pb: 2, position: "relative" }}>
        {/* Floating Avatar */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 1 }}>
          <Avatar
            src={resolvePhotoSrc(farmer.profilePhoto)}
            sx={{
              width: 64,
              height: 64,
              border: "3px solid var(--joy-palette-background-surface)",
              boxShadow: "md",
              marginTop: "-32px",
              zIndex: 5,
              bgcolor: "success.softBg",
            }}
          >
            {getFarmerFullName(farmer)[0]}
          </Avatar>
          
          <Chip
            color="success"
            variant="soft"
            size="sm"
            sx={{ fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px" }}
          >
            Farmer
          </Chip>
        </Box>

        {/* Text content details */}
        <Box sx={{ mt: 1 }}>
          <Link
            component={RouterLink}
            to={`/farmers/${farmer.id}`}
            overlay
            underline="none"
            textColor="text.primary"
            sx={{
              display: "block",
              fontWeight: "bold",
              fontSize: "lg",
              mb: 0.5,
              "&:hover": { color: "success.600" },
            }}
          >
            {toTitleCase(getFarmerFullName(farmer))}
          </Link>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.tertiary" }}>
            <PlaceOutlinedIcon sx={{ fontSize: "1rem", color: "success.500" }} />
            <Typography
              level="body-xs"
              textColor="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {toTitleCase(farmer.address)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <ConfirmationModal
        open={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={async () => {
          setIsConfirmModalOpen(false);
          await deleteFarmer(farmer.id);
        }}
        isLoading={isDeletingFarmer}
        title="Delete Farmer Profile"
        message={`Are you sure you want to delete the profile of ${getFarmerFullName(farmer)}? This action cannot be undone.`}
      />
    </Card>
  );
}

export default function FarmerList() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const {
    data: farmers,
    error: fetchError,
    isLoading,
    isFetching,
  } = useGetFarmersQuery({ page, search: searchParams.get("search") });

  if (isLoading) {
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
      isFetching={isFetching}
    />
  );
}
