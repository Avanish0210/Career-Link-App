/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bell, 
  Heart, 
  MessageSquare, 
  UserPlus, 
  Shield, 
  Trash2, 
  Check, 
  Sparkles,
  Calendar,
  XCircle,
  Eye
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { SystemNotification } from '../types';

interface NotificationsCenterProps {
  notifications: SystemNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDeleteNotification: (id: string) => void;
  triggerToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export function NotificationsCenter({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDeleteNotification,
  triggerToast,
}: NotificationsCenterProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'connections' | 'interactions'>('all');

  // Filter notifications based on tab
  const filteredNotifications = notifications.filter((notif) => {
    if (activeFilter === 'unread') return notif.unread;
    if (activeFilter === 'connections') return notif.type === 'connection_request';
    if (activeFilter === 'interactions') return notif.type === 'like' || notif.type === 'comment';
    return true; // 'all'
  });

  const getNotificationIcon = (type: SystemNotification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-cyan-aurora fill-cyan-aurora/15" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-indigo-aurora" />;
      case 'connection_request':
        return <UserPlus className="w-4 h-4 text-[#06B6D4]" />;
      default:
        return <Shield className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleMarkRead = (id: string, unread: boolean) => {
    if (!unread) return;
    onMarkRead(id);
    triggerToast('Notification node marked as read.', 'success');
  };

  const handleMarkAllReadClick = () => {
    const unreadCount = notifications.filter(n => n.unread).length;
    if (unreadCount === 0) {
      triggerToast('All notifications are already synchronized.', 'info');
      return;
    }
    onMarkAllRead();
    triggerToast('All notification telemetry marked as read.', 'success');
  };

  return (
    <div id="notifications-routing" className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      
      {/* Header telemetry control row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h2 className="font-display text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-cyan-aurora" /> Notifications Center
          </h2>
          <p className="text-slate-400 text-sm mt-1">Review activity alerts regarding connected lattice branches.</p>
        </div>

        {/* Mark All Read CTA */}
        <button
          onClick={handleMarkAllReadClick}
          className="py-2 px-4 rounded-xl border border-white/10 hover:border-cyan-aurora/35 bg-white/5 hover:bg-white/10 text-xs font-semibold font-display text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto select-none"
        >
          <Check className="w-3.5 h-3.5 text-cyan-aurora" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter categories tabs block */}
      <div className="flex p-0.5 rounded-xl bg-obsidian-900 border border-white/5 w-fit flex-wrap gap-1">
        <button
          onClick={() => setActiveFilter('all')}
          className={`py-2 px-4 text-xs font-semibold rounded-lg font-display transition-all ${
            activeFilter === 'all'
              ? 'bg-cyan-aurora/10 text-cyan-aurora border border-cyan-aurora/20 shadow-inner'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter('unread')}
          className={`py-2 px-4 text-xs font-semibold rounded-lg font-display transition-all ${
            activeFilter === 'unread'
              ? 'bg-cyan-aurora/10 text-cyan-aurora border border-cyan-aurora/20 shadow-inner'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => setActiveFilter('connections')}
          className={`py-2 px-4 text-xs font-semibold rounded-lg font-display transition-all ${
            activeFilter === 'connections'
              ? 'bg-cyan-aurora/10 text-cyan-aurora border border-cyan-aurora/20 shadow-inner'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Connections
        </button>
        <button
          onClick={() => setActiveFilter('interactions')}
          className={`py-2 px-4 text-xs font-semibold rounded-lg font-display transition-all ${
            activeFilter === 'interactions'
              ? 'bg-cyan-aurora/10 text-cyan-aurora border border-cyan-aurora/20 shadow-inner'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Likes & comments
        </button>
      </div>

      {/* NOTIFICATIONS TIMELINE COMPONENT FEED */}
      <div id="notifications-timeline-ledger" className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleMarkRead(notif.id, notif.unread)}
              className={`glass-panel p-5 rounded-2xl relative overflow-hidden transition-all duration-300 flex items-start gap-4.5 group select-none ${
                notif.unread ? 'border-cyan-aurora/20 hover:border-cyan-aurora/40 bg-cyan-aurora/5/10 min-h-[80px]' : 'opacity-85 hover:opacity-100 min-h-[80px]'
              }`}
            >
              {/* Absolutes for top lighting */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              
              {/* Unread Glowing Dot - absolute positioned */}
              {notif.unread && (
                <div className="absolute top-6 left-3.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-aurora opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-aurora shadow-[0_0_8px_#06B6D4]"></span>
                </div>
              )}

              {/* Sender icon or system emblem */}
              <div className="relative pl-3.5">
                {notif.sender ? (
                  <div className="relative">
                    <img
                      src={notif.sender.avatar}
                      alt={notif.sender.name}
                      className="w-10 h-10 rounded-xl object-cover bg-obsidian-950 border border-white/5"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1 rounded-md bg-obsidian-900 border border-white/10 flex items-center justify-center">
                      {getNotificationIcon(notif.type)}
                    </div>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-obsidian-800 border border-white/5 flex items-center justify-center">
                    {getNotificationIcon(notif.type)}
                  </div>
                )}
              </div>

              {/* Message body specs */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-slate-100 font-display text-sm leading-tight ${notif.unread ? 'font-bold' : 'font-semibold'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[9px] font-mono text-slate-500 uppercase whitespace-nowrap">{notif.timestamp}</span>
                </div>
                
                <p className="text-xs text-slate-350 leading-relaxed mt-1 font-sans">
                  {notif.description}
                </p>

                {notif.sender && (
                  <div className="text-[10px] text-slate-500 font-display mt-1.5 truncate">
                    {notif.sender.name} • <span className="italic">{notif.sender.headline}</span>
                  </div>
                )}
              </div>

              {/* Single Clear Tool trigger */}
              <div className="absolute right-3 top-5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Stop trigger page reading mark
                    onDeleteNotification(notif.id);
                    triggerToast('Notification cleared.', 'info');
                  }}
                  className="p-1.5 rounded bg-obsidian-950/40 border border-white/5 hover:border-red-500/30 text-slate-500 hover:text-red-400 transition-all cursor-pointer"
                  title="Clear alert block"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="text-center py-16 rounded-2xl bg-obsidian-900/20 border border-dashed border-white/5 space-y-3">
            <XCircle className="w-10 h-10 text-slate-500 mx-auto" />
            <h4 className="font-display font-semibold text-slate-250 text-sm">Clear Alert Ledgers</h4>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">None of your active notification parameters returned nodes with these parameters. Check back shortly!</p>
          </div>
        )}
      </div>

      {/* Extra info metrics panel */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-2 pt-2">
        <span>POLLING LEVEL: static-memfs-v3</span>
        <span>CHANNEL: events-listener-0</span>
      </div>

    </div>
  );
}
