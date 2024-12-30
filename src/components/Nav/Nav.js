import { Chip, Stack } from "@mui/joy";
import { NavLink as RouterLink, useSearchParams } from "react-router-dom";
import serializeParams from "../../utils/serializeParams";

export default function Nav() {
  const [searchParams] = useSearchParams();
  const search = serializeParams({ search: searchParams.get("search") });
  return (
    <Stack
      direction="row"
      sx={{
        paddingLeft: 1,
        paddingRight: 1,
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
        sx={{ marginRight: 5 }}
        size="lg"
        component={RouterLink}
        to={`/products${search}`}
      >
        Products
      </Chip>
      <Chip
        sx={{ marginRight: 5 }}
        size="lg"
        component={RouterLink}
        to={`/escos${search}`}
      >
        Escos
      </Chip>
      <Chip
        sx={{ marginRight: 5 }}
        size="lg"
        component={RouterLink}
        to={`/farmers${search}`}
      >
        Farmers
      </Chip>
      <Chip
        sx={{ marginRight: 5 }}
        size="lg"
        component={RouterLink}
        to={`/agro-processors${search}`}
      >
        Agro Processors
      </Chip>
      <Chip size="lg" component={RouterLink} to={`/groups${search}`}>
        Groups
      </Chip>
    </Stack>
  );
}
