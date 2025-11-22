export interface SecretCreateRequest {
  message: string;
  password?: string;
  expiresIn?: string;
  maxViews?: number;
}

export interface SecretCreateResponse {
  success: boolean;
  secretId: string;
  accessToken: string;
  expiresAt: string;
  url: string;
  message: string;
}

export interface SecretViewResponse {
  success: boolean;
  message: string;
  viewsRemaining: number;
  isActive: boolean;
  viewedAt: string;
}

export interface SecretValidateResponse {
  exists: boolean;
  requiresPassword?: boolean;
  viewsRemaining?: number;
  expiresAt?: string;
  maxViews?: number;
  viewCount?: number;
  error?: string;
}

export interface ApiError {
  error: string;
  success?: boolean;
}