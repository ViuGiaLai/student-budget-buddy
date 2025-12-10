export type User = {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  isLoggedIn: boolean;
  isDev?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

// Mock user data for development
export const MOCK_USER: User = {
  id: 'dev-user-123',
  name: 'Viu Sinh Viên',
  email: 'dev@example.com',
  avatar: 'https://i.pravatar.cc/150?img=32',
  isLoggedIn: true,
  isDev: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export type AuthContextType = {
  user: User | null;
  login: () => Promise<void>;
  logout: () => void;
  updateUserName: (name: string) => Promise<void>;
  loading: boolean;
  error: string | null;
};
