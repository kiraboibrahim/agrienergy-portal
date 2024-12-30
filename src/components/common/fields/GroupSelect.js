import { useLazyGetGroupsQuery } from "../../../services/group";
import EntitySelect from "./EntitySelect";

export default function GroupSelect({ name, label, sx = [], ...props }) {
  const [fetchGroups] = useLazyGetGroupsQuery();
  return (
    <EntitySelect
      name={name}
      label={label}
      fetch={fetchGroups}
      sx={sx}
      {...props}
    />
  );
}
