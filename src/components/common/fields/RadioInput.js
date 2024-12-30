import {
  FormControl,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/joy";
import { useField, ErrorMessage } from "formik";

export default function RadioInput({
  name,
  label,
  options,
  sx = [],
  ...props
}) {
  const [{ value }, { error, touched }, { setValue }] = useField({
    name,
    ...props,
  });
  const hasError = touched && !!error;

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
      <RadioGroup
        {...props}
        name={name}
        value={value}
        onChange={({ target }) => setValue(target.value)}
      >
        {Object.keys(options).map((key, index) => (
          <Radio
            value={key}
            label={options[key]}
            key={key}
            variant="soft"
            color="success"
            size="sm"
          />
        ))}
      </RadioGroup>
      <FormHelperText sx={{ fontSize: "sm" }}>
        <ErrorMessage name={name} />
      </FormHelperText>
    </FormControl>
  );
}
