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
import { useGetAgroProcessorQuery } from "../../services/agroProcessor";

export default function AgroProcessorDetail() {
  const { id: agroProcessorId } = useParams();
  const {
    data: agroProcessor,
    error,
    isFetching,
  } = useGetAgroProcessorQuery(agroProcessorId);
  if (!!error) {
    return <Error error={error} />;
  }
  if (isFetching) {
    return <Loading />;
  }

  if (!!agroProcessor) {
    return (
      <>
        <Card
          orientation="horizontal"
          sx={{ marginBottom: 5, overflow: "hidden" }}
        >
          <CardContent orientation="horizontal">
            <Avatar size="lg" src={resolvePhotoSrc(agroProcessor.profilePhoto)}>
              {agroProcessor.lastName}
            </Avatar>
            <Box>
              <Typography level="h3">
                {toTitleCase(agroProcessor.name)}
              </Typography>

              <Box level="body-xs" sx={{ marginTop: 1 }}>
                {agroProcessor?.equipment.split(",").map((equipment, index) => (
                  <Chip
                    size="sm"
                    key={index}
                    color="success"
                    sx={{ marginRight: 1, overflow: "scroll" }}
                  >
                    {equipment}
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
                  {agroProcessor.address}
                </Typography>
                <Typography
                  level="body-xs"
                  startDecorator={<PhoneAndroidOutlinedIcon />}
                >
                  {agroProcessor.phoneNumber}
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
            to={`/agro-processors/${agroProcessor.id}/profile`}
            sx={{ marginRight: 5 }}
            size="md"
          >
            Profile
          </Chip>
          <Chip
            component={RouterLink}
            to={`/agro-processors/${agroProcessor.id}/interests`}
            sx={{ marginRight: 5 }}
            size="md"
          >
            Interests
          </Chip>
          <Chip
            component={RouterLink}
            to={`/agro-processors/${agroProcessor.id}/offers`}
            sx={{ marginRight: 5 }}
            size="md"
          >
            Offers
          </Chip>
          <Chip
            component={RouterLink}
            to={`/agro-processors/${agroProcessor.id}/installations`}
            sx={{ marginRight: 5 }}
            size="md"
          >
            Installations
          </Chip>
          <Chip
            component={RouterLink}
            to={`/agro-processors/${agroProcessor.id}/recommendations`}
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
