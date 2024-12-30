import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import serializeParams from "../utils/serializeParams";

const GROUP_TAG_TYPE = "Group";

export const groupApi = createApi({
  reducerPath: "groupApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_BASE_URL}groups/`,
    prepareHeaders: (headers, { getState }) => {
      const { auth } = getState();
      headers.set("Authorization", `Bearer ${auth.token}`);
    },
    paramsSerializer: (params) => {
      return serializeParams(params);
    },
  }),
  tagTypes: [GROUP_TAG_TYPE],
  endpoints: (builder) => ({
    getGroups: builder.query({
      query: ({ page = 1, search = null }) => ({
        url: "",
        params: { page, search },
      }),
      providesTags: (result) => {
        return result?.data
          ? result.data.map(({ id }) => ({
              type: GROUP_TAG_TYPE,
              id,
            }))
          : [GROUP_TAG_TYPE];
      },
    }),
    getGroup: builder.query({
      query: (groupId) => `${groupId}`,
      providesTags: (result, error, groupId) => [
        {
          type: GROUP_TAG_TYPE,
          id: groupId,
        },
      ],
    }),
    getGroupFavoriteProducts: builder.query({
      query: ({ groupId, page = 1 }) => ({
        url: `${groupId}/products/favorites`,
        params: { page },
      }),
    }),
    getGroupOffers: builder.query({
      query: ({ groupId, page = 1 }) => ({
        url: `${groupId}/offers`,
        params: { page },
      }),
    }),
    getGroupInstallations: builder.query({
      query: ({ groupId, page = 1 }) => ({
        url: `${groupId}/installations`,
        params: { page },
      }),
    }),
    getGroupRecommendations: builder.query({
      query: ({ groupId }) => ({
        url: `${groupId}/recommendations`,
      }),
    }),
    deleteGroup: builder.mutation({
      query: (groupId) => ({
        method: "DELETE",
        url: `${groupId}`,
      }),
      invalidatesTags: (result, error, groupId) => [
        {
          type: GROUP_TAG_TYPE,
          id: groupId,
        },
      ],
      transformErrorResponse: (response, meta, arg) => response.data,
    }),
    createGroup: builder.mutation({
      query: (body) => ({
        url: "",
        method: "POST",
        body,
      }),
      invalidatesTags: [GROUP_TAG_TYPE],
      transformErrorResponse: (response, meta, arg) => response.data,
    }),
    updateGroup: builder.mutation({
      query: ({ groupId, ...body }) => ({
        url: `${groupId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { groupId }) => [
        {
          type: GROUP_TAG_TYPE,
          id: groupId,
        },
      ],
      transformErrorResponse: (response, meta, arg) => response.data,
    }),
    createGroupMembers: builder.mutation({
      query: ({ groupId, ...body }) => ({
        url: `${groupId}/members`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { groupId }) => [
        {
          type: GROUP_TAG_TYPE,
          id: groupId,
        },
      ],
      transformErrorResponse: (response, meta, arg) => response.data,
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useLazyGetGroupsQuery,
  useGetGroupQuery,
  useGetGroupInstallationsQuery,
  useGetGroupFavoriteProductsQuery,
  useGetGroupOffersQuery,
  useGetGroupRecommendationsQuery,
  useDeleteGroupMutation,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useCreateGroupMembersMutation,
} = groupApi;
