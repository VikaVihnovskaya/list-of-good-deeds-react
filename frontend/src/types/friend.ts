export interface Friend {
  id: number;
  name: string;
  tag: string;
  email: string;
}

export interface FriendsState {
  items: Friend[];
  loading: boolean;
  error: string | null;
}
