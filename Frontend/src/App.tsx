/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  getAvatarSvg, 
  INITIAL_PROFILE, 
  INITIAL_POSTS, 
  INITIAL_NETWORK_SUGGESTIONS, 
  INITIAL_PENDING_INVITATIONS, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { UserProfile, Post, NetworkConnection, SystemNotification } from './types';
import { AuthHub } from './components/AuthHub';
import { Navbar } from './components/Navbar';
import { HomeFeed } from './components/HomeFeed';
import { NetworkHub } from './components/NetworkHub';
import { ProfileDetails } from './components/ProfileDetails';
import { NotificationsCenter } from './components/NotificationsCenter';
import { CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { clearSession, getCurrentUserId, getStoredUser, getToken, setSession } from './lib/auth';
import { authService } from './services/authService';
import { connectionService } from './services/connectionService';
import { postService } from './services/postService';
import type { ApiUser, BackendPost, Person } from './types';

const formatNameFromEmail = (email: string) =>
  email.split('@')[0].split(/[._-]/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ') || 'CareerLink Member';

const apiMessage = (error: unknown) =>
  error && typeof error === 'object' && 'message' in error
    ? String((error as { message: string }).message)
    : 'Something went wrong. Please try again.';

export default function App() {
  const [token, setToken] = useState<string | null>(() => getToken());
  const [apiUser, setApiUser] = useState<ApiUser | null>(() => getStoredUser());
  const currentUserId = getCurrentUserId();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return Boolean(getToken()) || localStorage.getItem('careerlink_is_logged_in') === 'true';
  });

  const [activeTab, setActiveTab ] = useState<'feed' | 'network' | 'profile' | 'notifications'>(() => {
    return (localStorage.getItem('careerlink_active_tab') as any) || 'feed';
  });

  // Core Orchestrated State Lists
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('careerlink_user_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('careerlink_posts_feed');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [networkSuggestions, setNetworkSuggestions] = useState<NetworkConnection[]>(() => {
    const saved = localStorage.getItem('careerlink_network_suggestions');
    return saved ? JSON.parse(saved) : INITIAL_NETWORK_SUGGESTIONS;
  });

  const [pendingInvitations, setPendingInvitations] = useState<NetworkConnection[]>(() => {
    const saved = localStorage.getItem('careerlink_pending_invitations');
    return saved ? JSON.parse(saved) : INITIAL_PENDING_INVITATIONS;
  });

  const [activeConnections, setActiveConnections] = useState<NetworkConnection[]>(() => {
    const saved = localStorage.getItem('careerlink_active_connections');
    if (saved) return JSON.parse(saved);
    // Build initial connected list representing other users
    return [
      {
        id: 'conn_1',
        name: 'Sarah Jenkins',
        headline: 'Director of Talent at MetaStream',
        avatar: getAvatarSvg('Sarah Jenkins', 6),
        mutualCount: 14,
        status: 'connected',
      },
      {
        id: 'conn_2',
        name: 'Marcus Vance',
        headline: 'Staff UX Advocate',
        avatar: getAvatarSvg('Marcus Vance', 3),
        mutualCount: 29,
        status: 'connected',
      }
    ];
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('careerlink_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Global Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Synchronise state lists to localStorage when updated
  useEffect(() => {
    localStorage.setItem('careerlink_is_logged_in', String(isLoggedIn));
    localStorage.setItem('careerlink_active_tab', activeTab);
    localStorage.setItem('careerlink_user_profile', JSON.stringify(userProfile));
    localStorage.setItem('careerlink_posts_feed', JSON.stringify(posts));
    localStorage.setItem('careerlink_network_suggestions', JSON.stringify(networkSuggestions));
    localStorage.setItem('careerlink_pending_invitations', JSON.stringify(pendingInvitations));
    localStorage.setItem('careerlink_active_connections', JSON.stringify(activeConnections));
    localStorage.setItem('careerlink_notifications', JSON.stringify(notifications));
  }, [isLoggedIn, activeTab, userProfile, posts, networkSuggestions, pendingInvitations, activeConnections, notifications]);

  useEffect(() => {
    if (!token || !currentUserId) return;

    let isCancelled = false;
    const loadDashboard = async () => {
      try {
        const [backendPosts, backendConnections] = await Promise.all([
          postService.getUserPosts(currentUserId),
          connectionService.firstDegree(currentUserId),
        ]);
        if (isCancelled) return;
        setPosts(backendPosts.sort((a, b) => (b.id ?? 0) - (a.id ?? 0)).map(mapBackendPost));
        setActiveConnections(backendConnections.map(mapPerson));
        setUserProfile((prev) => ({
          ...prev,
          connectionsCount: backendConnections.length,
        }));
      } catch (error) {
        if (!isCancelled) triggerToast(apiMessage(error), 'error');
      }
    };

    void loadDashboard();
    return () => {
      isCancelled = true;
    };
  }, [token, currentUserId]);

  const triggerToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const applyApiUserToProfile = (user: ApiUser | null, fallbackEmail?: string) => {
    const name = user?.name || (fallbackEmail ? formatNameFromEmail(fallbackEmail) : userProfile.name);
    setUserProfile((prev) => ({
      ...prev,
      id: user?.id ? String(user.id) : prev.id,
      name,
      avatar: getAvatarSvg(name, user?.id ?? 14),
    }));
  };

  const mapBackendPost = (post: BackendPost): Post => ({
    id: String(post.id),
    authorName: post.userId === currentUserId ? userProfile.name : `Member #${post.userId}`,
    authorHeadline: post.userId === currentUserId ? userProfile.headline : 'CareerLink Member',
    authorAvatar: getAvatarSvg(`Member ${post.userId}`, post.userId),
    timestamp: post.createdAt ? new Date(post.createdAt).toLocaleString() : 'just now',
    content: post.content,
    image: post.imageUrl,
    likesCount: 0,
    hasLiked: false,
    comments: [],
  });

  const mapPerson = (person: Person): NetworkConnection => ({
    id: String(person.userId ?? person.id),
    name: person.name,
    headline: `CareerLink member #${person.userId ?? person.id}`,
    avatar: getAvatarSvg(person.name, person.userId ?? person.id),
    mutualCount: 0,
    status: 'connected',
  });

  const handleSignIn = async (email: string, password: string) => {
    try {
      const nextToken = await authService.login({ email, password });
      const storedUser = getStoredUser();
      setSession(nextToken, storedUser ?? undefined);
      setToken(nextToken);
      setApiUser(storedUser);
      applyApiUserToProfile(storedUser, email);
    } catch (error) {
      throw new Error(apiMessage(error));
    }
    setIsLoggedIn(true);
    setActiveTab('feed');
    triggerToast('Session authenticated successfully.', 'success');
  };

  const handleSignUp = async (name: string, email: string, password: string) => {
    try {
      const newUser = await authService.signup({ name, email, password });
      const nextToken = await authService.login({ email, password });
      setSession(nextToken, newUser);
      setToken(nextToken);
      setApiUser(newUser);
      applyApiUserToProfile(newUser, email);
    } catch (error) {
      throw new Error(apiMessage(error));
    }
    setIsLoggedIn(true);
    setActiveTab('feed');
  };

  const handleLogout = () => {
    clearSession();
    setToken(null);
    setApiUser(null);
    setIsLoggedIn(false);
    triggerToast('Secure platform session closed.', 'info');
  };

  // HANDLER: Liking Chronology Post
  const handleLikePost = async (postId: string) => {
    const target = posts.find((post) => post.id === postId);
    if (target && Number.isFinite(Number(postId))) {
      try {
        if (target.hasLiked) {
          await postService.unlike(Number(postId));
        } else {
          await postService.like(Number(postId));
        }
      } catch (error) {
        triggerToast(apiMessage(error), 'error');
        return;
      }
    }

    const updated = posts.map((post) => {
      if (post.id === postId) {
        const nextLiked = !post.hasLiked;
        return {
          ...post,
          hasLiked: nextLiked,
          likesCount: nextLiked ? post.likesCount + 1 : post.likesCount - 1,
        };
      }
      return post;
    });
    setPosts(updated);
  };

  // HANDLER: Comment committing
  const handleAddComment = (postId: string, commentContent: string) => {
    const newComment = {
      id: `comment_${Date.now()}`,
      authorName: userProfile.name,
      authorHeadline: userProfile.headline,
      authorAvatar: userProfile.avatar,
      content: commentContent,
      timestamp: 'just now',
    };

    const updated = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      }
      return post;
    });
    setPosts(updated);
  };

  // HANDLER: Suggest connect fast button click
  const handleConnectSuggest = async (suggestId: string) => {
    const selected = networkSuggestions.find((suggest) => suggest.id === suggestId);
    const targetUserId = Number(selected?.id.replace(/\D/g, '')) || Number(selected?.id);
    if (selected && Number.isFinite(targetUserId)) {
      try {
        await connectionService.request(targetUserId);
      } catch (error) {
        triggerToast(apiMessage(error), 'error');
        return;
      }
    }

    // Transition suggest list
    const updatedSuggests = networkSuggestions.map((suggest) => {
      if (suggest.id === suggestId) {
        const nextStatus = suggest.status === 'none' ? 'pending' : 'none';
        
        // If they became pending, increment total connection counts to simulate activity
        if (nextStatus === 'pending') {
          triggerToast(`Lattice invite packets dispatched to ${suggest.name}.`, 'success');
        }
        return { ...suggest, status: nextStatus };
      }
      return suggest;
    });
    setNetworkSuggestions(updatedSuggests);
  };

  // HANDLER: Dispatched visual post additions
  const handleAddPost = async (content: string, imageUrl?: string, file?: File) => {
    if (token) {
      if (!file) {
        triggerToast('Attach a local image file before posting. The backend post service requires multipart media.', 'error');
        return;
      }

      try {
        const created = await postService.create(content, file);
        setPosts([mapBackendPost(created), ...posts]);
        triggerToast('Post dispatched successfully to backend services.', 'success');
      } catch (error) {
        triggerToast(apiMessage(error), 'error');
      }
      return;
    }

    const newPost: Post = {
      id: `post_${Date.now()}`,
      authorName: userProfile.name,
      authorHeadline: userProfile.headline,
      authorAvatar: userProfile.avatar,
      timestamp: 'just now',
      content: content,
      image: imageUrl,
      likesCount: 0,
      hasLiked: false,
      comments: [],
    };

    // Prepend to top of chronological list
    setPosts([newPost, ...posts]);
  };

  // HANDLER: Profile Updates
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  // HANDLER: Connections Pending Accept
  const handleAcceptInvitation = async (invitationId: string) => {
    // Locate in pending list
    const found = pendingInvitations.find((item) => item.id === invitationId);
    if (!found) return;

    const targetUserId = Number(invitationId.replace(/\D/g, '')) || Number(invitationId);
    if (token && Number.isFinite(targetUserId)) {
      try {
        await connectionService.accept(targetUserId);
      } catch (error) {
        triggerToast(apiMessage(error), 'error');
        return;
      }
    }

    // Filter pending
    setPendingInvitations(pendingInvitations.filter((item) => item.id !== invitationId));
    
    // Add to active connections list
    const newlyConnected: NetworkConnection = {
      ...found,
      status: 'connected',
    };
    setActiveConnections([newlyConnected, ...activeConnections]);
    
    // Update active connections count
    setUserProfile((prev) => ({
      ...prev,
      connectionsCount: prev.connectionsCount + 1,
    }));

    // Mark corresponding notification as read if visible
    setNotifications(prev =>
      prev.map(n => n.sender?.name === found.name ? { ...n, unread: false } : n)
    );
  };

  // HANDLER: Ignore Pending Invitation
  const handleIgnoreInvitation = async (invitationId: string) => {
    const targetUserId = Number(invitationId.replace(/\D/g, '')) || Number(invitationId);
    if (token && Number.isFinite(targetUserId)) {
      try {
        await connectionService.reject(targetUserId);
      } catch (error) {
        triggerToast(apiMessage(error), 'error');
        return;
      }
    }
    setPendingInvitations(pendingInvitations.filter((item) => item.id !== invitationId));
  };

  // HANDLER: De-couple connection grid item
  const handleRemoveConnection = (connectionId: string) => {
    setActiveConnections(activeConnections.filter((item) => item.id !== connectionId));
    setUserProfile((prev) => ({
      ...prev,
      connectionsCount: Math.max(0, prev.connectionsCount - 1),
    }));
  };

  // HANDLER: Read single notification dot
  const handleMarkRead = (id: string) => {
    setNotifications(
      notifications.map((notif) => (notif.id === id ? { ...notif, unread: false } : notif))
    );
  };

  // HANDLER: Mark all notifications read
  const handleMarkAllRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, unread: false }))
    );
  };

  // HANDLER: Flush single notification item
  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  // Determine unread notification badges
  const unreadCount = notifications.filter((notif) => notif.unread).length;

  if (!isLoggedIn) {
    return <AuthHub onSignIn={handleSignIn} onSignUp={handleSignUp} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-obsidian-950 text-slate-200 selection:bg-cyan-aurora/10 selection:text-cyan-aurora">
      
      {/* Global Glassmorphic Toast banner feedback */}
      {toast && (
        <div 
          id="global-toast-notif shadow-2xl" 
          className="fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl glass-panel border-cyan-aurora/30 shadow-[0_0_25px_rgba(6,182,212,0.18)] max-w-sm animate-bounce"
        >
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-cyan-aurora shrink-0" />}
          {toast.type === 'error' && <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />}
          {toast.type === 'info' && <Sparkles className="w-5 h-5 text-indigo-aurora shrink-0" />}
          
          <div className="flex-1 text-xs font-semibold text-slate-150">
            {toast.message}
          </div>
          
          <button 
            type="button" 
            onClick={() => setToast(null)}
            className="text-xs text-slate-400 hover:text-slate-100 font-sans ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Glass Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          // Auto scroll back to top of document during tab switches
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        unreadNotifications={unreadCount}
        userAvatar={userProfile.avatar}
        userName={userProfile.name}
        userHeadline={userProfile.headline}
        onLogout={handleLogout}
      />

      {/* Primary Dynamic Main Body */}
      <main id="primary-careerlink-routing" className="flex-1 pb-16 pt-3 animate-fade-in">
        {activeTab === 'feed' && (
          <HomeFeed
            userProfile={userProfile}
            posts={posts}
            networkSuggestions={networkSuggestions}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
            onConnectSuggest={handleConnectSuggest}
            onAddPost={handleAddPost}
            onViewProfileLink={() => {
              setActiveTab('profile');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            triggerToast={triggerToast}
          />
        )}

        {activeTab === 'network' && (
          <NetworkHub
            pendingInvitations={pendingInvitations}
            activeConnections={activeConnections}
            onAcceptInvitation={handleAcceptInvitation}
            onIgnoreInvitation={handleIgnoreInvitation}
            onRemoveConnection={handleRemoveConnection}
            triggerToast={triggerToast}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileDetails
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            triggerToast={triggerToast}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationsCenter
            notifications={notifications}
            onMarkRead={handleMarkRead}
            onMarkAllRead={handleMarkAllRead}
            onDeleteNotification={handleDeleteNotification}
            triggerToast={triggerToast}
          />
        )}
      </main>

      {/* Sticky footer block */}
      <footer className="glass-panel border-t border-obsidian-700/60 py-6 px-6 mt-12 bg-obsidian-950/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-2 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="font-bold text-slate-150 tracking-wide font-display">Career<span className="text-cyan-aurora">Link</span></span>
            <span className="text-slate-400">•</span>
            <span>The Professional Networking Interface for Innovators</span>
          </div>
          <div>
            <span className="font-mono text-[10px] text-slate-500">© {new Date().getFullYear()} CareerLink. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
