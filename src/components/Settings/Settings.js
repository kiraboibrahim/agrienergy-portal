import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/joy";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import { useAuth } from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/auth";

export default function Settings() {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const userFullName = user
    ? `${user.firstName} ${user.lastName}`
    : "Administrator";
  const userInitials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "AD";
  const userRole = user?.role
    ? user.role.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
    : "Admin";

  const details = [
    {
      label: "User ID",
      value: user?.sub,
      icon: <FingerprintOutlinedIcon sx={{ color: "text.secondary", fontSize: "1.2rem" }} />,
    },
    {
      label: "Full Name",
      value: userFullName,
      icon: <BadgeOutlinedIcon sx={{ color: "text.secondary", fontSize: "1.2rem" }} />,
    },
    {
      label: "Phone Number",
      value: user?.phoneNumber,
      icon: <PhoneAndroidOutlinedIcon sx={{ color: "text.secondary", fontSize: "1.2rem" }} />,
    },
    {
      label: "Role",
      value: userRole,
      icon: <AdminPanelSettingsOutlinedIcon sx={{ color: "text.secondary", fontSize: "1.2rem" }} />,
    },
    ...(user?.username ? [{
      label: "Username",
      value: user.username,
      icon: <PersonOutlinedIcon sx={{ color: "text.secondary", fontSize: "1.2rem" }} />,
    }] : []),
    ...(user?.email ? [{
      label: "Email",
      value: user.email,
      icon: <EmailOutlinedIcon sx={{ color: "text.secondary", fontSize: "1.2rem" }} />,
    }] : []),
  ];

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", px: { xs: 2, sm: 3 }, py: 2 }}>
      <Typography
        level="h3"
        sx={{ fontWeight: "800", letterSpacing: "-0.5px", mb: 3 }}
      >
        Settings
      </Typography>

      {/* Profile Card */}
      <Card
        variant="outlined"
        sx={{
          borderRadius: "xl",
          boxShadow: "sm",
          overflow: "hidden",
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2.5}
            alignItems={{ xs: "center", sm: "flex-start" }}
          >
            <Avatar
              sx={{
                width: 72,
                height: 72,
                bgcolor: "success.500",
                color: "white",
                fontSize: "1.5rem",
                fontWeight: "800",
                border: "3px solid white",
                boxShadow: "md",
              }}
            >
              {userInitials}
            </Avatar>

            <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
              <Typography
                level="h4"
                sx={{ fontWeight: "800", letterSpacing: "-0.3px", mb: 0.25 }}
              >
                {userFullName}
              </Typography>
              <Typography level="body-sm" textColor="text.secondary">
                {userRole}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card
        variant="outlined"
        sx={{
          borderRadius: "xl",
          boxShadow: "sm",
          overflow: "hidden",
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: 3, py: 2 }}>
            <Typography
              level="title-sm"
              sx={{ fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", color: "text.tertiary", fontSize: "0.72rem" }}
            >
              Account Information
            </Typography>
          </Box>

          {details.map((item, index) => (
            <Box key={index}>
              <Divider />
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ px: 3, py: 2 }}
              >
                {item.icon}
                <Box>
                  <Typography level="body-xs" textColor="text.tertiary">
                    {item.label}
                  </Typography>
                  <Typography level="body-sm" sx={{ fontWeight: "600" }}>
                    {item.value || "—"}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card
        variant="outlined"
        sx={{
          borderRadius: "xl",
          boxShadow: "sm",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Button
            variant="soft"
            color="danger"
            startDecorator={<LogoutOutlinedIcon />}
            onClick={() => dispatch(logout())}
            sx={{
              width: "100%",
              borderRadius: "lg",
              fontWeight: "700",
            }}
          >
            Log Out
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
