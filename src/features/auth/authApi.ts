// authApi.ts
import { apiSlice } from '../../apis/apiSlice'; 
import { login, logout } from './authSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ accessToken: string }, { email: string; password: string; authType: number; redirect: string }>({
      query: (credentials) => ({
        url: 'https://localhost:7217/api/v1/auth/login', 
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(login(data));  
        } catch (error) {
          console.error('Login failed', error);
        }
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        credentials: 'include',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout()); 
        } catch (error) {
          console.error('Logout failed', error);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
