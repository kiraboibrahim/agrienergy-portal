import {
  AspectRatio,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Dropdown,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  Typography,
} from "@mui/joy";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import {
  Link as RouterLink,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useGetProductsQuery } from "../../services/product";
import { useState } from "react";
import Loading from "../common/utils/Loading";
import { useGetEscoProductsQuery } from "../../services/esco";
import Empty from "../common/utils/Empty";
import Error from "../common/utils/Error";
import resolvePhotoSrc from "../../utils/resolve-photo-src";
import PaginatedGridList from "../common/layouts/PaginatedGridList";
import toTitleCase from "../../utils/toTitleCase";

export function ProductItem({ product }) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: "xl",
        boxShadow: "sm",
        overflow: "hidden",
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "md",
          borderColor: "warning.300",
        },
        bgcolor: "background.surface",
      }}
    >
      <Box sx={{ position: "relative", width: "100%" }}>
        <AspectRatio ratio="16/9">
          <img
            src={resolvePhotoSrc(product.coverPhoto)}
            alt={product.name}
            loading="lazy"
          />
        </AspectRatio>
        
        {/* Glassmorphic ESCO Seller Capsule Overlay */}
        <Box
          sx={{
            position: "absolute",
            bottom: 8,
            left: 8,
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(6px)",
            py: 0.5,
            px: 1.5,
            borderRadius: "full",
            boxShadow: "sm",
            zIndex: 5,
            maxWidth: "calc(100% - 16px)",
          }}
        >
          <Avatar
            size="sm"
            src={resolvePhotoSrc(product.esco.profilePhoto)}
            sx={{ width: 20, height: 20 }}
          >
            {product.esco.name[0]}
          </Avatar>
          <Typography
            level="body-xs"
            textColor="text.primary"
            sx={{
              fontWeight: "bold",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {toTitleCase(product.esco.name)}
          </Typography>
        </Box>

        {/* Action Button Overlay */}
        <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}>
          <Dropdown>
            <MenuButton
              slots={{ root: IconButton }}
              slotProps={{
                root: {
                  variant: "soft",
                  color: "neutral",
                  size: "sm",
                  sx: {
                    borderRadius: "50%",
                    bgcolor: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(6px)",
                    boxShadow: "sm",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                    },
                  },
                },
              }}
            >
              <MoreVertIcon />
            </MenuButton>
            <Menu placement="bottom-end">
              <MenuItem variant="soft">
                <Typography level="body-sm" startDecorator={<StarBorderOutlinedIcon />}>
                  Promote
                </Typography>
              </MenuItem>
              <MenuItem variant="soft" color="danger">
                <Typography
                  level="body-sm"
                  startDecorator={<DeleteOutlinedIcon color="danger" />}
                  textColor="danger.500"
                >
                  Delete Product
                </Typography>
              </MenuItem>
            </Menu>
          </Dropdown>
        </Box>
      </Box>

      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
          <Chip
            color="warning"
            variant="soft"
            size="sm"
            sx={{ fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px" }}
          >
            Solution
          </Chip>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
            <StarRateRoundedIcon sx={{ color: "warning.500", fontSize: "1.2rem" }} />
            <Typography level="body-xs" textColor="text.secondary" fontWeight="bold">
              4.8
            </Typography>
          </Box>
        </Box>

        <Link
          component={RouterLink}
          to={`/products/${product.id}`}
          overlay
          underline="none"
          textColor="text.primary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontWeight: 600,
            fontSize: "md",
            lineHeight: "1.3",
            height: "2.6em",
            "&:hover": { color: "warning.600" },
          }}
        >
          {toTitleCase(product.name)}
        </Link>
      </CardContent>
    </Card>
  );
}

export function AllProductList() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const {
    data: products,
    error,
    isLoading,
    isFetching,
  } = useGetProductsQuery({ page, search: searchParams.get("search") });
  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error error={error} />;
  }
  return (
    <ProductList
      products={products}
      onSelectPage={setPage}
      isFetching={isFetching}
    />
  );
}

export function EscoProductList() {
  const { id: escoId } = useParams();
  const [page, setPage] = useState(1);
  const {
    data: products,
    error,
    isLoading,
    isFetching,
  } = useGetEscoProductsQuery({ escoId, page });
  if (isLoading) {
    return <Loading />;
  }
  if (!!error) {
    return <Error error={error} />;
  }
  return (
    <ProductList
      products={products}
      onSelectPage={setPage}
      isFetching={isFetching}
    />
  );
}

export default function ProductList({ products, onSelectPage, isFetching = false }) {
  return (
    <>
      <PaginatedGridList
        data={products}
        renderItem={(item) => <ProductItem product={item} />}
        renderEmpty={() => <Empty>No products found</Empty>}
        onSelectPage={onSelectPage}
        isFetching={isFetching}
      />
    </>
  );
}
