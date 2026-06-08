export interface User {
  id: number;
  email: string;
  name: string;
  tag: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
