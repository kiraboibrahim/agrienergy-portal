import * as Yup from "yup";

const ProductSchema = Yup.object({
  name: Yup.string().max(100).required("Product name is required"),
  description: Yup.string().max(500).required("Description is required"),
  categories: Yup.array().min(1, "Specify atleast one category"),
});

export default ProductSchema;
