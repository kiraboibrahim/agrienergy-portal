import {
  Box,
  Stack,
  Avatar,
  Dropdown,
  MenuButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
} from "@mui/joy";
import logo from "../../assets/logo.jpg";
import { useAuth } from "../../hooks/useAuth";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/auth";
import SearchBar from "../SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userInitials = user ? `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}` : "AD";
  const userFullName = user ? `${user.firstName} ${user.lastName}` : "Administrator";

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        py: 1.5,
        px: { xs: 2, sm: 3 },
        borderRadius: "xl",
        bgcolor: "rgba(255, 255, 255, 0.45)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.65)",
        transition: "all 0.3s ease",
      }}
    >
      {/* Sleek Logo Wrapper */}
      <Box
        sx={{
          height: { xs: 35, sm: 45 },
          display: "flex",
          alignItems: "center",
          transition: "transform 0.25s",
          "&:hover": {
            transform: "scale(1.02)",
          },
        }}
      >
        <img
          src={logo}
          alt="IMEU logo"
          style={{
            height: "100%",
            width: "auto",
            objectFit: "contain",
          }}
        />
      </Box>

      {/* Modern Search Bar */}
      <SearchBar
        variant="outlined"
        containersx={{
          alignSelf: "center",
          display: "flex",
          flexGrow: 1,
          justifyContent: "center",
          maxWidth: { xs: 260, sm: 400, md: 500 },
          mx: { xs: 1, sm: 3 },
        }}
        sx={{
          borderRadius: "30px",
          width: "100%",
          bgcolor: "rgba(255, 255, 255, 0.75)",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "xs",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            border: "1px solid rgba(0, 0, 0, 0.15)",
            boxShadow: "sm",
          },
          "&.Mui-focused": {
            border: "1.5px solid #2e7d32",
            boxShadow: "0 0 0 3px rgba(46,125,50,0.15)",
            bgcolor: "#fff",
          },
        }}
      />

      {/* Styled User Profile Dropdown Menu */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Dropdown>
          <MenuButton
            slots={{ root: Avatar }}
            sx={{
              cursor: "pointer",
              width: 40,
              height: 40,
              border: "2px solid #2e7d32",
              boxShadow: "sm",
              fontSize: "0.85rem",
              fontWeight: "700",
              bgcolor: "success.500",
              color: "white",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "md",
              },
            }}
          >
            {userInitials}
          </MenuButton>
          <Menu
            variant="outlined"
            placement="bottom-end"
            sx={{
              borderRadius: "xl",
              minWidth: 220,
              p: 1,
              mt: 1.5,
              bgcolor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(15px)",
              boxShadow: "md",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            {/* Header info */}
            <Box sx={{ px: 1.5, py: 1 }}>
              <Typography level="title-sm" sx={{ fontWeight: "700", color: "text.primary" }}>
                {userFullName}
              </Typography>
              <Typography level="body-xs" sx={{ color: "text.secondary", mt: 0.25 }}>
                Admin
              </Typography>
            </Box>
            
            <Divider sx={{ my: 0.75 }} />

            <MenuItem
              onClick={() => navigate("/settings")}
              sx={{
                borderRadius: "lg",
                py: 1,
                fontSize: "0.85rem",
                fontWeight: "500",
                gap: 1.5,
                transition: "background-color 0.2s",
              }}
            >
              <SettingsOutlinedIcon sx={{ fontSize: "1.1rem", color: "text.secondary" }} />
              Settings
            </MenuItem>
            
            <MenuItem
              onClick={() => dispatch(logout())}
              sx={{
                borderRadius: "lg",
                py: 1,
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "danger.500",
                gap: 1.5,
                transition: "background-color 0.2s",
                "&:hover": {
                  bgcolor: "danger.500",
                  color: "white",
                },
              }}
            >
              <LogoutOutlinedIcon sx={{ fontSize: "1.1rem" }} />
              Log out
            </MenuItem>
          </Menu>
        </Dropdown>
      </Box>
    </Stack>
  );
}
