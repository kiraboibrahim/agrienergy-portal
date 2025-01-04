import {
  Box,
  Chip,
  ChipDelete,
  FormControl,
  FormLabel,
  FormHelperText,
  Button,
  Input,
  Typography,
} from "@mui/joy";
import { useState, useCallback } from "react";
import { useField } from "formik";
import isEmptyString from "../../../utils/isEmtpyString";

export default function CSVChippedSelect({
  name,
  label,
  options = [],
  sx = [],
  isDynamic = false,
  ...props
}) {
  const [newOption, setNewOption] = useState("");
  const [
    ,
    { value: selectedOptions, error, touched },
    { setValue, setTouched },
  ] = useField({
    name,
    ...props,
  });
  const { required } = props;
  const hasError = touched && !!error;

  const getSelectedOptions = useCallback(() => {
    return selectedOptions || "";
  }, [selectedOptions]);

  function getOptions() {
    return Array.from(
      new Set([...options, ...fromCSVToArray(getSelectedOptions())])
    );
  }
  function fromCSVToArray(csv) {
    return csv
      .split(",")
      .map((v) => v.trim())
      .filter((v) => !!v.length);
  }

  function fromArrayToCSV(arr) {
    return arr
      .map((v) => v.trim())
      .filter((v) => !!v.length)
      .join(",");
  }

  function isOptionSelected(option) {
    return fromCSVToArray(getSelectedOptions())
      .map((selectedOption) => selectedOption.toLowerCase())
      .includes(option.toLowerCase());
  }

  const unSelectOption = (option) => {
    const value = fromArrayToCSV(
      fromCSVToArray(getSelectedOptions()).filter((v) => v !== option)
    );
    if (!required && isEmptyString(value)) return setValue(null);
    return setValue(value);
  };
  const selectOption = (option) => {
    if (isOptionSelected(option)) return;
    if (!touched) setTouched(true);
    const value = fromArrayToCSV([
      ...fromCSVToArray(getSelectedOptions()),
      option,
    ]);
    if (!required && isEmptyString(value)) return setValue(null);
    return setValue(value);
  };
  return (
    <FormControl sx={Array.isArray(sx) ? sx : [sx]} error={hasError}>
      <FormLabel>
        {label}
        {!!required && (
          <Typography level="body-sm" color="danger">
            *
          </Typography>
        )}
      </FormLabel>
      <Box>
        {isDynamic && (
          <Box sx={{ marginBottom: 1 }}>
            <Input
              size="sm"
              value={newOption}
              onChange={({ target }) => setNewOption(target.value)}
              endDecorator={
                <Button
                  variant="soft"
                  color="success"
                  onClick={() => {
                    !!newOption.trim().length && selectOption(newOption);
                    setNewOption("");
                  }}
                >
                  Add
                </Button>
              }
              placeholder="Type to add values"
            />
          </Box>
        )}
        <Box sx={{ diplay: "flex", flexWrap: "wrap" }}>
          {getOptions().map((option, index) => {
            const _isOptionSelected = isOptionSelected(option);
            return _isOptionSelected ? (
              <Chip
                key={index}
                color="success"
                size="sm"
                sx={{ marginRight: 2, marginBottom: 1 }}
                endDecorator={
                  <ChipDelete onClick={() => unSelectOption(option)} />
                }
              >
                {option}
              </Chip>
            ) : (
              <Chip
                key={index}
                color="secondary"
                size="sm"
                sx={{ marginRight: 2, marginBottom: 1 }}
                onClick={() => selectOption(option)}
              >
                {option}
              </Chip>
            );
          })}
        </Box>
      </Box>

      {hasError && (
        <FormHelperText sx={{ fontSize: "sm" }}>{error}</FormHelperText>
      )}
    </FormControl>
  );
}
