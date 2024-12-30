import {
  AspectRatio,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/joy";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useGetProductQuery } from "../../services/product";
import Loading from "../common/utils/Loading";
import { useState } from "react";
import resolvePhotoSrc from "../../utils/resolve-photo-src";
import toTitleCase from "../../utils/toTitleCase";
import Error from "../../components/common/utils/Error";
import useDeleteProduct from "../../hooks/useDeleteProduct";
import ProductForm from "./ProductForm";
import PromoteProductModal, {
  usePromoteProductModalContext,
} from "./PromoteProductModal";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import LearningMaterialsList from "../LearningMaterialList/LearningMaterialList";
import CreateLearningMaterialModal, {
  useLearningModalContext,
} from "./CreateLearningMaterialModal";

export default function ProductDetail() {
  const { id: productId } = useParams();
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [, openPromoteModal] = usePromoteProductModalContext();
  const [, openLearningModal] = useLearningModalContext();
  const [deleteProduct, isDeletingProduct] = useDeleteProduct();
  const {
    data: product,
    error: productFetchError,
    isFetching: isFetchingProducts,
  } = useGetProductQuery(productId);

  if (isFetchingProducts) {
    return <Loading />;
  }
  if (!!productFetchError) {
    return <Error error={productFetchError} />;
  }

  if (!!product) {
    return (
      <Box
        sx={{
          padding: 2,
          marginBottom: 3,
          maxWidth: 800,
          marginLeft: "auto",
          marginRight: "auto",
          position: "relative",
        }}
      >
        <Box
          sx={{
            marginLeft: "auto",
            marginRight: "auto",
            maxWidth: 500,
          }}
        >
          <AspectRatio variant="plain">
            <img
              src={currentPhoto || resolvePhotoSrc(product.coverPhoto)}
              alt={product.name}
            />
          </AspectRatio>

          <Stack
            spacing={2}
            direction="row"
            sx={{
              marginTop: 2,
              justifyContent: "center",
            }}
          >
            {[
              product.coverPhoto,
              product.photo1,
              product.photo2,
              product.photo3,
              product.photo4,
            ].map((photo, index) => (
              <AspectRatio key={index} sx={{ width: 100, cursor: "pointer" }}>
                <img
                  src={resolvePhotoSrc(photo)}
                  alt={product.name}
                  onClick={() => setCurrentPhoto(resolvePhotoSrc(photo))}
                />
              </AspectRatio>
            ))}
          </Stack>

          <ButtonGroup
            variant="soft"
            color="warning"
            buttonFlex={1}
            sx={{ marginTop: 3 }}
          >
            <Button
              disabled={isDeletingProduct}
              loading={isDeletingProduct}
              loadingPosition="start"
              startDecorator={<DeleteOutlinedIcon />}
              onClick={async () => {
                await deleteProduct(productId);
              }}
            >
              Delete
            </Button>

            <Button
              startDecorator={<StarBorderOutlinedIcon />}
              disabled={product.isFeatured}
              onClick={() => openPromoteModal()}
            >
              Promote
            </Button>
            <Button
              startDecorator={<SchoolOutlinedIcon />}
              onClick={() => openLearningModal()}
            >
              Upload
            </Button>
          </ButtonGroup>

          <Typography level="h4" sx={{ marginTop: 3 }}>
            {toTitleCase(product.name)}
          </Typography>

          <Typography sx={{ marginTop: 2 }} level="body-md">
            Sold by
          </Typography>
          <Card>
            <CardContent orientation="horizontal">
              <Avatar
                src={resolvePhotoSrc(product.esco.profilePhoto)}
                alt={product.esco.name}
              />
              <Typography level="body-sm">
                {toTitleCase(product.esco.name)}
              </Typography>
              <IconButton
                sx={{ marginLeft: "auto" }}
                component={RouterLink}
                to={`/escos/${product.esco.id}`}
              >
                <ChevronRightOutlinedIcon />
              </IconButton>
            </CardContent>
          </Card>
          <Typography level="body-md" sx={{ marginTop: 3, marginBottom: 1 }}>
            Learning Materials
          </Typography>
          <LearningMaterialsList productId={productId} />
          <ProductForm product={product} />
        </Box>
        <PromoteProductModal product={product} />
        <CreateLearningMaterialModal product={product} />
      </Box>
    );
  }
}
