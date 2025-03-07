import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { UserData, AuthState } from "../../types/auth";

// Type for decoded token (customize it based on your token structure)
interface DecodedToken {
  sub: string;
  id: string;
  role: string;
  name?: string; // Optional
  avatar?: string; // Optional
}

// Function to safely get and parse cookies
const getUserDataFromCookies = (): UserData | null => {
  try {
    const cookieData = Cookies.get("userData");
    return cookieData ? JSON.parse(cookieData) : null;
  } catch (error) {
    console.error("Error parsing userData from cookies:", error);
    return null;
  }
};

// Get userData from cookies safely
const userData: UserData | null = getUserDataFromCookies();

const initialState: AuthState = {
  userData,
  userToken: null, // Do not store token in localStorage anymore
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
        // Decode the JWT token safely
        const decodedToken: DecodedToken = jwtDecode(accessToken);

        // Populate the state with decoded token data
        state.userData = {
          email: decodedToken.sub,
          id: decodedToken.id,
          role: decodedToken.role,
          name: decodedToken.name || "", // Optional fallback
          avatar: decodedToken.avatar || "", // Optional fallback
        };

        // Store access token in the state (refresh token can be added here if needed)
        state.userToken = { token: accessToken, refreshToken: "" }; // Store only the access token for now
        state.isAuthenticated = true;

        // Store user data in cookies with a 7-day expiration (Avoid storing tokens!)
        Cookies.set("userData", JSON.stringify(state.userData), { expires: 7 });
      } catch (error) {
        console.error("Invalid token:", error);
      }
    },
    logout: (state) => {
      state.userData = null;
      state.userToken = null;
      state.isAuthenticated = false;

      // Remove user data from cookies
      Cookies.remove("userData");

      // Optionally clear all auth-related cookies
      Cookies.remove("accessToken"); 
      Cookies.remove("refreshToken");
    },
    refreshToken: (state, action: PayloadAction<string>) => {
      // Assuming the new refresh token is provided
      if (state.userToken) {
        state.userToken.refreshToken = action.payload;
      }
    },
  },
});

export const { login, logout, refreshToken, setLoading } = authSlice.actions;
export default authSlice.reducer;
