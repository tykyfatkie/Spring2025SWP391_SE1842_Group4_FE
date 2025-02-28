import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { UserData, AuthState } from '../../types/auth';
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';


// Type for decoded token (customize it based on your token structure)
interface DecodedToken {
  sub: string;
  id: string;
  role: string;
  name?: string; // Optional
  avatar?: string; // Optional
}

// Get userData from cookies
const userData: UserData | null = Cookies.get('userData')
  ? JSON.parse(Cookies.get('userData') as string)
  : null;

const initialState: AuthState = {
  userData,
  userToken: null, // Do not store token in localStorage anymore
  isAuthenticated: !!userData,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    login: (state, action: PayloadAction<{ accessToken: string }>) => {
      const { accessToken } = action.payload;

      // Decode the JWT token
      const decodedToken: DecodedToken = jwtDecode(accessToken);

      // Populate the state with decoded token data
      state.userData = {
        email: decodedToken.sub,
        id: decodedToken.id,
        role: decodedToken.role,
        name: decodedToken.name || '', // Optional fallback
        avatar: decodedToken.avatar || '', // Optional fallback
      };

      // Store access token in the state (refresh token can be added here if needed)
      state.userToken = { token: accessToken, refreshToken: '' }; // Store only the access token for now
      state.isAuthenticated = true;

      // Store user data in cookies with a 7-day expiration
      Cookies.set('userData', JSON.stringify(state.userData), { expires: 7 });
    },
    logout: (state) => {
      state.userData = null;
      state.userToken = null;
      state.isAuthenticated = false;

      // Remove user data from cookies
      Cookies.remove('userData');
    },
    refreshToken: (state, action: PayloadAction<string>) => {
      // Assuming the new refresh token is provided
      state.userToken = {
        token: state.userToken?.token || '', // Retain the current token
        refreshToken: action.payload, // Store the new refresh token
      };
    },
  },
});


export const { login, logout, refreshToken, setLoading } = authSlice.actions;
export default authSlice.reducer;