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
import { useGetFarmerQuery } from "../../services/farmer";
import Loading from "../common/utils/Loading";
import Error from "../common/utils/Error";
import resolvePhotoSrc from "../../utils/resolve-photo-src";
import toTitleCase from "../../utils/toTitleCase";
import getFarmerFullName from "../../utils/getFarmerFullName";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";

export default function FarmerDetail() {
  const { id: farmerId } = useParams();
  const { data: farmer, error, isFetching } = useGetFarmerQuery(farmerId);
  if (!!error) {
    return <Error error={error} />;
  }
  if (isFetching) {
    return <Loading />;
  }

  if (!!farmer) {
    return (
      <>
        <Card
          orientation="horizontal"
          sx={{ marginBottom: 5, overflow: "hidden" }}
        >
          <CardContent orientation="horizontal">
            <Avatar size="lg" src={resolvePhotoSrc(farmer.profilePhoto)}>
              {farmer.lastName}
            </Avatar>
            <Box>
              <Typography level="h3">
                {toTitleCase(getFarmerFullName(farmer))}
              </Typography>

              <Box level="body-xs" sx={{ marginTop: 1 }}>
                {farmer?.cropsGrown.split(",").map((crop, index) => (
                  <Chip
                    size="sm"
                    key={index}
                    color="success"
                    sx={{ marginRight: 1, overflow: "scroll" }}
                  >
                    {crop}
                  </Chip>
                ))}
              </Box>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={1}
                sx={{ marginTop: 1, overflow: "hidden" }}
              >
                <Typography
                  level="body-xs"
                  startDecorator={<LocationOnOutlinedIcon />}
                >
                  {farmer.address}
                </Typography>
                <Typography
                  level="body-xs"
                  startDecorator={<PhoneAndroidOutlinedIcon />}
                >
                  {farmer.phoneNumber}
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        <Stack
          direction="row"
          sx={{
            overflow: "scroll",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "&": {
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            },
          }}
        >
          <Chip
            component={RouterLink}
            to={`/farmers/${farmer.id}/profile`}
            sx={{ marginRight: 5 }}
            size="md"
          >
            Profile
          </Chip>
          <Chip
            component={RouterLink}
            to={`/farmers/${farmer.id}/interests`}
            sx={{ marginRight: 5 }}
            size="md"
          >
            Interests
          </Chip>
          <Chip
            component={RouterLink}
            to={`/farmers/${farmer.id}/offers`}
            sx={{ marginRight: 5 }}
            size="md"
          >
            Offers
          </Chip>
          <Chip
            component={RouterLink}
            to={`/farmers/${farmer.id}/installations`}
            sx={{ marginRight: 5 }}
            size="md"
          >
            Installations
          </Chip>
          <Chip
            component={RouterLink}
            to={`/farmers/${farmer.id}/recommendations`}
            size="md"
          >
            Recommendations
          </Chip>
        </Stack>
        <Box sx={{ marginTop: 3, padding: { xs: 1, sm: 2 } }}>
          <Outlet />
        </Box>
      </>
    );
  }
}
