import { apiSlice } from '../../apis/apiSlice'

export const testApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getTestList: build.query({
      query: (params) => ({
        url: '/test',
        method: 'GET',
        params,
      }),
      transformResponse: (res) => res,
      providesTags: ['test'],
    }),
    createTest: build.mutation({
      query: (data) => ({
        url: '/test',
        method: 'POST',
        body: data,
      }),
      transformResponse: (res) => res,
      invalidatesTags: ['test'],
    }),
    getTestDetail: build.query({
      query: (id) => ({
        url: `/test/${id}`,
        method: 'GET',
      }),
      transformResponse: (res) => res,
      providesTags: ['test'],
    }),
    updateTest: build.mutation({
      query: ({ data, id }) => ({
        url: `/test/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (res) => res,
      invalidatesTags: ['test'],
    }),
    deleteTest: build.mutation({
      query: (id) => ({
        url: `/test/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (res) => res,
      invalidatesTags: ['test'],
    }),
  }),
})

export const {
  useGetTestListQuery,
  useCreateTestMutation,
  useGetTestDetailQuery,
  useUpdateTestMutation,
  useDeleteTestMutation,
} = testApi
