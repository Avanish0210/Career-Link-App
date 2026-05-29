import type { ApiUser, LoginRequest, SignupRequest } from '../types';
import { apiRequest } from './http';

export const authService = {
  signup(payload: SignupRequest) {
    return apiRequest<ApiUser>(
      '/api/v1/users/auth/signup',
      { method: 'POST', body: JSON.stringify(payload) },
      false
    );
  },
  login(payload: LoginRequest) {
    return apiRequest<string>(
      '/api/v1/users/auth/login',
      { method: 'POST', body: JSON.stringify(payload) },
      false
    );
  },
};
