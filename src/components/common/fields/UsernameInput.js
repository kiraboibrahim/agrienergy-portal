import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Typography,
} from "@mui/joy";
import { ErrorMessage, useField } from "formik";
import { useLazyGetFarmersQuery } from "../../../services/farmer";
import { useLazyGetEscosQuery } from "../../../services/esco";
import { useLazyGetGroupsQuery } from "../../../services/group";
import { useLazyGetAgroProcessorsQuery } from "../../../services/agroProcessor";
import parseError from "../utils/parse-error";
import { useCallback, useEffect, useState } from "react";
import Loading from "../utils/Loading";
import validateUsername from "../../../utils/isValidUsername";
import useDebouncedInput from "../../../hooks/useDebouncedInput";

export default function UsernameInput({
  name,
  label,
  sx = [],
  message = "Username isn't available",
  validate = validateUsername,
  ...props
}) {
  const { required } = props;
  const [field, { error, touched, value: username }, { setError }] = useField({
    name,

    ...props,
  });
  const isInvalidUsername = !!error && touched;
  const [debouncedUsername, , setDebouncedUsername] = useDebouncedInput({
    defaultValue: "",
  });
  const [isFetching, setIsFetching] = useState(false);
  const [fetchFarmers] = useLazyGetFarmersQuery();
  const [fetchGroups] = useLazyGetGroupsQuery();
  const [fetchEscos] = useLazyGetEscosQuery();
  const [fetchAgroProcessors] = useLazyGetAgroProcessorsQuery();

  const checkUsernameAvailability = useCallback(
    async (username) => {
      const params = { search: username };
      const promises = [
        fetchFarmers(params).unwrap(),
        fetchGroups(params).unwrap(),
        fetchEscos(params).unwrap(),
        fetchAgroProcessors(params).unwrap(),
      ];
      const result = await Promise.all(promises);
      const isUsernameAvailable = result.every(({ data: results }) =>
        results.every(({ phoneNumber }) => phoneNumber !== username)
      );
      return isUsernameAvailable;
    },
    [fetchFarmers, fetchGroups, fetchAgroProcessors, fetchEscos]
  );

  useEffect(() => {
    async function validateUsernameAvailability() {
      setIsFetching(true);
      try {
        const isUsernameAvailable = await checkUsernameAvailability(
          debouncedUsername
        );
        !isUsernameAvailable ? setError(message) : setError(null);
      } catch (err) {
        console.log("Setting error");
        setError(parseError(err));
      } finally {
        setIsFetching(false);
      }
    }
    if (validateUsername(debouncedUsername)) {
      validateUsernameAvailability();
    }
  }, [debouncedUsername, checkUsernameAvailability, setError, message]);

  function handleChange(event) {
    const { onChange } = field;
    Promise.resolve(onChange(event));
    setDebouncedUsername(event.target.value);
  }
  return (
    <FormControl error={isInvalidUsername}>
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
        value={username}
        onChange={handleChange}
        endDecorator={isFetching ? <Loading size="sm" /> : <></>}
      />
      <FormHelperText sx={{ fontSize: "sm" }}>
        <ErrorMessage name={name} />
      </FormHelperText>
    </FormControl>
  );
}
