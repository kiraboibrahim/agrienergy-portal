import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import serializeParams from "../utils/serializeParams";

const PRODUCT_TAG_TYPE = "Product";
const LEARNING_MATERIAL_TAG_TYPE = "LearningMaterial";

export const productApi = createApi({
  reducerPath: "productApi",
  tagTypes: [PRODUCT_TAG_TYPE, LEARNING_MATERIAL_TAG_TYPE],
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_BASE_URL}`,
    prepareHeaders: (headers, { getState }) => {
      const { auth } = getState();
      headers.set("Authorization", `Bearer ${auth.token}`);
    },
    paramsSerializer: (params) => {
      return serializeParams(params);
    },
  }),

  transformErrorResponse: (response, meta, arg) => response.data,
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page = 1, search = null }) => ({
        url: "products",
        params: { page, search },
      }),
      providesTags: (result) => {
        return result?.data
          ? result.data.map(({ id }) => ({ type: PRODUCT_TAG_TYPE, id }))
          : [PRODUCT_TAG_TYPE];
      },
    }),
    getProduct: builder.query({
      query: (productId) => `products/${productId}`,
      providesTags: (result, error, productId) => [
        {
          type: PRODUCT_TAG_TYPE,
          id: productId,
        },
      ],
    }),
    getProductLearningMaterial: builder.query({
      query: (productId) => `products/${productId}/learning-materials`,
      providesTags: (result) => {
        return result?.data
          ? result.data.map(({ id }) => ({
              type: LEARNING_MATERIAL_TAG_TYPE,
              id,
            }))
          : [LEARNING_MATERIAL_TAG_TYPE];
      },
    }),
    promoteProduct: builder.mutation({
      query: ({ productId, ...body }) => ({
        url: `products/${productId}/promotions`,
        method: "POST",
        body,
      }),
      providesTags: (result, error, productId) => [
        {
          type: PRODUCT_TAG_TYPE,
          id: productId,
        },
      ],
    }),
    updateProduct: builder.mutation({
      query: ({ productId, ...body }) => ({
        method: "PATCH",
        url: `products/${productId}`,
        body,
      }),
      invalidatesTags: (result, error, { productId }) => [
        {
          type: PRODUCT_TAG_TYPE,
          id: productId,
        },
      ],
      transformErrorResponse: (response, meta, arg) => response.data,
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        method: "DELETE",
        url: `products/${productId}`,
      }),
      invalidatesTags: (result, error, productId) => [
        {
          type: PRODUCT_TAG_TYPE,
          id: productId,
        },
      ],
      transformErrorResponse: (response, meta, arg) => response.data,
    }),
    deleteLearningMaterial: builder.mutation({
      query: (learningMaterialId) => ({
        method: "DELETE",
        url: `learning-material/${learningMaterialId}`,
      }),
      invalidatesTags: (result, error, arg) => [LEARNING_MATERIAL_TAG_TYPE],
      transformErrorResponse: (response, meta, arg) => response.data,
    }),
    createLearningMaterial: builder.mutation({
      query: (body) => ({
        url: "learning-material",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [LEARNING_MATERIAL_TAG_TYPE],
      transformErrorResponse: (response, meta, arg) => response.data,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductLearningMaterialQuery,
  useLazyGetProductsQuery,
  useGetProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  usePromoteProductMutation,
  useCreateLearningMaterialMutation,
  useDeleteLearningMaterialMutation,
} = productApi;
