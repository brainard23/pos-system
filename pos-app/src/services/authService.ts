interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

/**
 * Authenticates a user with the provided credentials
 * @param credentials - The user's login credentials
 * @returns Promise containing the authentication token and user data
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to login');
  }

  return response.json();
}

/**
 * Checks if the user is authenticated
 * @returns boolean indicating if the user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem('token');
  return !!token;
}

/**
 * Logs out the current user
 */
export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
} 