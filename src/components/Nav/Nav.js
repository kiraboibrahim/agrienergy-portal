import { Box, Chip, Stack } from "@mui/joy";
import { NavLink as RouterLink, useSearchParams } from "react-router-dom";
import serializeParams from "../../utils/serializeParams";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import AgricultureOutlinedIcon from "@mui/icons-material/AgricultureOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

export default function Nav() {
  const [searchParams] = useSearchParams();
  const search = serializeParams({ search: searchParams.get("search") });

  const navItems = [
    { label: "Products", to: `/products${search}`, icon: <ShoppingBagOutlinedIcon sx={{ fontSize: "1.2rem" }} /> },
    { label: "Escos", to: `/escos${search}`, icon: <VerifiedOutlinedIcon sx={{ fontSize: "1.2rem" }} /> },
    { label: "Farmers", to: `/farmers${search}`, icon: <AgricultureOutlinedIcon sx={{ fontSize: "1.2rem" }} /> },
    { label: "Agro Processors", to: `/agro-processors${search}`, icon: <StorefrontOutlinedIcon sx={{ fontSize: "1.2rem" }} /> },
    { label: "Groups", to: `/groups${search}`, icon: <GroupsOutlinedIcon sx={{ fontSize: "1.2rem" }} /> },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        width: "100%",
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
        {navItems.map((item) => (
          <Chip
            key={item.to}
            size="lg"
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
              fontSize: "0.9rem",
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
  );
}
