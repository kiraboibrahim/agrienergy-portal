import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Typography,
} from "@mui/joy";
import { useField } from "formik";

export default function TextInput({ name, label, sx = [], ...props }) {
  const { required } = props;
  const [field, { touched, error }] = useField({ name, ...props });
  const hasError = touched && !!error;
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
        sx={{ fontSize: "sm", color: "neutral", width: "100%" }}
      />
      {hasError && (
        <FormHelperText sx={{ fontSize: "sm" }}>{error}</FormHelperText>
      )}
    </FormControl>
  );
}
