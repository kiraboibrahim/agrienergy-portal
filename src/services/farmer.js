import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import serializeParams from "../utils/serializeParams";

const FARMER_TAG_TYPE = "Farmer";

export const farmerApi = createApi({
  reducerPath: "farmerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_BASE_URL}farmers/`,
    prepareHeaders: (headers, { getState }) => {
      const { auth } = getState();
      headers.set("Authorization", `Bearer ${auth.token}`);
    },
    paramsSerializer: (params) => {
      return serializeParams(params);
    },
  }),
  tagTypes: [FARMER_TAG_TYPE],
  endpoints: (builder) => ({
    getFarmers: builder.query({
      query: ({ page = 1, search = null }) => ({
        url: "",
        params: { page, search },
      }),
      providesTags: (result) => {
        return result?.data
          ? result.data.map(({ id }) => ({
              type: FARMER_TAG_TYPE,
              id,
            }))
          : [FARMER_TAG_TYPE];
      },
    }),
    getFarmer: builder.query({
      query: (farmerId) => `${farmerId}`,
      providesTags: (result, error, farmerId) => [
        {
          type: FARMER_TAG_TYPE,
          id: farmerId,
        },
      ],
    }),
    getFarmerFavoriteProducts: builder.query({
      query: ({ farmerId, page = 1 }) => ({
        url: `${farmerId}/products/favorites`,
        params: { page },
      }),
    }),
    getFarmerOffers: builder.query({
      query: ({ farmerId, page = 1 }) => ({
        url: `${farmerId}/offers`,
        params: { page },
      }),
    }),
    getFarmerInstallations: builder.query({
      query: ({ farmerId, page = 1 }) => ({
        url: `${farmerId}/installations`,
        params: { page },
      }),
    }),
    getFarmerRecommendations: builder.query({
      query: ({ farmerId }) => ({
        url: `${farmerId}/recommendations`,
      }),
    }),
    updateFarmer: builder.mutation({
      query: ({ farmerId, ...body }) => ({
        method: "PATCH",
        url: `${farmerId}`,
        body,
      }),
      invalidatesTags: (result, error, { farmerId }) => [
        {
          type: FARMER_TAG_TYPE,
          id: farmerId,
        },
      ],
      transformErrorResponse: (response, meta, arg) => response.data,
    }),
    deleteFarmer: builder.mutation({
      query: (farmerId) => ({
        method: "DELETE",
        url: `${farmerId}`,
      }),
      invalidatesTags: (result, error, farmerId) => [
        {
          type: FARMER_TAG_TYPE,
          id: farmerId,
        },
      ],
      transformErrorResponse: (response, meta, arg) => response.data,
    }),
    createFarmer: builder.mutation({
      query: (body) => ({
        url: "",
        method: "POST",
        body,
      }),
      invalidatesTags: [FARMER_TAG_TYPE],
      transformErrorResponse: (response, meta, arg) => response.data,
    }),
  }),
});

export const {
  useGetFarmersQuery,
  useGetFarmerQuery,
  useLazyGetFarmersQuery,
  useGetFarmerFavoriteProductsQuery,
  useGetFarmerOffersQuery,
  useGetFarmerInstallationsQuery,
  useGetFarmerRecommendationsQuery,
  useUpdateFarmerMutation,
  useCreateFarmerMutation,
  useDeleteFarmerMutation,
} = farmerApi;
