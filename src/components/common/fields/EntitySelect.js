import {
  Box,
  IconButton,
  Input,
  Stack,
  AspectRatio,
  Typography,
  MenuList,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  Chip,
  ChipDelete,
  FormHelperText,
} from "@mui/joy";
import useDebouncedInput from "../../../hooks/useDebouncedInput";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { styled } from "@mui/joy/styles";
import { ClickAwayListener, Popper } from "@mui/material";
import resolvePhotoSrc from "../../../utils/resolve-photo-src";
import Loading from "../utils/Loading";
import isEmpty from "../../../utils/isEmpty";
import Empty from "../utils/Empty";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import { useField } from "formik";
import Error from "../utils/Error";
import toTitleCase from "../../../utils/toTitleCase";
import isEqual from "lodash.isequal";

const Popup = styled(Popper)({
  zIndex: 1000,
});

const EntitySelectContext = createContext();

function Items({
  onSelect: onItemSelect,
  items = [],
  renderEmpty = () => <Empty>Nothing found</Empty>,
  getItemLabel = (item) => item.name,
}) {
  const { isLoading, error } = useContext(EntitySelectContext);
  const isLastItem = (index) => index === items.length - 1;
  return (
    <Box>
      <Stack direction="column">
        {isLoading && <Loading size="sm" />}
        {!!error && <Error error="Something went wrong" />}
        {!error &&
          items.map((item, index) => (
            <Item
              key={index}
              variant="soft"
              sx={{
                marginBottom: !isLastItem(index) ? 1 : 0,
                cursor: "pointer",
              }}
              item={item}
              onSelect={() => onItemSelect(item)}
              getItemLabel={getItemLabel}
            />
          ))}

        {!items.length && !isLoading && renderEmpty()}
      </Stack>
    </Box>
  );
}

function Item({ item, onSelect, getItemLabel = (item) => item.name, sx = [] }) {
  return (
    <Card variant="soft" sx={Array.isArray(sx) ? sx : [sx]} onClick={onSelect}>
      <CardContent orientation="horizontal">
        <AspectRatio sx={{ width: 70, flex: "0 0 auto" }}>
          <img
            src={resolvePhotoSrc(item.profilePhoto)}
            alt={`${getItemLabel(item)}`}
          />
        </AspectRatio>
        <Typography
          sx={{
            display: "inline-block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          level="body-sm"
        >
          {toTitleCase(getItemLabel(item))}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function EntitySelect({
  name,
  label,
  fetch,
  sx = [],
  renderEmpty = () => <Empty>Nothing found</Empty>,
  getItemLabel = (item) => item.name,
  ...props
}) {
  const isMounted = useRef(true);

  const [, { value: selectedItems, touched, error }, { setValue, setTouched }] =
    useField({
      name,
      ...props,
    });
  const hasError = touched && !!error;
  const inputRef = useRef(null);
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, unDebouncedQuery, setQuery] = useDebouncedInput({
    defaultValue: "",
  });
  const [fetchError, setFetchError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  function handleSearchClear() {
    setQuery("");
    handlePopupClose();
  }

  function handleChange({ target }) {
    setQuery(target.value);
    setIsOpen(target.value.trim() !== "");
  }
  function handleFocus({ target }) {
    setIsOpen(!isEmpty(target.value.trim()));
  }
  function handlePopupClose() {
    setIsOpen(false);
  }
  const getSelectedItems = useCallback(() => {
    return selectedItems || [];
  }, [selectedItems]);

  const isItemSelected = useCallback(
    (item) => {
      return getSelectedItems().find((selectedItem) =>
        isEqual(selectedItem, item)
      );
    },
    [getSelectedItems]
  );

  function selectItem(item) {
    const _isItemSelected = isItemSelected(item);
    if (_isItemSelected) return;
    if (!touched) setTouched(true);
    setValue([...getSelectedItems(), item]);
  }
  function unSelectItem(item) {
    if (!isItemSelected(item)) return;
    setValue(
      getSelectedItems().filter((selectedItem) => !isEqual(selectedItem, item))
    );
  }
  useEffect(() => {
    isMounted.current = true;
    const { unwrap, abort } = fetch({ search: debouncedQuery });
    setFetchError(null);
    setIsFetching(true);
    unwrap()
      .then(({ data: items }) => {
        if (!isMounted.current) {
          abort();
          return;
        }
        setItems(items.filter((item) => !isItemSelected(item)));
      })
      .catch((err) => setFetchError(err))
      .finally(() => setIsFetching(false));
    return () => (isMounted.current = false);
  }, [debouncedQuery, fetch, isItemSelected]);

  return (
    <FormControl sx={Array.isArray(sx) ? sx : [sx]} error={hasError}>
      <ClickAwayListener onClickAway={handlePopupClose}>
        <Box>
          <FormLabel htmlFor={label || props.id}>
            {label}
            {!!label && !!props.required && (
              <Typography color="danger" level="body-sm">
                *
              </Typography>
            )}
          </FormLabel>
          <Input
            ref={inputRef}
            onChange={handleChange}
            onFocus={handleFocus}
            placeholder="Search"
            value={unDebouncedQuery}
            endDecorator={
              !isEmpty(unDebouncedQuery) && (
                <IconButton size="sm" onClick={handleSearchClear}>
                  <SearchOffOutlinedIcon />
                </IconButton>
              )
            }
            {...props}
          />

          <Popup
            open={isOpen}
            anchorEl={inputRef.current}
            disablePortal={true}
            modifiers={[
              {
                name: "offset",
                options: {
                  offset: [0, 4],
                },
              },
            ]}
          >
            <MenuList
              sx={{
                padding: 1,
                maxHeight: 350,
                overflowY: "auto",
                overflowX: "hidden",
                width: 290,
              }}
            >
              <EntitySelectContext.Provider
                value={{ isLoading: isFetching, error: fetchError }}
              >
                <Items
                  items={items}
                  onSelect={selectItem}
                  getItemLabel={getItemLabel}
                />
              </EntitySelectContext.Provider>
            </MenuList>
          </Popup>
        </Box>
      </ClickAwayListener>

      <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: 1 }}>
        {getSelectedItems().map((item, index) => {
          return (
            <Chip
              key={index}
              color="success"
              size="lg"
              sx={{ marginRight: 2, marginBottom: 1 }}
              endDecorator={<ChipDelete onClick={() => unSelectItem(item)} />}
            >
              {toTitleCase(getItemLabel(item))}
            </Chip>
          );
        })}
      </Box>
      {hasError && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
