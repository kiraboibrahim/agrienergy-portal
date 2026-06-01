import {
  Box,
  IconButton,
  Input,
  Stack,
  Typography,
  MenuList,
  MenuItem,
  Divider,
  Avatar,
} from "@mui/joy";
import useDebouncedInput from "../../hooks/useDebouncedInput";
import { useEffect, useReducer, useRef, useState } from "react";
import { styled } from "@mui/joy/styles";
import { ClickAwayListener, Popper } from "@mui/material";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { useLazyGetProductsQuery } from "../../services/product";
import { useLazyGetFarmersQuery } from "../../services/farmer";
import { useLazyGetEscosQuery } from "../../services/esco";
import resolvePhotoSrc from "../../utils/resolve-photo-src";
import Loading from "../common/utils/Loading";
import toTitleCase from "../../utils/toTitleCase";
import isEmpty from "../../utils/isEmpty";

const Popup = styled(Popper)({
  zIndex: 9999,
});

const PRODUCTS = "products";
const FARMERS = "farmers";
const ESCOS = "escos";
const SEARCH_BASE_URLS = {
  [PRODUCTS]: "/products",
  [FARMERS]: "/farmers",
  [ESCOS]: "/escos",
};

// Elegant search categories map helper
const CATEGORY_META = {
  [PRODUCTS]: { label: "Products", color: "success" },
  [FARMERS]: { label: "Farmers", color: "success" },
  [ESCOS]: { label: "Escos", color: "primary" },
};

