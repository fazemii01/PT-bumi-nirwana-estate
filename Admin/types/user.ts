export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  role: string;
  avatar: string;
}
