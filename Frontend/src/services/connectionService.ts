import type { Person } from '../types';
import { apiRequest } from './http';

export const connectionService = {
  firstDegree(userId: number) {
    return apiRequest<Person[]>(`/api/v1/connections/core/${userId}/first-degree`);
  },
  request(userId: number) {
    return apiRequest<void>(`/api/v1/connections/core/request/${userId}`, {
      method: 'POST',
    });
  },
  accept(userId: number) {
    return apiRequest<void>(`/api/v1/connections/core/accept/${userId}`, {
      method: 'POST',
    });
  },
  reject(userId: number) {
    return apiRequest<void>(`/api/v1/connections/core/reject/${userId}`, {
      method: 'POST',
    });
  },
};
