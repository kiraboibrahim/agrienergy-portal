import { useState } from "react";
import TextInput from "../common/fields/TextInput";
import { Form } from "formik";
import Textarea from "../common/fields/Textarea";
import { toast } from "react-toastify";
import RemoteSelect from "../common/fields/RemoteSelect";
import ProductSchema from "../../validation-schemas/product/ProductSchema";
import difference from "../../utils/difference";
import isEmpty from "../../utils/isEmpty";
import { useLazyGetProductsCategoriesQuery } from "../../services/productCategories";
import DirtyFormik from "../common/fields/DirtyFormik";
import useUpdateProduct from "../../hooks/useUpdateProduct";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { Stack, Button } from "@mui/joy";

export default function ProductForm({ product }) {
  const [isDirty, setIsDirty] = useState(false);
  const [updateProduct, isUpdatingProduct] = useUpdateProduct();
  const [fetchProductCategories] = useLazyGetProductsCategoriesQuery();
  return (
    <DirtyFormik
      initialValues={{
        ...product,
      }}
      validationSchema={ProductSchema}
      onSubmit={async (values) => {
        const updatedValues = difference(product, values);
        if (!isEmpty(updatedValues)) {
          await updateProduct(product.id, updatedValues);
        }
      }}
      onDirty={(isDirty) => setIsDirty(isDirty)}
    >
      <Form>
        <TextInput sx={{ marginTop: 3 }} name="name" label="Product name" />
        <RemoteSelect
          sx={{ marginTop: 2 }}
          isMulti={true}
          name="categories"
          label="Categories"
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
          getOptions={(inputValue, callback) => {
            fetchProductCategories()
              .unwrap()
              .then(({ data: productCategories }) => {
                callback(
                  productCategories.filter(({ name }) =>
                    name.toLowerCase().includes(inputValue.toLowerCase())
                  )
                );
              })
              .catch((err) => toast.error(err?.message));
          }}
        />
        <Textarea
          sx={{ marginTop: 2 }}
          name="description"
          label="Description"
        ></Textarea>

        <Stack
          direction="row"
          sx={{
            marginTop: 2,
            width: "100%",
          }}
        >
          <Button
            sx={{ flexGrow: 1 }}
            type="reset"
            size="md"
            variant="soft"
            color="success"
            disabled={!isDirty || isUpdatingProduct}
          >
            Undo Changes
          </Button>
          <Button
            size="md"
            color="success"
            variant="solid"
            startDecorator={<SaveOutlinedIcon />}
            sx={{ flexGrow: 2, marginLeft: 2 }}
            type="submit"
            disabled={!isDirty || isUpdatingProduct}
            loading={isUpdatingProduct}
            loadingPosition="start"
          >
            Save
          </Button>
        </Stack>
      </Form>
    </DirtyFormik>
  );
}
