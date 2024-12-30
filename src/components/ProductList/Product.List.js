import {
  AspectRatio,
  Avatar,
  Box,
  Card,
  CardContent,
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
    <Card size="sm" variant="soft" sx={{ borderRadius: "lg" }}>
      <CardContent orientation="horizontal">
        <Avatar
          src={resolvePhotoSrc(product.esco.profilePhoto)}
          sx={{ marginRight: 0.5 }}
        >
          {toTitleCase(product.esco.name)}
        </Avatar>
        <Typography
          level="body-sm"
          sx={{
            alignSelf: "center",
            flexGrow: 2,
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {toTitleCase(product.esco.name)}
        </Typography>
        <Box sx={{ marginLeft: "auto" }}>
          <Dropdown>
            <MenuButton slots={{ root: IconButton }}>
              <MoreVertIcon />
            </MenuButton>
            <Menu>
              <MenuItem>
                <Typography
                  level="body-sm"
                  startDecorator={<StarBorderOutlinedIcon />}
                >
                  Promote
                </Typography>
              </MenuItem>
              <MenuItem>
                <Typography
                  level="body-sm"
                  startDecorator={<DeleteOutlinedIcon />}
                >
                  Delete
                </Typography>
              </MenuItem>
            </Menu>
          </Dropdown>
        </Box>
      </CardContent>
      <AspectRatio>
        <img
          src={resolvePhotoSrc(product.coverPhoto)}
          alt={product.name}
          loading="lazy"
        />
      </AspectRatio>
      <Link
        sx={{
          display: "block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        component={RouterLink}
        to={`/products/${product.id}`}
        overlay
        underline="none"
      >
        <Typography level="title-md">{toTitleCase(product.name)}</Typography>
      </Link>
    </Card>
  );
}

export function AllProductList() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const {
    data: products,
    error,
    isFetching,
  } = useGetProductsQuery({ page, search: searchParams.get("search") });
  if (isFetching) {
    return <Loading />;
  }
  if (error) {
    return <Error error={error} />;
  }
  return <ProductList products={products} onSelectPage={setPage} />;
}

export function EscoProductList() {
  const { id: escoId } = useParams();
  const [page, setPage] = useState(1);
  const {
    data: products,
    error,
    isFetching,
  } = useGetEscoProductsQuery({ escoId, page });
  if (isFetching) {
    return <Loading />;
  }
  if (!!error) {
    return <Error error={error} />;
  }
  return <ProductList products={products} onSelectPage={setPage} />;
}

export default function ProductList({ products, onSelectPage }) {
  return (
    <>
      <PaginatedGridList
        data={products}
        renderItem={(item) => <ProductItem product={item} />}
        renderEmpty={() => <Empty>No products found</Empty>}
        onSelectPage={onSelectPage}
      />
    </>
  );
}
