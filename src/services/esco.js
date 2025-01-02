import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import serializeParams from "../utils/serializeParams";

const ESCO_TAG_TYPE = "Esco";

export const escoApi = createApi({
  reducerPath: "escoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_BASE_URL}escos/`,
    prepareHeaders: (headers, { getState }) => {
      const { auth } = getState();
      headers.set("Authorization", `Bearer ${auth.token}`);
    },
    paramsSerializer: (params) => {
      return serializeParams(params);
    },
  }),
  tagTypes: [ESCO_TAG_TYPE],
  endpoints: (builder) => ({
    getEscos: builder.query({
      query: ({ page = 1, search = null }) => ({
        url: "",
        params: { page, search },
      }),
      providesTags: (result) => {
        return result?.data
          ? result.data.map(({ id }) => ({ type: ESCO_TAG_TYPE, id }))
          : [ESCO_TAG_TYPE];
      },
    }),
    getEsco: builder.query({
      query: (escoId) => `${escoId}`,
      providesTags: (result, error, escoId) => [
        {
          type: ESCO_TAG_TYPE,
          id: escoId,
        },
      ],
    }),
    getEscoProducts: builder.query({
      query: ({ escoId, page = 1 }) => ({
        url: `${escoId}/products`,
        params: { page },
      }),
    }),
    getEscoOffers: builder.query({
      query: ({ escoId, page = 1 }) => ({
        url: `${escoId}/offers`,
        params: { page },
      }),
    }),
    getEscoInstallations: builder.query({
      query: ({ escoId, page = 1 }) => ({
        url: `${escoId}/installations`,
        params: { page },
      }),
    }),
    updateEsco: builder.mutation({
      query: ({ escoId, ...body }) => ({
        method: "PATCH",
        url: `${escoId}`,
        body,
      }),
      invalidatesTags: (result, error, { escoId }) => [
        {
          type: ESCO_TAG_TYPE,
          id: escoId,
        },
      ],
      transformErrorResponse: (response, meta, arg) => response.data,
    }),
    createEsco: builder.mutation({
      query: (body) => ({
        method: "POST",
        body,
      }),
      invalidatesTags: [ESCO_TAG_TYPE],
      transformErrorResponse: (response, meta, arg) => response.data,
    }),
    deleteEsco: builder.mutation({
      query: (escoId) => ({
        method: "DELETE",
        url: `${escoId}`,
      }),
      invalidatesTags: (result, error, escoId) => [
        {
          type: ESCO_TAG_TYPE,
          id: escoId,
        },
      ],
      transformErrorResponse: (response, meta, arg) => response.data,
    }),
  }),
});

export const {
  useGetEscosQuery,
  useLazyGetEscosQuery,
  useGetEscoQuery,
  useGetEscoProductsQuery,
  useGetEscoOffersQuery,
  useGetEscoInstallationsQuery,
  useUpdateEscoMutation,
  useCreateEscoMutation,
  useDeleteEscoMutation,
} = escoApi;
