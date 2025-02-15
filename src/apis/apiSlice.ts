import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'
import { logout, refreshToken } from '../features/auth/authSlice'
import { Mutex } from 'async-mutex'
// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_ENDPOINT + '/',
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const token = (
      getState() as { authSlice: { userToken: { token: string } } }
    ).authSlice?.userToken?.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  },
})

// create a new mutex
const mutex = new Mutex()
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock()
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    const rfToken = api.getState().authSlice.userToken?.refreshToken

    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        const refreshResult = await baseQuery(
          {
            url: `/api/users/refresh-token`,
            method: 'GET',
            headers: {
              Authorization: `Bearer ${rfToken}`,
            },
          },
          api,
          extraOptions
        )

        if (refreshResult.data) {
          api.dispatch(refreshToken((refreshResult.data as { data: any }).data))
          result = await baseQuery(args, api, extraOptions)
        } else {
          api.dispatch(logout())
        }
      } finally {
        release()
      }
    } else {
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }
  return result
}

const baseQueryWithRetry = retry(baseQueryWithReauth, { maxRetries: 1 })

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['test', 'Auth', 'countries'],
  endpoints: () => ({}),
})
