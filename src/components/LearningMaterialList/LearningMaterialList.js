import { useGetProductLearningMaterialQuery } from "../../services/product";
import YouTubePlayer from "react-player/youtube";
import Error from "../common/utils/Error";
import Loading from "../common/utils/Loading";
import { Sheet, Stack, Typography, Button, Card, CardContent } from "@mui/joy";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { useLearningModalContext } from "../ProductDetail/CreateLearningMaterialModal";
import { useDeleteLearningMaterialMutation } from "../../services/product";
import { toast } from "react-toastify";
import parseError from "../common/utils/parse-error";
import { useState } from "react";
import ConfirmationModal from "../common/utils/ConfirmationModal";

function LearningMaterial({ item, sx = [], ...props }) {
  const [_deleteLearningMaterial, { isLoading }] =
    useDeleteLearningMaterialMutation();
  const { id, videoUrl, title } = item;
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  async function deleteLearningMaterial() {
    const { unwrap } = _deleteLearningMaterial(id);
    try {
      await unwrap();
      toast.success("Learning material deleted");
    } catch (err) {
      toast.error(parseError(err));
    }
  }
  return (
    <Card
      size="sm"
      sx={[
        { minWidth: 1, maxWidth: 1, borderRadius: "lg" },
        { ...(Array.isArray(sx) ? sx : [sx]) },
      ]}
      {...props}
    >
      <CardContent orientation="horizontal" sx={{ alignItems: "center" }}>
        <Typography
          level="body-sm"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Typography>
        <Button
          size="sm"
          sx={{ borderRadius: 50, marginLeft: "auto" }}
          color="danger"
          disabled={isLoading}
          loading={isLoading}
          loadingPosition="start"
          onClick={() => setIsConfirmModalOpen(true)}
        >
          Delete
        </Button>
      </CardContent>
      <CardContent>
        <YouTubePlayer url={videoUrl} width="100%" height={200} />
      </CardContent>
      <ConfirmationModal
        open={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={async () => {
          setIsConfirmModalOpen(false);
          await deleteLearningMaterial();
        }}
        isLoading={isLoading}
        title="Delete Learning Material"
        message={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
      />
    </Card>
  );
}

function EmptyLearningMaterials() {
  const [, openLearningModal] = useLearningModalContext();
  return (
    <Sheet
      variant="soft"
      color="neutral"
      sx={{
        minWidth: 1,
        height: 200,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "lg",
      }}
    >
      <Stack direction="column" sx={{ alignItems: "center" }}>
        <SchoolOutlinedIcon fontSize="xl3" />
        <Typography level="body-sm">No Learning Materials</Typography>
        <Button
          size="sm"
          variant="soft"
          color="success"
          sx={{ borderRadius: 50, marginTop: 1 }}
          onClick={() => openLearningModal()}
        >
          Upload
        </Button>
      </Stack>
    </Sheet>
  );
}
export default function LearningMaterialsList({ productId }) {
  const {
    data: learningMaterials,
    isFetching,
    error: fetchError,
  } = useGetProductLearningMaterialQuery(productId);

  if (isFetching) return <Loading size="sm" />;
  if (!!fetchError) return <Error error={fetchError} />;

  if (!!learningMaterials.length) {
    return (
      <Stack
        direction="row"
        spacing={2}
        sx={{
          overflowX: "scroll",
          overflowY: "hidden",
          overflow: "scroll",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "&": {
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          },
        }}
      >
        {learningMaterials.map((learningMaterial, index) => (
          <LearningMaterial
            item={learningMaterial}
            key={index}
            sx={{ flex: "1 1 auto" }}
          />
        ))}
      </Stack>
    );
  } else {
    return <EmptyLearningMaterials />;
  }
}
