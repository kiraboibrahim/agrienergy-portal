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
  Grid,
  Chip,
} from "@mui/joy";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
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
  const [showEditForm, setShowEditForm] = useState(false);

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
    // Collect all valid photos
    const photos = [
      product.coverPhoto,
      product.photo1,
      product.photo2,
      product.photo3,
      product.photo4,
    ].filter(Boolean);

    const activePhoto = currentPhoto || resolvePhotoSrc(product.coverPhoto);

    return (
      <Box
        sx={{
          padding: { xs: 2, md: 4 },
          marginBottom: 5,
          maxWidth: 1000,
          marginLeft: "auto",
          marginRight: "auto",
          position: "relative",
        }}
      >
        <Grid container spacing={4}>
          {/* Left Column - Gallery */}
          <Grid xs={12} md={6}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: "xl",
                overflow: "hidden",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                boxShadow: "sm",
                bgcolor: "background.surface",
                p: 0,
              }}
            >
              <AspectRatio ratio="4/3">
                <img
                  src={activePhoto}
                  alt={product.name}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </AspectRatio>
            </Card>

            {/* Thumbnail Strip */}
            {photos.length > 1 && (
              <Stack
                spacing={1.5}
                direction="row"
                useFlexGap
                flexWrap="wrap"
                sx={{
                  marginTop: 2,
                  justifyContent: "center",
                }}
              >
                {photos.map((photo, index) => {
                  const src = resolvePhotoSrc(photo);
                  const isActive = activePhoto === src;
                  return (
                    <Box
                      key={index}
                      onClick={() => setCurrentPhoto(src)}
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: "lg",
                        overflow: "hidden",
                        cursor: "pointer",
                        border: isActive
                          ? "2px solid #2e7d32"
                          : "2px solid transparent",
                        boxShadow: isActive ? "sm" : "none",
                        opacity: isActive ? 1 : 0.65,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          opacity: 1,
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      <img
                        src={src}
                        alt={`${product.name} gallery-${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Grid>

          {/* Right Column - Product details info */}
          <Grid xs={12} md={6}>
            <Stack spacing={3}>
              <Box>
                {product.categories && product.categories.map((category) => (
                  <Chip
                    key={category.id}
                    variant="soft"
                    color="success"
                    size="sm"
                    sx={{ mr: 1, mb: 1, fontWeight: "600" }}
                  >
                    {category.name}
                  </Chip>
                ))}
                
                <Typography
                  level="h2"
                  sx={{
                    fontWeight: "800",
                    fontSize: { xs: "1.75rem", md: "2.25rem" },
                    letterSpacing: "-0.5px",
                    color: "neutral.900",
                    mt: 1,
                  }}
                >
                  {toTitleCase(product.name)}
                </Typography>
              </Box>

              {/* Product description read state */}
              {product.description && (
                <Box>
                  <Typography
                    level="body-xs"
                    sx={{
                      fontWeight: "700",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      color: "text.tertiary",
                      mb: 1,
                    }}
                  >
                    Product Description
                  </Typography>
                  <Typography
                    level="body-sm"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.7,
                    }}
                  >
                    {product.description}
                  </Typography>
                </Box>
              )}

              {/* Action buttons */}
              <ButtonGroup
                variant="soft"
                color="warning"
                buttonFlex={1}
                sx={{
                  boxShadow: "xs",
                  borderRadius: "xl",
                  overflow: "hidden",
                }}
              >
                <Button
                  color="danger"
                  disabled={isDeletingProduct}
                  loading={isDeletingProduct}
                  loadingPosition="start"
                  startDecorator={<DeleteOutlinedIcon />}
                  onClick={async () => {
                    await deleteProduct(productId);
                  }}
                  sx={{ fontWeight: "700" }}
                >
                  Delete
                </Button>

                <Button
                  startDecorator={<StarBorderOutlinedIcon />}
                  disabled={product.isFeatured}
                  onClick={() => openPromoteModal()}
                  sx={{ fontWeight: "700" }}
                >
                  Promote
                </Button>

                <Button
                  startDecorator={<SchoolOutlinedIcon />}
                  onClick={() => openLearningModal()}
                  sx={{ fontWeight: "700" }}
                >
                  Upload
                </Button>
              </ButtonGroup>

              {/* Seller details card */}
              <Box>
                <Typography
                  level="body-xs"
                  sx={{
                    fontWeight: "700",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: "text.tertiary",
                    mb: 1.5,
                  }}
                >
                  Distributed By
                </Typography>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: "xl",
                    borderColor: "rgba(0,0,0,0.06)",
                    boxShadow: "none",
                    bgcolor: "rgba(0,0,0,0.01)",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "rgba(0,0,0,0.15)",
                      bgcolor: "rgba(0,0,0,0.02)",
                    },
                  }}
                >
                  <CardContent
                    orientation="horizontal"
                    sx={{ alignItems: "center", gap: 2 }}
                  >
                    <Avatar
                      src={resolvePhotoSrc(product.esco.profilePhoto)}
                      alt={product.esco.name}
                      sx={{
                        width: 44,
                        height: 44,
                        border: "1px solid rgba(0,0,0,0.08)",
                        boxShadow: "xs",
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        level="title-sm"
                        sx={{ fontWeight: "700", color: "text.primary" }}
                      >
                        {toTitleCase(product.esco.name)}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.25 }}>
                        <StorefrontOutlinedIcon sx={{ fontSize: "0.85rem", color: "text.tertiary" }} />
                        <Typography level="body-xs" sx={{ color: "text.secondary" }}>
                          ESCO Vendor
                        </Typography>
                      </Stack>
                    </Box>
                    <IconButton
                      component={RouterLink}
                      to={`/escos/${product.esco.id}`}
                      variant="plain"
                      color="neutral"
                      sx={{ borderRadius: "50%" }}
                    >
                      <ChevronRightOutlinedIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* Bottom Section - Learning Materials */}
        <Box sx={{ marginTop: 6 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <LibraryBooksOutlinedIcon sx={{ color: "success.500" }} />
            <Typography level="h3" sx={{ fontWeight: "800" }}>
              Learning Materials
            </Typography>
          </Stack>
          <Card
            variant="outlined"
            sx={{
              borderRadius: "xl",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "none",
              p: { xs: 2, md: 3 },
            }}
          >
            <LearningMaterialsList productId={productId} />
          </Card>
        </Box>

        {/* Bottom Section - Edit Settings collapsible */}
        <Box sx={{ marginTop: 4 }}>
          <Button
            variant="plain"
            color="success"
            startDecorator={<SettingsOutlinedIcon />}
            onClick={() => setShowEditForm(!showEditForm)}
            sx={{
              fontWeight: "700",
              fontSize: "0.9rem",
              "&:hover": { bgcolor: "success.50" },
            }}
          >
            {showEditForm ? "Hide Product Settings" : "Configure & Edit Product Settings"}
          </Button>

          {showEditForm && (
            <Card
              variant="outlined"
              sx={{
                marginTop: 2,
                borderRadius: "xl",
                border: "1px solid rgba(0,0,0,0.06)",
                p: { xs: 2, md: 3 },
                boxShadow: "sm",
                bgcolor: "background.surface",
              }}
            >
              <Typography level="title-md" sx={{ fontWeight: "700", mb: 2 }}>
                Update Product Properties
              </Typography>
              <ProductForm product={product} />
            </Card>
          )}
        </Box>

        <PromoteProductModal product={product} />
        <CreateLearningMaterialModal product={product} />
      </Box>
    );
  }
  return null;
}
