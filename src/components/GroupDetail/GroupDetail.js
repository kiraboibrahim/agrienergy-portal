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
import { useGetGroupQuery } from "../../services/group";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";

export default function GroupDetail() {
  const { id: groupId } = useParams();
  const { data: group, error, isFetching } = useGetGroupQuery(groupId);
  if (!!error) {
    return <Error error={error} />;
  }
  if (isFetching) {
    return <Loading />;
  }

  if (!!group) {
    return (
      <>
        <Card
          orientation="horizontal"
          sx={{ marginBottom: 5, overflow: "hidden" }}
        >
          <CardContent orientation="horizontal">
            <Avatar size="lg" src={resolvePhotoSrc(group.profilePhoto)}>
              {toTitleCase(group.name)}
            </Avatar>
            <Box>
              <Typography level="h3">{toTitleCase(group.name)}</Typography>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={1}
                sx={{ marginTop: 1, overflow: "hidden" }}
              >
                <Typography
                  level="body-xs"
                  startDecorator={<LocationOnOutlinedIcon />}
                >
                  {group.address}
                </Typography>
                <Typography
                  level="body-xs"
                  startDecorator={<PhoneAndroidOutlinedIcon />}
                >
                  {group.phoneNumber}
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
            to={`/groups/${group.id}/profile`}
            sx={{ marginRight: 5 }}
            size="md"
          >
            Profile
          </Chip>
          <Chip
            component={RouterLink}
            to={`/groups/${group.id}/interests`}
            sx={{ marginRight: 5 }}
            size="md"
          >
            Interests
          </Chip>
          <Chip
            component={RouterLink}
            to={`/groups/${group.id}/offers`}
            sx={{ marginRight: 5 }}
            size="md"
          >
            Offers
          </Chip>
          <Chip
            component={RouterLink}
            to={`/groups/${group.id}/installations`}
            sx={{ marginRight: 5 }}
            size="md"
          >
            Installations
          </Chip>
          <Chip
            component={RouterLink}
            to={`/groups/${group.id}/recommendations`}
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
