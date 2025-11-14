// Server exports (for Server Components and Server Actions)
export { getUser, signIn, signUp, signOut } from './server';

// Client exports (for Client Components)
export { useAuthQuery } from './queries';
export { useSignInMutation, useSignUpMutation, useSignOutMutation } from './mutations';

// Type exports
export type { AuthUser, SignInCredentials, SignUpCredentials, AuthSession } from './types';
