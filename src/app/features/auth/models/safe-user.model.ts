/**
 * Safe User model for localStorage
 * Contains only non-sensitive user information needed for UX
 * Never store passwords, addresses, phone, or personal details in browser storage
 */
export interface SafeUser {
  userId: number;
  userName: string;
  email: string;
  company?: string;
}

/**
 * Utility function to extract safe user data from full user object
 */
export function extractSafeUser(user: any): SafeUser {
  return {
    userId: user.userId,
    userName: user.userName,
    email: user.email,
    company: user.company
  };
}
