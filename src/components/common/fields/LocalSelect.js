import {
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  Option,
  Typography,
} from "@mui/joy";
import { useField, ErrorMessage } from "formik";

export default function LocalSelect({
  name,
  label,
  sx = [],
  options,
  defaultValue = null,
  multiple,
  ...props
}) {
  const [
    field,
    { value: selectedOptions, touched, error },
    { setValue, setTouched },
  ] = useField({ name, ...props });

  const hasError = touched && !!error;

  function selectOption(option) {
    if (!touched) setTouched(true);
    console.log("Selected Option: ", option);
    return !!multiple
      ? setValue([...selectedOptions, option])
      : setValue(option);
  }
  return (
    <FormControl sx={Array.isArray(sx) ? sx : [sx]} error={hasError}>
      <FormLabel htmlFor={label || props.id}>
        {label}
        {!!props.required && (
          <Typography level="body-sm" color="danger">
            *
          </Typography>
        )}
      </FormLabel>
      <Select
        {...field}
        name={name}
        multiple={!!multiple}
        defaultValue={defaultValue}
        onChange={(event, option) => selectOption(option)}
        {...props}
      >
        {options.map((option, index) => (
          <Option value={option} key={index}>
            {option}
          </Option>
        ))}
      </Select>
      <FormHelperText sx={{ fontSize: "sm" }}>
        <ErrorMessage name={name} />
      </FormHelperText>
    </FormControl>
  );
}
