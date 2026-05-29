import type { BackendPost } from '../types';
import { apiRequest } from './http';

export const postService = {
  getById(postId: number) {
    return apiRequest<BackendPost>(`/api/v1/posts/core/${postId}`);
  },
  getUserPosts(userId: number) {
    return apiRequest<BackendPost[]>(`/api/v1/posts/core/users/${userId}/allPosts`);
  },
  create(content: string, file: File) {
    const formData = new FormData();
    formData.append(
      'post',
      new Blob([JSON.stringify({ content })], { type: 'application/json' })
    );
    formData.append('file', file);
    return apiRequest<BackendPost>('/api/v1/posts/core', {
      method: 'POST',
      body: formData,
    });
  },
  like(postId: number) {
    return apiRequest<void>(`/api/v1/posts/likes/${postId}`, { method: 'POST' });
  },
  unlike(postId: number) {
    return apiRequest<void>(`/api/v1/posts/likes/${postId}`, { method: 'DELETE' });
  },
};
