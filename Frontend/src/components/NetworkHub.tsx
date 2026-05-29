/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  UserCheck, 
  UserX, 
  Send, 
  Search, 
  SlidersHorizontal, 
  Share2, 
  Trash2,
  Smile,
  ShieldCheck,
  Check
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { NetworkConnection } from '../types';

interface NetworkHubProps {
  pendingInvitations: NetworkConnection[];
  activeConnections: NetworkConnection[];
  onAcceptInvitation: (id: string) => void | Promise<void>;
  onIgnoreInvitation: (id: string) => void | Promise<void>;
  onRemoveConnection: (id: string) => void;
  triggerToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export function NetworkHub({
  pendingInvitations,
  activeConnections,
  onAcceptInvitation,
  onIgnoreInvitation,
  onRemoveConnection,
  triggerToast,
}: NetworkHubProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'connections'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConnectionForMenu, setSelectedConnectionForMenu] = useState<string | null>(null);

  // Message compose modal block
  const [composingMessageUser, setComposingMessageUser] = useState<NetworkConnection | null>(null);
  const [composedMessageText, setComposedMessageText] = useState('');

  const displayPending = pendingInvitations;
  const filteredConnections = activeConnections.filter((conn) =>
    conn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conn.headline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composedMessageText.trim()) return;

