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
import { useGetEscoQuery } from "../../services/esco";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import Loading from "../common/utils/Loading";
import Error from "../common/utils/Error";
import toTitleCase from "../../utils/toTitleCase";
import resolvePhotoSrc from "../../utils/resolve-photo-src";

export default function EscoDetail() {
  const { id: escoId } = useParams();
  const { data: esco, error, isLoading } = useGetEscoQuery(escoId);

  if (isLoading) {
    return <Loading />;
  }
  if (!!error) {
    return <Error error={error} />;
  }

  if (!!esco) {
    const subnavItems = [
      { label: "Profile", to: `/escos/${esco.id}/profile`, icon: <AccountCircleOutlinedIcon sx={{ fontSize: "1.1rem" }} /> },
      { label: "Products", to: `/escos/${esco.id}/products`, icon: <ShoppingBagOutlinedIcon sx={{ fontSize: "1.1rem" }} /> },
      { label: "Offers", to: `/escos/${esco.id}/offers`, icon: <LocalOfferOutlinedIcon sx={{ fontSize: "1.1rem" }} /> },
      { label: "Installations", to: `/escos/${esco.id}/installations`, icon: <HandymanOutlinedIcon sx={{ fontSize: "1.1rem" }} /> },
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
          {/* Banner Area (ESCO theme uses deep blue/teal gradient) */}
          <Box
            sx={{
              height: { xs: 120, sm: 160 },
              background: "linear-gradient(135deg, #0288d1 0%, #01579b 100%)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {esco.coverPhoto && (
              <img
                src={resolvePhotoSrc(esco.coverPhoto)}
                alt={esco.name}
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
              src={resolvePhotoSrc(esco.profilePhoto)}
              sx={{
                width: 110,
                height: 110,
                border: "4px solid white",
                boxShadow: "md",
                bgcolor: "background.surface",
              }}
            >
              {esco.name[0]}
            </Avatar>

            {/* Title / Identity Metadata */}
            <Box sx={{ textAlign: { xs: "center", sm: "left" }, flex: 1, mb: 0.5, pt: { xs: 1, sm: 4 } }}>
              <Typography level="h2" sx={{ fontWeight: "800", fontSize: "1.75rem", letterSpacing: "-0.5px", mb: 0.75 }}>
                {toTitleCase(esco.name)}
              </Typography>

              {/* Specialization Chips */}
              <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: { xs: "center", sm: "flex-start" }, gap: 0.75, mb: 1.5 }}>
                {esco.specialization.split(",").map((specialization, index) => (
                  <Chip
                    key={index}
                    size="sm"
                    color="primary"
                    variant="soft"
                    sx={{ fontWeight: "bold" }}
                  >
                    {specialization.trim()}
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
                  startDecorator={<LocationOnOutlinedIcon sx={{ color: "primary.500" }} />}
                  sx={{ fontWeight: "500" }}
                >
                  {esco.address}
                </Typography>
                <Typography
                  level="body-sm"
                  startDecorator={<PhoneAndroidOutlinedIcon sx={{ color: "primary.500" }} />}
                  sx={{ fontWeight: "500" }}
                >
                  {esco.phoneNumber}
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
