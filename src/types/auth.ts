export interface UserToken {
  token: string
  refreshToken: string
}

export interface UserData {
  email: string
  id: string
  role: string
  name: string
  avatar: string
}

export interface AuthState {
  userData: UserData | null
  userToken: UserToken | null
  isAuthenticated: boolean
  isLoading: boolean
}
