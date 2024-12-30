import { Sheet, Typography } from "@mui/joy";
import parseError from "./parse-error";

export default function Error({ error, sx = [] }) {
  return (
    <Sheet
      sx={[
        {
          width: 1,
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "md",
        },
        { ...(Array.isArray(sx) ? sx : [sx]) },
      ]}
      variant="soft"
      color="danger"
    >
      <Typography level="body-sm">{parseError(error)}</Typography>
    </Sheet>
  );
}
