import { useLazyGetFarmersQuery } from "../../../services/farmer";
import getFarmerFullName from "../../../utils/getFarmerFullName";
import EntitySelect from "./EntitySelect";

export default function FarmerSelect({ name, label, sx = [], ...props }) {
  const [fetchFarmers] = useLazyGetFarmersQuery();

  return (
    <EntitySelect
      name={name}
      fetch={fetchFarmers}
      label={label}
      sx={sx}
      getItemLabel={(farmer) => getFarmerFullName(farmer)}
      {...props}
    />
  );
}
