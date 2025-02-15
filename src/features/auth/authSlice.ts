import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
import { UserData, AuthState } from '../../types/auth'

// Lấy userData từ Cookies
const userData: UserData | null = Cookies.get('userData')
  ? JSON.parse(Cookies.get('userData') as string)
  : null

const initialState: AuthState = {
  userData,
  userToken: null, // Không lưu token vào localStorage nữa
  isAuthenticated: !!userData,
  isLoading: false,
}

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    login: (state, action: PayloadAction<{ accessToken: string }>) => {
      const { accessToken } = action.payload
      const decodedToken: any = jwtDecode(accessToken)

      state.userData = {
        email: decodedToken.sub,
        id: decodedToken.id,
        role: decodedToken.role,
        name: decodedToken.name,
        avatar: decodedToken.avatar,
      }

      state.userToken = { token: accessToken, refreshToken: '' } // Chỉ lưu Access Token tạm thời
      state.isAuthenticated = true

      // ✅ Lưu userData vào Cookies thay vì localStorage
      Cookies.set('userData', JSON.stringify(state.userData), { expires: 7 }) // Cookies có hạn 7 ngày
    },
    logout: (state) => {
      state.userData = null
      state.userToken = null
      state.isAuthenticated = false

      // ✅ Xóa userData trong Cookies
      Cookies.remove('userData')
    },
    refreshToken: (state, action: PayloadAction<string>) => {
      state.userToken = {
        token: action.payload,
        refreshToken: state.userToken?.refreshToken || '',
      }
    },
  },
})

export const { login, logout, refreshToken, setLoading } = authSlice.actions
export default authSlice.reducer
