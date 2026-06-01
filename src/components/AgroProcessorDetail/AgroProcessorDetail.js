import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/joy";
import { NavLink as RouterLink, Outlet, useParams } from "react-router-dom";
import Loading from "../common/utils/Loading";
import Error from "../common/utils/Error";
import resolvePhotoSrc from "../../utils/resolve-photo-src";
import toTitleCase from "../../utils/toTitleCase";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import AgricultureOutlinedIcon from "@mui/icons-material/AgricultureOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import { useGetAgroProcessorQuery } from "../../services/agroProcessor";

export default function AgroProcessorDetail() {
  const { id: agroProcessorId } = useParams();
  const {
    data: agroProcessor,
    error,
    isLoading,
  } = useGetAgroProcessorQuery(agroProcessorId);

  if (!!error) {
    return <Error error={error} />;
  }
  if (isLoading) {
    return <Loading />;
  }

  if (!!agroProcessor) {
    const subnavItems = [
      { label: "Profile", to: `/agro-processors/${agroProcessor.id}/profile`, icon: <AccountCircleOutlinedIcon sx={{ fontSize: "1.1rem" }} /> },
      { label: "Interests", to: `/agro-processors/${agroProcessor.id}/interests`, icon: <StarBorderOutlinedIcon sx={{ fontSize: "1.1rem" }} /> },
      { label: "Offers", to: `/agro-processors/${agroProcessor.id}/offers`, icon: <LocalOfferOutlinedIcon sx={{ fontSize: "1.1rem" }} /> },
      { label: "Installations", to: `/agro-processors/${agroProcessor.id}/installations`, icon: <AgricultureOutlinedIcon sx={{ fontSize: "1.1rem" }} /> },
      { label: "Recommendations", to: `/agro-processors/${agroProcessor.id}/recommendations`, icon: <LightbulbOutlinedIcon sx={{ fontSize: "1.1rem" }} /> },
    ];

    return (
      <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, sm: 3 } }}>
        {/* Header Cover Banner */}
        <Card
          variant="outlined"
          sx={{
            mb: 4,
            overflow: "hidden",
            borderRadius: "xl",
            boxShadow: "sm",
            border: "1px solid rgba(0,0,0,0.08)",
            p: 0,
          }}
        >
          {/* Banner Area (Agro theme uses bright warm amber gradient) */}
          <Box
            sx={{
              height: { xs: 120, sm: 160 },
              background: "linear-gradient(135deg, #e65100 0%, #ff8f00 100%)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {agroProcessor.coverPhoto && (
              <img
                src={resolvePhotoSrc(agroProcessor.coverPhoto)}
                alt={agroProcessor.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
            )}
          </Box>

          {/* Profile Details Container */}
          <CardContent
            sx={{
              px: { xs: 2, sm: 4 },
              pb: 3,
              pt: 0,
              position: "relative",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "center", sm: "flex-end" },
              gap: 3,
              mt: -6,
            }}
          >
            {/* Overlapping Avatar */}
            <Avatar
              size="lg"
              src={resolvePhotoSrc(agroProcessor.profilePhoto)}
              sx={{
                width: 110,
                height: 110,
                border: "4px solid white",
                boxShadow: "md",
                bgcolor: "background.surface",
              }}
            >
              {agroProcessor.name[0]}
            </Avatar>

            {/* Title / Identity Metadata */}
            <Box sx={{ textAlign: { xs: "center", sm: "left" }, flex: 1, mb: 0.5, pt: { xs: 1, sm: 4 } }}>
              <Typography level="h2" sx={{ fontWeight: "800", fontSize: "1.75rem", letterSpacing: "-0.5px", mb: 0.75 }}>
                {toTitleCase(agroProcessor.name)}
              </Typography>

              {/* Equipment Chips */}
              <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: { xs: "center", sm: "flex-start" }, gap: 0.75, mb: 1.5 }}>
                {agroProcessor?.equipment.split(",").map((item, index) => (
                  <Chip
                    key={index}
                    size="sm"
                    color="warning"
                    variant="soft"
                    sx={{ fontWeight: "bold" }}
                  >
                    {item.trim()}
                  </Chip>
                ))}
              </Box>

              {/* Spaced metadata decorators */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{
                  justifyContent: { xs: "center", sm: "flex-start" },
                  alignItems: "center",
                  color: "text.secondary",
                }}
              >
                <Typography
                  level="body-sm"
                  startDecorator={<LocationOnOutlinedIcon sx={{ color: "warning.500" }} />}
                  sx={{ fontWeight: "500" }}
                >
                  {agroProcessor.address}
                </Typography>
                <Typography
                  level="body-sm"
                  startDecorator={<PhoneAndroidOutlinedIcon sx={{ color: "warning.500" }} />}
                  sx={{ fontWeight: "500" }}
                >
                  {agroProcessor.phoneNumber}
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* Glassmorphic Segmented Tabs Menu */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            width: "100%",
            mb: 4,
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              py: 0.75,
              px: 1,
              borderRadius: "xl",
              bgcolor: "rgba(255, 255, 255, 0.4)",
              backdropFilter: "blur(20px)",
              boxShadow: "sm",
              border: "1px solid rgba(255, 255, 255, 0.6)",
              overflowX: "auto",
              maxWidth: "100%",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {subnavItems.map((item) => (
              <Chip
                key={item.to}
                size="md"
                variant="plain"
                color="neutral"
                component={RouterLink}
                to={item.to}
                startDecorator={item.icon}
                sx={{
                  px: 2,
                  py: 0.75,
                  borderRadius: "xl",
                  fontWeight: "600",
                  fontSize: "0.85rem",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.04)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                {item.label}
              </Chip>
            ))}
          </Stack>
        </Box>

        {/* Content Outlet */}
        <Box sx={{ mt: 2 }}>
          <Outlet />
        </Box>
      </Box>
    );
  }
}