    triggerToast(`Direct message packet routed to ${composingMessageUser?.name}`, 'success');
    setComposingMessageUser(null);
    setComposedMessageText('');
  };

  return (
    <div id="network-hub-routing" className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Upper overview header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h2 className="font-display text-2xl font-bold text-white tracking-tight">Professional Lattice</h2>
          <p className="text-slate-400 text-sm mt-1">Accept secure link protocols or synchronize with existing network nodes.</p>
        </div>

        {/* Stats segment */}
        <div className="flex items-center gap-6">
          <div className="text-left font-display">
            <span className="text-[10px] font-mono uppercase text-slate-500 block leading-none">Connections</span>
            <span className="text-2xl font-bold text-cyan-aurora font-mono leading-none mt-1.5 block">{activeConnections.length}</span>
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div className="text-left font-display">
            <span className="text-[10px] font-mono uppercase text-slate-500 block leading-none">Pending Requests</span>
            <span className="text-2xl font-bold text-indigo-aurora font-mono leading-none mt-1.5 block">{pendingInvitations.length}</span>
          </div>
        </div>
      </div>

      {/* Message Compose Dialog / Modal */}
      {composingMessageUser && (
        <div id="direct-messaging-modal" className="fixed inset-0 bg-[#060911]/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-obsidian-900 border border-white/10 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-cyan-aurora via-indigo-aurora to-transparent" />
            
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={composingMessageUser.avatar} 
                alt={composingMessageUser.name} 
                className="w-10 h-10 rounded-xl object-cover bg-obsidian-950"
              />
              <div>
                <h4 className="font-bold text-slate-100 font-display leading-tight">{composingMessageUser.name}</h4>
                <p className="text-xs text-slate-400 line-clamp-1">{composingMessageUser.headline}</p>
              </div>
            </div>

            <form onSubmit={handleSendMessageSubmit} className="space-y-4">
              <textarea
                value={composedMessageText}
                onChange={(e) => setComposedMessageText(e.target.value)}
                placeholder="Compose secure encrypted packet payload..."
                rows={4}
                className="w-full bg-obsidian-850 border border-white/10 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-aurora/50 focus:ring-0"
                required
              />

              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>VERIFIED_ROUTING: direct-aes256</span>
                <span>Active Link</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setComposingMessageUser(null)}
                  className="px-4 py-2 border border-white/10 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  Abstain
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold glow-btn text-white flex items-center gap-1.5"
                >
                  <span>Dispatch Link</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs and Searching bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Hub Tab buttons */}
        <div className="flex p-0.5 rounded-xl bg-obsidian-900 border border-white/5 w-fit">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-2 px-5 text-xs font-semibold rounded-lg font-display transition-all relative ${
              activeTab === 'pending'
                ? 'bg-cyan-aurora/10 text-cyan-aurora border border-cyan-aurora/20 shadow-inner'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pending Invitations ({pendingInvitations.length})
            {pendingInvitations.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 rounded-full bg-indigo-aurora animate-pulse" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('connections')}
            className={`py-2 px-5 text-xs font-semibold rounded-lg font-display transition-all relative ${
              activeTab === 'connections'
                ? 'bg-cyan-aurora/10 text-cyan-aurora border border-cyan-aurora/20 shadow-inner'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            My Connections ({activeConnections.length})
          </button>
        </div>

        {/* Searching tool and slider details */}
        {activeTab === 'connections' && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, headline..."
                className="bg-obsidian-900 border border-white/5 pl-9 pr-4 py-2 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-aurora/50 focus:ring-0 w-full sm:w-64"
              />
            </div>
            
            <button 
              onClick={() => triggerToast('Tuning filters: Alphabetical ordering by default.', 'info')}
              className="p-2 border border-white/5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
              title="Search parameters configuration"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* CORE DISPLAY DECISION */}
      {activeTab === 'pending' ? (
        
        // Tab 1: Pending Invitations Grid
        <div>
          {displayPending.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayPending.map((invitation) => (
                <GlassCard key={invitation.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={invitation.avatar}
                      alt={invitation.name}
                      className="w-12 h-12 rounded-xl object-cover bg-obsidian-950"
                    />
                    <div>
                      <h4 className="font-display font-bold text-slate-100 text-sm leading-tight">{invitation.name}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{invitation.headline}</p>
                      <span className="text-[10px] font-mono text-slate-500 block mt-1">{invitation.mutualCount} mutual connection points</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    {/* Accept Action */}
                    <button
                      onClick={() => {
                        onAcceptInvitation(invitation.id);
                        triggerToast(`Link successfully forged with ${invitation.name}.`, 'success');
                      }}
                      className="flex-1 sm:flex-none py-2 px-3.5 bg-gradient-to-r from-cyan-500/20 to-cyan-400/10 border border-cyan-400/30 hover:border-cyan-450 rounded-xl text-xs text-cyan-300 hover:text-cyan-200 font-semibold font-display flex items-center justify-center gap-1.5 transition-all select-none cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      Accept
                    </button>

                    {/* Ignore action */}
                    <button
                      onClick={() => {
                        onIgnoreInvitation(invitation.id);
                        triggerToast(`Invitation sidelined.`, 'info');
                      }}
                      className="flex-1 sm:flex-none py-2 px-3.5 border border-red-500/20 hover:bg-red-950/10 rounded-xl text-xs text-red-400 hover:text-red-300 font-semibold font-display flex items-center justify-center gap-1.5 transition-all select-none cursor-pointer"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      Ignore
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl bg-obsidian-900/20 border border-dashed border-white/5 space-y-3">
              <Smile className="w-10 h-10 text-slate-500 mx-auto" />
              <h4 className="font-display font-semibold text-slate-200 text-sm">No Pending Link Requests</h4>
              <p className="text-slate-400 text-xs max-w-sm mx-auto">Your connection pipelines are tidy. We will alert you immediately when candidates register link requests.</p>
            </div>
          )}
        </div>

      ) : (

        // Tab 2: Existing Connections Responsive Grid
        <div>
          {filteredConnections.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConnections.map((conn) => (
                <GlassCard key={conn.id} className="relative group hover:border-cyan-aurora/35 transition-all duration-300">
                  {/* Subtle corner highlight */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ShieldCheck className="w-4 h-4 text-cyan-aurora" />
                  </div>

                  <div className="flex flex-col items-center text-center p-2">
                    <img
                      src={conn.avatar}
                      alt={conn.name}
                      className="w-16 h-16 rounded-2xl object-cover bg-obsidian-950 border border-white/10 shadow-lg mb-4.5"
                    />

                    <h4 className="font-display font-bold text-slate-100 text-sm leading-tight">{conn.name}</h4>
                    <p className="text-[11px] text-slate-400 leading-normal line-clamp-2 h-8 mt-1.5 font-sans">{conn.headline}</p>

                    <div className="mt-4 flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-mono text-slate-400">
                      <Share2 className="w-3 h-3 text-cyan-aurora" />
                      <span>{conn.mutualCount} Common nodes</span>
                    </div>

                    {/* Dual Action CTA Buttons row */}
                    <div className="mt-6 grid grid-cols-2 gap-2.5 w-full pt-4 border-t border-white/5">
                      <button
                        onClick={() => setComposingMessageUser(conn)}
                        className="py-2 rounded-xl bg-cyan-aurora/15 border border-cyan-aurora/30 text-cyan-300 hover:text-cyan-200 text-xs font-semibold font-display flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Message
                      </button>

                      <button
                        onClick={() => {
                          onRemoveConnection(conn.id);
                          triggerToast(`Lattice connection severed with ${conn.name}`, 'info');
                        }}
                        className="py-2 border border-white/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 hover:bg-red-950/15 text-xs font-semibold font-display flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Decouple
                      </button>
                    </div>

                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl bg-obsidian-900/20 border border-dashed border-white/5 space-y-3">
              <Smile className="w-10 h-10 text-slate-500 mx-auto" />
              <h4 className="font-display font-semibold text-slate-200 text-sm">No Grid Connections Resolved</h4>
              <p className="text-slate-400 text-xs max-w-sm mx-auto">No nodes match your specified filters. Clear or adjust search string inputs and try again.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
