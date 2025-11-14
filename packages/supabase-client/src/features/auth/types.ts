/**
 * Authenticated user information
 */
export interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
}

/**
 * Sign in credentials
 */
export interface SignInCredentials {
  email: string;
  password: string;
}

/**
 * Sign up credentials
 */
export interface SignUpCredentials {
  email: string;
  password: string;
}

/**
 * Auth session information
 */
export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}
