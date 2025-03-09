// src/features/auth/authApi.ts
import { apiSlice } from '../../apis/apiSlice'; 
import { login, logout } from './authSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ accessToken: string; user: any }, { email: string; password: string; authType: number; redirect: string }>(
      {
        query: (credentials) => ({
          url: `${import.meta.env.VITE_API_ENDPOINT}/auth/login`, 
          method: 'POST',
          body: credentials,
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            console.log("Login API Response:", data); // Debug log

            // Lưu token và user vào Redux và Local Storage
            dispatch(login(data));  
            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("user", JSON.stringify(data.user || {}));
          } catch (error) {
            console.error('Login failed:', error);
          }
        },
      }
    ),
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

          // Xóa dữ liệu khỏi Local Storage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } catch (error) {
          console.error('Logout failed:', error);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
