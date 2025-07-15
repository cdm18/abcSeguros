// models/user.ts
export interface User {
  id: number;
  username: string;
  full_name: string;
  phone?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export interface UpdateProfileDto {
  full_name: string;
  phone?: string | null;
  bio?: string | null;
}

export interface UploadAvatarResponse {
  avatar_url: string;
}

export interface ApiResponse<T = any> {
  message?: string;
  error?: string;
  data?: T;
}
