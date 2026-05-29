/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Share2, Home, Users, User, Bell, LogOut, Menu, X, Code } from 'lucide-react';

interface NavbarProps {
  activeTab: 'feed' | 'network' | 'profile' | 'notifications';
  onTabChange: (tab: 'feed' | 'network' | 'profile' | 'notifications') => void;
  unreadNotifications: number;
  userAvatar: string;
  userName: string;
  userHeadline: string;
  onLogout: () => void;
}

export function Navbar({
  activeTab,
  onTabChange,
  unreadNotifications,
  userAvatar,
  userName,
  userHeadline,
  onLogout,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  interface NavItem {
    id: 'feed' | 'network' | 'profile' | 'notifications';
    label: string;
    icon: any;
    badge?: number;
  }

  const navItems: NavItem[] = [
    { id: 'feed', label: 'Home Feed', icon: Home },
    { id: 'network', label: 'My Network', icon: Users },
    { id: 'profile', label: 'Profile Spec', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-obsidian-700/60 bg-obsidian-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand Segment */}
          <div 
            onClick={() => onTabChange('feed')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-aurora to-indigo-aurora p-[1px] group-hover:scale-105 transition-all duration-300">
              <div className="w-full h-full rounded-xl bg-obsidian-900 flex items-center justify-center">
                <Share2 className="w-4.5 h-4.5 text-cyan-aurora" />
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <span className="font-display font-bold text-base text-slate-150 tracking-tight group-hover:text-cyan-aurora transition-colors">
                  Career<span className="text-cyan-aurora font-light">Link</span>
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links Container */}
          <div className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`relative flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-semibold font-display transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-cyan-aurora/10 text-cyan-aurora border border-cyan-aurora/20'
                      : 'text-slate-400 hover:text-slate-150 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-aurora' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-aurora px-1 text-[9px] font-mono font-bold text-white ring-2 ring-obsidian-950">
                      {item.badge}
                    </span>
                  )}
                  
                  {isActive && (
                    <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-cyan-aurora rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right end section: Active Avatar telemetry and fast logout */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Splitter */}
            <div className="h-6 w-[1px] bg-white/10" />

            {/* Profile Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/5 transition-all text-left focus:outline-none cursor-pointer"
              >
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-8 h-8 rounded-lg border border-white/10 object-cover bg-obsidian-900"
                />
                <div className="max-w-[120px]">
                  <p className="text-xs font-semibold text-slate-100 truncate leading-none">{userName}</p>
                  <p className="text-[10px] text-slate-400 truncate leading-normal mt-0.5">{userHeadline}</p>
                </div>
              </button>

              {userDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setUserDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2.5 w-56 rounded-xl glass-panel border-white/10 bg-obsidian-800 p-2 shadow-2xl z-20">
                    <div className="px-3 py-2.5 border-b border-white/5 mb-1.5">
                      <p className="text-sm font-bold text-white font-display">{userName}</p>
                      <p className="text-xs text-slate-400 truncate">{userHeadline}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        onTabChange('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-cyan-aurora/10 rounded-lg transition-all"
                    >
                      <User className="w-3.5 h-3.5 text-cyan-aurora" />
                      View Portfolio spec
                    </button>
                    
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg transition-all"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign out session
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Direct Instant log out */}
            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-all cursor-pointer"
              title="Sign out session"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Mobile Hamburguer trigger Menu */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => {
                onTabChange('notifications');
              }}
              className="relative p-2 rounded-lg text-slate-400 hover:text-slate-100"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-indigo-aurora" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-150 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel Expansion */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-obsidian-700/60 bg-obsidian-950 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-aurora/15 text-cyan-aurora border border-cyan-aurora/20'
                    : 'text-slate-350 hover:bg-obsidian-850'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 animate-pulse" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-aurora px-1.5 text-xs font-mono font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          
          <div className="pt-4 border-t border-obsidian-700/60 space-y-3">
            <div className="flex items-center gap-3 px-2">
              <img
                src={userAvatar}
                alt={userName}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <p className="text-sm font-bold text-slate-150">{userName}</p>
                <p className="text-xs text-slate-400 truncate max-w-[200px]">{userHeadline}</p>
              </div>
            </div>
            
            <button
              onClick={() => {
                onLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut className="w-4.5 h-4.5" />
              Sign Out Session Mode
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
