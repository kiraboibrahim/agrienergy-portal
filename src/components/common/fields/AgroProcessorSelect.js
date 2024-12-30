import { useLazyGetAgroProcessorsQuery } from "../../../services/agroProcessor";
import EntitySelect from "./EntitySelect";

export default function AgroProcessorSelect({
  name,
  label,
  sx = [],
  ...props
}) {
  const [fetchAgroProcessors] = useLazyGetAgroProcessorsQuery();
  return (
    <EntitySelect
      name={name}
      label={label}
      sx={Array.isArray(sx) ? sx : [sx]}
      fetch={fetchAgroProcessors}
      {...props}
    />
  );
}
