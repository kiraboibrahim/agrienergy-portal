import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Typography,
} from "@mui/joy";
import { useField } from "formik";
import isEmptyString from "../../../utils/isEmtpyString";

export default function TextInput({ name, label, sx = [], ...props }) {
  const { required } = props;
  const [field, { touched, error }, { setValue }] = useField({
    name,
    ...props,
  });
  const hasError = touched && !!error;

  function handleChange(event) {
    if (!required && isEmptyString(event.target.value)) {
      /* Because the API doesn't treat empty strings as no-value/optional, it validates them. Hence setting them to null implies that they are optional and validation is skipped on the API
       */
      return setValue(null);
    }
    return setValue(event.target.value);
  }
  return (
    <FormControl
      error={hasError}
      sx={[{ width: "100%" }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      <FormLabel htmlFor={label || props.id}>
        {label}
        {!!required && (
          <Typography color="danger" level="body-sm">
            *
          </Typography>
        )}
      </FormLabel>
      <Input
        {...field}
        {...props}
        onChange={handleChange}
        sx={{ fontSize: "sm", color: "neutral", width: "100%" }}
      />
      {hasError && (
        <FormHelperText sx={{ fontSize: "sm" }}>{error}</FormHelperText>
      )}
    </FormControl>
  );
}
