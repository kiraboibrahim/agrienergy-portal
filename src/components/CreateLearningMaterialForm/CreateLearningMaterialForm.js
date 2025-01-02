import { Form, Formik } from "formik";
import TextInput from "../common/fields/TextInput";
import Textarea from "../common/fields/Textarea";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
  Avatar,
} from "@mui/joy";
import toTitleCase from "../../utils/toTitleCase";
import resolvePhotoSrc from "../../utils/resolve-photo-src";
import LearningMaterialSchema from "../../validation-schemas/product/LearningMaterialSchema";
import { useCreateLearningMaterialMutation } from "../../services/product";
import { toast } from "react-toastify";
import parseError from "../common/utils/parse-error";

export default function CreateLearningMaterialForm({ product }) {
  const [_uploadLearningMaterial, { isLoading }] =
    useCreateLearningMaterialMutation();

  async function uploadLearningMaterial(values) {
    const body = { ...values, productId: product.id };
    const { unwrap } = _uploadLearningMaterial(body);
    try {
      await unwrap();
      toast.success("Learning material uploaded");
    } catch (err) {
      toast.error(parseError(err));
    }
  }

  return (
    <Box>
      <Card
        variant="soft"
        orientation="horizontal"
        sx={{ marginBottom: 3, overflow: "hidden" }}
      >
        <CardContent orientation="horizontal">
          <Avatar size="lg" src={resolvePhotoSrc(product.coverPhoto)}>
            {product.name}
          </Avatar>
          <Box>
            <Typography level="h3">{toTitleCase(product.name)}</Typography>

            <Box level="body-xs" sx={{ marginTop: 1 }}>
              {product.categories.map(({ name }, index) => (
                <Chip
                  size="sm"
                  key={index}
                  color="success"
                  sx={{ marginRight: 1, overflow: "scroll" }}
                >
                  {name}
                </Chip>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Formik
        validationSchema={LearningMaterialSchema}
        initialValues={{ title: "", videoUrl: "", description: "" }}
        onSubmit={async (values) => await uploadLearningMaterial(values)}
      >
        <Form>
          <TextInput
            name="title"
            label="Title"
            required
            sx={{ marginBottom: 2 }}
          />
          <TextInput
            name="videoUrl"
            label="Youtube link"
            required
            sx={{ marginBottom: 2 }}
          />
          <Textarea
            name="description"
            label="Description"
            required
            sx={{ marginBottom: 2 }}
          />
          <Button
            type="submit"
            sx={{ width: 1, borderRadius: 50 }}
            color="success"
            disabled={isLoading}
            loading={isLoading}
            loadingPosition="start"
          >
            Upload
          </Button>
        </Form>
      </Formik>
    </Box>
  );
}
