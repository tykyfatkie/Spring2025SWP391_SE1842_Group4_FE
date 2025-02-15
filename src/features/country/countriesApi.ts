import { apiSlice } from '../../apis/apiSlice'

const countryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCountryList: builder.query({
      query: ({ pageNumber, pageSize }) => ({
        url: '/countries',
        method: 'GET',
        params: {
          pageNumber,
          pageSize,
        },
      }),
      transformResponse: (res) => res,
      providesTags: ['countries'],
    }),
    createCountry: builder.mutation({
      query: (data) => ({
        url: '/countries',
        method: 'POST',
        body: data,
      }),
      transformResponse: (res) => res,
      invalidatesTags: ['countries'],
    }),
    getCountryDetail: builder.query({
      query: (id) => ({
        url: `/countries/${id}`,
        method: 'GET',
      }),
      transformResponse: (res) => res,
      providesTags: ['countries'],
    }),
    updateCountry: builder.mutation({
      query: ({ data, id }) => ({
        url: `/countries/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (res) => res,
      invalidatesTags: ['countries'],
    }),
    deleteCountry: builder.mutation({
      query: (id) => ({
        url: `/countries/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (res) => res,
      invalidatesTags: ['countries'],
    }),
  }),
})

export const {
  useGetCountryListQuery,
  useCreateCountryMutation,
  useGetCountryDetailQuery,
  useUpdateCountryMutation,
  useDeleteCountryMutation,
} = countryApi