function SearchResults({
  searchResults,
  loading,
  onSearchResultClick,
  searchQuery,
}) {
  const isAllEmpty = Object.values(searchResults).every(arr => arr.length === 0);

  if (isAllEmpty && !Object.values(loading).some(Boolean) && searchQuery.trim() !== "") {
    return (
      <Box sx={{ py: 4, px: 2, textAlign: "center" }}>
        <SearchOffOutlinedIcon sx={{ fontSize: "2rem", color: "neutral.400", mb: 1 }} />
        <Typography level="title-sm" sx={{ fontWeight: "700" }}>No matches found</Typography>
        <Typography level="body-xs" color="neutral" sx={{ mt: 0.5 }}>
          Try checking spelling or type another keyword
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {Object.entries(searchResults).map(([key, results], index) => {
        const meta = CATEGORY_META[key] || { label: toTitleCase(key), color: "neutral" };
        
        return (
          <Box key={index} sx={{ mb: 2, "&:last-child": { mb: 0 } }}>
            {/* Category header label */}
            <Typography
              level="body-xs"
              sx={{
                fontWeight: "800",
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "text.tertiary",
                px: 1.5,
                mb: 1,
              }}
            >
              {meta.label}
            </Typography>

            <Stack spacing={0.75}>
              {/* Premium Search in all button */}
              <MenuItem
                component={RouterLink}
                to={`${SEARCH_BASE_URLS[key]}?search=${searchQuery}`}
                onClick={onSearchResultClick}
                sx={{
                  borderRadius: "lg",
                  py: 1,
                  px: 1.5,
                  bgcolor: "rgba(46, 125, 50, 0.04)",
                  border: "1px dashed rgba(46, 125, 50, 0.2)",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  "&:hover": {
                    bgcolor: "rgba(46, 125, 50, 0.08)",
                    border: "1px dashed rgba(46, 125, 50, 0.4)",
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <SearchOutlinedIcon sx={{ fontSize: "1.1rem", color: "success.500" }} />
                  <Typography level="body-sm" sx={{ fontWeight: "600", color: "success.600" }}>
                    Search in all {toTitleCase(key)}
                  </Typography>
                </Stack>
                <ArrowForwardIosOutlinedIcon sx={{ fontSize: "0.75rem", color: "success.500" }} />
              </MenuItem>

              {loading[key] && (
                <Box sx={{ py: 1, display: "flex", justifyContent: "center" }}>
                  <Loading size="sm" />
                </Box>
              )}

              {/* Styled results rows */}
              {results.map((result, idx) => (
                <SearchResult
                  key={idx}
                  type={key}
                  onClick={onSearchResultClick}
                  {...result}
                />
              ))}
            </Stack>

            {index < Object.keys(searchResults).length - 1 && (
              <Divider sx={{ mt: 2, mb: 1 }} />
            )}
          </Box>
        );
      })}
    </>
  );
}

function SearchResult({ name, photo, to, onClick }) {
  return (
    <MenuItem
      component={RouterLink}
      to={to}
      onClick={onClick}
      sx={{
        borderRadius: "lg",
        py: 1,
        px: 1.5,
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        "&:hover": {
          bgcolor: "rgba(0, 0, 0, 0.04)",
          transform: "translateX(2px)",
        },
      }}
    >
      <Avatar
        size="sm"
        src={resolvePhotoSrc(photo)}
        alt={name}
        sx={{
          width: 32,
          height: 32,
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "xs",
        }}
      >
        {name[0]}
      </Avatar>
      <Typography
        level="body-sm"
        sx={{
          fontWeight: "600",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
        }}
      >
        {name}
      </Typography>
    </MenuItem>
  );
}

function searchResultsReducer(state, { type, payload }) {
  const { items } = payload;
  const newItems = items.map((item) => {
    switch (type) {
      case PRODUCTS:
        return { ...item, to: `/products/${item.id}` };
      case FARMERS:
        return {
          ...item,
          to: `/farmers/${item.id}`,
          name: toTitleCase(`${item.firstName} ${item.lastName}`),
        };
      case ESCOS:
        return { ...item, to: `/escos/${item.id}` };
      default:
        return item;
    }
  });
  return { ...state, [type]: newItems };
}

export default function SearchBar({ containersx = {}, ...props }) {
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchResults, dispatch] = useReducer(searchResultsReducer, {
    [PRODUCTS]: [],
    [FARMERS]: [],
    [ESCOS]: [],
  });
  const [debouncedSearchQuery, unDebouncedSearchQuery, setSearchQuery] =
    useDebouncedInput({
      defaultValue: searchParams.get("search") || "",
    });
  const [fetchProducts, { isFetching: isFetchingProducts }] =
    useLazyGetProductsQuery();
  const [fetchFarmers, { isFetching: isFetchingFarmers }] =
    useLazyGetFarmersQuery();
  const [fetchEscos, { isFetching: isFetchingEscos }] = useLazyGetEscosQuery();

  function handleSearchClear() {
    setSearchQuery("");
    searchParams.delete("search");
    setSearchParams(searchParams);
    handleResultsPopupClose();
  }
  
  function handleChange({ target }) {
    setSearchQuery(target.value);
    setIsOpen(target.value.trim() !== "");
  }

  function handleFocus({ target }) {
    if (!isEmpty(target.value.trim())) {
      setSearchQuery(target.value);
      setIsOpen(true);
    }
  }

  function handleResultsPopupClose() {
    setIsOpen(false);
  }

  useEffect(() => {
    fetchProducts({ search: debouncedSearchQuery })
      .unwrap()
      .then(({ data }) => {
        dispatch({
          type: PRODUCTS,
          payload: { items: data.slice(0, 4) },
        });
      });
    fetchFarmers({ search: debouncedSearchQuery })
      .unwrap()
      .then(({ data }) => {
        dispatch({
          type: FARMERS,
          payload: { items: data.slice(0, 4) },
        });
      });
    fetchEscos({ search: debouncedSearchQuery })
      .unwrap()
      .then(({ data }) => {
        dispatch({ type: ESCOS, payload: { items: data.slice(0, 4) } });
      });
  }, [debouncedSearchQuery, fetchProducts, fetchFarmers, fetchEscos]);

  return (
    <ClickAwayListener onClickAway={handleResultsPopupClose}>
      <Box sx={{ ...containersx, position: "relative" }}>
        <Input
          ref={inputRef}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder="Search tech products, farmers, escos..."
          value={unDebouncedSearchQuery}
          startDecorator={<SearchOutlinedIcon sx={{ color: "text.tertiary" }} />}
          endDecorator={
            unDebouncedSearchQuery !== "" && (
              <IconButton size="sm" onClick={handleSearchClear} variant="plain" color="neutral">
                <SearchOffOutlinedIcon />
              </IconButton>
            )
          }
          {...props}
        />

        <Popup
          open={isOpen}
          anchorEl={inputRef.current}
          disablePortal={false}
          placement="bottom-start"
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 8],
              },
            },
          ]}
          style={{
            width: inputRef.current ? inputRef.current.clientWidth : 350,
          }}
        >
          <MenuList
            sx={{
              padding: 1.5,
              maxHeight: 380,
              overflowY: "auto",
              overflowX: "hidden",
              width: "100%",
              borderRadius: "xl",
              bgcolor: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              "&::-webkit-scrollbar": {
                width: 6,
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(0, 0, 0, 0.1)",
                borderRadius: 4,
              },
            }}
          >
            <SearchResults
              searchResults={searchResults}
              loading={{
                [PRODUCTS]: isFetchingProducts,
                [FARMERS]: isFetchingFarmers,
                [ESCOS]: isFetchingEscos,
              }}
              onSearchResultClick={handleResultsPopupClose}
              searchQuery={unDebouncedSearchQuery}
            />
          </MenuList>
        </Popup>
      </Box>
    </ClickAwayListener>
  );
}
