import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { UserData, AuthState } from "../../types/auth";

interface DecodedToken {
  sub: string;
  id: string;
  role: string;
  name?: string; 
  avatar?: string; 
}

const getUserDataFromCookies = (): UserData | null => {
  try {
    const cookieData = Cookies.get("userData");
    return cookieData ? JSON.parse(cookieData) : null;
  } catch (error) {
    console.error("Error parsing userData from cookies:", error);
    return null;
  }
};

const userData: UserData | null = getUserDataFromCookies();

const initialState: AuthState = {
  userData,
  userToken: null, 
  isAuthenticated: !!userData,
  isLoading: false,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    login: (state, action: PayloadAction<{ accessToken: string }>) => {
      const { accessToken } = action.payload;

      try {

        const decodedToken: DecodedToken = jwtDecode(accessToken);

        state.userData = {
          email: decodedToken.sub,
          id: decodedToken.id,
          role: decodedToken.role,
          name: decodedToken.name || "",
          avatar: decodedToken.avatar || "",
        };

        state.userToken = { token: accessToken, refreshToken: "" }; 
        state.isAuthenticated = true;

        Cookies.set("userData", JSON.stringify(state.userData), { expires: 7 });
      } catch (error) {
        console.error("Invalid token:", error);
      }
    },
    logout: (state) => {
      state.userData = null;
      state.userToken = null;
      state.isAuthenticated = false;

      Cookies.remove("userData");

      Cookies.remove("accessToken"); 
      Cookies.remove("refreshToken");
    },
    refreshToken: (state, action: PayloadAction<string>) => {
      if (state.userToken) {
        state.userToken.refreshToken = action.payload;
      }
    },
  },
});

export const { login, logout, refreshToken, setLoading } = authSlice.actions;
export default authSlice.reducer;
