/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Experience {
  id: string;
  role: string;
  company: string;
  logoUrl?: string;
  startDate: string;
  endDate: string; // "Present" or date
  description: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  headline: string;
  bio: string;
  location: string;
  avatar: string; // svg string or url
  banner: string; // gradient CSS or image
  connectionsCount: number;
  experience: Experience[];
  skills: string[];
}

export interface Comment {
  id: string;
  authorName: string;
  authorHeadline: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  authorName: string;
  authorHeadline: string;
  authorAvatar: string;
  timestamp: string;
  content: string;
  image?: string;
  likesCount: number;
  hasLiked: boolean;
  comments: Comment[];
}

export interface NetworkConnection {
  id: string;
  name: string;
  headline: string;
  avatar: string;
  mutualCount: number;
  status: 'pending' | 'connected' | 'none';
}

export interface SystemNotification {
  id: string;
  type: 'like' | 'comment' | 'connection_request' | 'system';
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
  sender?: {
    name: string;
    avatar: string;
    headline: string;
  };
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest extends LoginRequest {
  name: string;
}

export interface BackendPost {
  id: number;
  content: string;
  userId: number;
  createdAt?: string;
  imageUrl?: string;
}

export interface Person {
  id: number;
  userId: number;
  name: string;
}

export interface ApiError {
  status?: number;
  message: string;
  path?: string;
}
