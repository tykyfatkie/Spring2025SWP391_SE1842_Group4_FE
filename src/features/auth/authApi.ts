// authApi.ts
import { apiSlice } from '../../apis/apiSlice';  // Đảm bảo apiSlice đã có baseUrl cấu hình
import { login, logout } from './authSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ accessToken: string }, { email: string; password: string; authType: number; redirect: string }>({
      query: (credentials) => ({
        url: 'https://localhost:7217/api/v1/auth/login',  // URL phần sau của baseUrl
        method: 'POST',
        body: credentials,
        credentials: 'include', // Quan trọng: Gửi cookies khi đăng nhập
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(login(data));  // Dispatch login action khi thành công
        } catch (error) {
          console.error('Login failed', error);
          // Có thể dispatch thêm hành động để thông báo lỗi ra UI
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
          dispatch(logout());  // Dispatch logout action khi thành công
        } catch (error) {
          console.error('Logout failed', error);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
