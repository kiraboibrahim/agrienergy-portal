import {
  FormControl,
  FormLabel,
  Box,
  FormHelperText,
  Typography,
} from "@mui/joy";
import AsyncSelect from "react-select/async";
import { useField } from "formik";
import { useTheme } from "@mui/joy/styles";

export default function RemoteSelect({
  name,
  label,
  defaultOptions = true,
  getOptions,
  getOptionLabel,
  getOptionValue,
  isMulti,
  placeholder,
  sx,
  ...props
}) {
  const theme = useTheme();
  const [
    ,
    { value: selectedOptions, touched, error },
    { setValue, setTouched },
  ] = useField({ name, ...props });

  const { required } = props;
  const hasError = touched && !!error;
  return (
    <FormControl sx={Array.isArray(sx) ? sx : [sx]} error={hasError}>
      <FormLabel>
        {label}
        {!!required && (
          <Typography color="danger" level="body-sm">
            *
          </Typography>
        )}
      </FormLabel>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        <AsyncSelect
          isMulti={isMulti}
          loadOptions={getOptions}
          defaultOptions={defaultOptions}
          value={selectedOptions}
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          isClearable={false}
          onChange={(value) => {
            setTouched(true);
            setValue(value);
          }}
          placeholder={placeholder}
          /* Hide the multi value container in order to use the select just like a search field */
          styles={{
            container: (baseCss) => ({
              ...baseCss,
              display: "inline-block",
              flexGrow: 1,
            }),
            control: (baseCss) => ({
              ...baseCss,
              border: error
                ? `1px solid ${theme.palette.danger.outlinedBorder}`
                : baseCss?.border,
            }),
          }}
        />
      </Box>
      {hasError && (
        <FormHelperText sx={{ fontSize: "sm" }}>{error}</FormHelperText>
      )}
    </FormControl>
  );
}
