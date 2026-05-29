/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Image, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  Briefcase, 
  MapPin, 
  Check, 
  Plus, 
  Send,
  X,
  FileCheck
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { UserProfile, Post, NetworkConnection } from '../types';
import { TRENDING_JOBS, TRENDING_TOPICS } from '../data/mockData';

interface HomeFeedProps {
  userProfile: UserProfile;
  posts: Post[];
  networkSuggestions: NetworkConnection[];
  onLikePost: (postId: string) => void | Promise<void>;
  onAddComment: (postId: string, commentContent: string) => void;
  onConnectSuggest: (suggestId: string) => void | Promise<void>;
  onAddPost: (content: string, imageUrl?: string, file?: File) => void | Promise<void>;
  onViewProfileLink: () => void;
  triggerToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export function HomeFeed({
  userProfile,
  posts,
  networkSuggestions,
  onLikePost,
  onAddComment,
  onConnectSuggest,
  onAddPost,
  onViewProfileLink,
  triggerToast,
}: HomeFeedProps) {
  const [newPostText, setNewPostText] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Manage simulated rich image attachment options
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedImage(reader.result as string);
        setAttachedFile(file);
        triggerToast('Professional media payload attached successfully.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPresetImage = (url: string) => {
    setAttachedImage(url);
    setAttachedFile(null);
    triggerToast('Visual asset loaded.', 'success');
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() && !attachedImage) {
      triggerToast('Cannot dispatch blank article or empty pipeline.', 'error');
      return;
    }

    await onAddPost(newPostText, attachedImage || undefined, attachedFile ?? undefined);
    setNewPostText('');
    setAttachedImage(null);
    setAttachedFile(null);
    triggerToast('Post dispatched successfully to standard ledger!', 'success');
  };

  const handleShareClick = (p: Post) => {
    const shareableUrl = `${window.location.origin}/post/${p.id}`;
    navigator.clipboard.writeText(shareableUrl);
    triggerToast('Post routing link copied to professional clipboard!', 'success');
  };

  const handleCommentSubmit = (postId: string) => {
    const content = commentInputs[postId] || '';
    if (!content.trim()) return;

    onAddComment(postId, content);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    triggerToast('Comment committed to public node.', 'success');
  };

  return (
    <div id="home-feed-desktop-grid" className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 sm:p-6 max-w-7xl mx-auto">
      
      {/* Hidden File Input Selector */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* LEFT COLUMN: User profile brief snippet. Spans 3 columns on lg */}
      <div id="home-left-sidebar" className="md:col-span-4 lg:col-span-3 space-y-6">
        <GlassCard className="p-0">
          {/* Banner Photo */}
          <div 
            className="h-20 w-full" 
            style={{ backgroundImage: userProfile.banner, backgroundSize: 'cover' }}
          />
          {/* Avatar floating */}
          <div className="px-6 pb-6 relative">
            <div className="absolute -top-10 left-6">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-18 h-18 rounded-2xl border-4 border-white object-cover bg-obsidian-950"
              />
            </div>

            <div className="pt-10">
              <h3 
                onClick={onViewProfileLink}
                className="text-lg font-display font-bold text-white hover:text-cyan-aurora transition-colors cursor-pointer"
              >
                {userProfile.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-normal font-sans">
                {userProfile.headline}
              </p>
              
              <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{userProfile.location}</span>
              </div>
            </div>

            {/* Platform metrics */}
            <div className="border-t border-white/5 mt-5 pt-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Total connections</span>
                <span className="text-cyan-aurora font-bold font-mono">{userProfile.connectionsCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Search appearances</span>
                <span className="text-indigo-aurora font-bold font-mono">142</span>
              </div>
            </div>

            {/* Direct portfolio CTA button */}
            <button
              onClick={onViewProfileLink}
              className="mt-5 w-full py-2.5 px-4 rounded-xl text-xs font-semibold border border-cyan-aurora/30 bg-cyan-aurora/5 hover:bg-cyan-aurora/15 hover:border-cyan-aurora/50 text-cyan-aurora transition-all font-display select-none cursor-pointer text-center block"
            >
              Configure Portfolio Spec
            </button>
          </div>
        </GlassCard>

        {/* Recent Groups Card */}
        <GlassCard className="hidden lg:block">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 font-display">
            Recent Groups
          </h4>
          <div className="space-y-3.5">
            <div 
              onClick={() => {
                setNewPostText(prev => prev ? `${prev} #DesignLeadership` : '#DesignLeadership');
                triggerToast('Active channel Design Leadership selected.', 'info');
              }}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-indigo-aurora animate-pulse shrink-0"></div>
              <span className="text-sm text-slate-300 group-hover:text-cyan-aurora transition-colors">Design Leadership 2024</span>
            </div>
            <div 
              onClick={() => {
                setNewPostText(prev => prev ? `${prev} #Nextjs` : '#Nextjs');
                triggerToast('Active channel Next.js Experts selected.', 'info');
              }}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-aurora animate-pulse shrink-0"></div>
              <span className="text-sm text-slate-300 group-hover:text-cyan-aurora transition-colors">Next.js Experts</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* CENTER COLUMN: Main Dynamic Feed. Spans 6 columns on lg */}
      <div id="home-center-feed" className="md:col-span-8 lg:col-span-6 space-y-6">
        
        {/* Post Creation Card */}
        <GlassCard>
          <form onSubmit={handlePostSubmit} className="space-y-4">
            <div className="flex gap-4">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-10 h-10 rounded-xl object-cover bg-obsidian-950"
              />
              <div className="flex-1">
                <textarea
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="Share a professional technical breakthrough, or write an article..."
                  rows={3}
                  className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 border-none resize-none focus:outline-none focus:ring-0 pt-1.5"
                />
              </div>
            </div>

            {/* Preview of Attached Image / Payload */}
            {attachedImage && (
              <div className="relative mt-2 rounded-xl overflow-hidden group max-h-60 border border-white/5 bg-obsidian-900 flex items-center justify-center">
                <img
                  src={attachedImage}
                  alt="attachment preview"
                  className="max-h-60 max-w-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setAttachedImage(null);
                    setAttachedFile(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-obsidian-950/80 hover:bg-red-950/80 border border-white/10 text-slate-350 hover:text-white transition-all cursor-pointer"
                  title="Remove graphic payload"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Form actions widget row */}
            <div className="flex items-center justify-between pt-3.5 border-t border-white/5">
              <div className="flex items-center gap-1">
                {/* Photo Trigger button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-cyan-aurora hover:bg-cyan-aurora/10 transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer"
                  title="Upload picture from partition"
                >
                  <Image className="w-4 h-4 text-cyan-aurora" />
                  <span className="hidden sm:inline">Photo / Graphic</span>
                </button>

                {/* Preset sample injection */}
                <button
                  type="button"
                  onClick={() => handleApplyPresetImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80')}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-aurora hover:bg-indigo-aurora/10 transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer"
                  title="Inject pre-loaded network schematic"
                >
                  <FileText className="w-4 h-4 text-indigo-aurora" />
                  <span className="hidden sm:inline">Demo Art</span>
                </button>
              </div>

              {/* Submit Post button */}
              <button
                type="submit"
                disabled={!newPostText.trim() && !attachedImage}
                className={`py-2 px-5 rounded-xl text-xs font-semibold font-display flex items-center gap-1.5 transition-all select-none cursor-pointer ${
                  newPostText.trim() || attachedImage
                    ? 'glow-btn text-white'
                    : 'bg-obsidian-800 text-slate-500 border border-white/5 cursor-not-allowed'
                }`}
              >
                <span>Dispatch</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </GlassCard>

        {/* Dynamic Posts Chronology Feed */}
        <div id="posts-chronology-container" className="space-y-6">
          {posts.map((post) => (
            <GlassCard key={post.id} className="p-0">
              <div className="p-6">
                
                {/* Header info */}
                <div className="flex items-center justify-between mb-4.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-10.5 h-10.5 rounded-xl object-cover bg-obsidian-950"
                    />
                    <div>
                      <h4 className="text-sm font-display font-semibold text-white leading-snug">
                        {post.authorName}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-normal line-clamp-1 font-sans">
                        {post.authorHeadline}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{post.timestamp}</span>
                </div>

                {/* Content body description */}
                <p className="text-slate-300 text-sm leading-relaxed mb-4 font-sans whitespace-pre-wrap">{post.content}</p>

                {/* Attached image preview */}
                {post.image && (
                  <div className="mb-4 rounded-xl overflow-hidden max-h-72 border border-white/5 bg-obsidian-900 flex items-center justify-center">
                    <img
                      src={post.image}
                      alt="post visual schematic"
                      className="max-h-72 w-full object-cover"
                    />
                  </div>
                )}

                {/* Metrics display tracker */}
                <div className="flex items-center justify-between py-2.5 border-t border-b border-white/5 text-[11px] text-slate-500 font-mono">
                  <span>{post.likesCount} system signals</span>
                  <span>{post.comments.length} verification nodes</span>
                </div>

                {/* Dynamic Actions Ribbon */}
                <div className="flex items-center justify-between pt-3 text-xs font-semibold font-display">
                  {/* Like micro-interaction */}
                  <button
                    onClick={() => onLikePost(post.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                      post.hasLiked 
                        ? 'text-cyan-aurora bg-cyan-aurora/10' 
                        : 'text-slate-400 hover:text-cyan-aurora hover:bg-cyan-aurora/5'
                    }`}
                  >
                    <Heart className={`w-4 h-4 transition-transform duration-300 ${post.hasLiked ? 'fill-cyan-aurora scale-120' : ''}`} />
                    <span>{post.hasLiked ? 'Signalled' : 'Signal'}</span>
                  </button>

                  {/* Toggle comment Accordion */}
                  <button
                    onClick={() => {
                      setActiveCommentsPostId(activeCommentsPostId === post.id ? null : post.id);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                      activeCommentsPostId === post.id
                        ? 'text-indigo-aurora bg-indigo-aurora/10'
                        : 'text-slate-400 hover:text-indigo-aurora hover:bg-indigo-aurora/5'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Comments</span>
                  </button>

                  {/* Copy Share links */}
                  <button
                    onClick={() => handleShareClick(post)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share Route</span>
                  </button>
                </div>
              </div>

              {/* COMMENTS COLLAPSIBLE DRAWER */}
              {activeCommentsPostId === post.id && (
                <div className="border-t border-white/5 bg-obsidian-900/60 p-6 space-y-4 rounded-b-2xl">
                  {/* Input form */}
                  <div className="flex gap-3">
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCommentInputs(prev => ({ ...prev, [post.id]: val }));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCommentSubmit(post.id);
                        }}
                        placeholder="Configure comment payload..."
                        className="flex-1 bg-obsidian-800/60 border border-white/5 rounded-xl px-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-aurora/50 focus:ring-0"
                      />
                      <button
                        onClick={() => handleCommentSubmit(post.id)}
                        className="p-2 bg-cyan-aurora/10 hover:bg-cyan-aurora/20 text-cyan-aurora rounded-xl transition-all cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Comments lists */}
                  <div className="space-y-4 mt-2">
                    {post.comments.length > 0 ? (
                      post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 text-xs">
                          <img
                            src={comment.authorAvatar}
                            alt={comment.authorName}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <div className="flex-1 p-3 rounded-xl bg-obsidian-800/40 border border-white/5">
                            <div className="flex items-center justify-between mb-1">
                              <div>
                                <span className="font-bold text-slate-200 font-display">{comment.authorName}</span>
                                <span className="text-[10px] text-slate-500 ml-2 font-sans">{comment.authorHeadline}</span>
                              </div>
                              <span className="text-[9px] font-mono text-slate-500 uppercase">{comment.timestamp}</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed font-sans">{comment.content}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-xs italic text-center py-2 font-mono">No nodes linked yet. Be the first to commit comments.</p>
                    )}
                  </div>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: Network Suggestions & Trending Topics list */}
      <div id="home-right-sidebar" className="hidden lg:col-span-3 lg:block space-y-6">
        
        {/* Network suggestions "People you may know" */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display text-sm font-bold text-white">People You May Know</h4>
            <span className="text-[10px] font-mono text-cyan-aurora uppercase tracking-wider">Sync Lattice</span>
          </div>

          <div className="space-y-4">
            {networkSuggestions.map((suggest) => {
              const isPending = suggest.status === 'pending';
              const isConnected = suggest.status === 'connected';

              return (
                <div key={suggest.id} className="flex items-center justify-between gap-3 text-xs pb-3 border-b border-white/5 last:border-none last:pb-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={suggest.avatar}
                      alt={suggest.name}
                      className="w-8.5 h-8.5 rounded-lg object-cover bg-obsidian-950"
                    />
                    <div className="min-w-0">
                      <h5 className="font-bold text-slate-150 truncate leading-none font-display">{suggest.name}</h5>
                      <span className="text-[10px] text-slate-400 line-clamp-1 block leading-normal mt-0.5">{suggest.headline}</span>
                      <span className="text-[9px] font-mono text-slate-500 leading-normal block">{suggest.mutualCount} mutual nodes</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onConnectSuggest(suggest.id)}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                      isConnected 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : isPending
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                        : 'bg-cyan-aurora/5 border-cyan-aurora/30 text-cyan-aurora hover:bg-cyan-aurora/15'
                    }`}
                    title={isConnected ? 'Connected' : isPending ? 'Invitation Dispatch' : 'Establish Link'}
                  >
                    {isConnected ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : isPending ? (
                      <Check className="w-3.5 h-3.5 animate-pulse" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Trending Tech Topics & Market Demands */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4.5 h-4.5 text-cyan-aurora" />
            <h4 className="font-display text-sm font-bold text-white">Trending Topics</h4>
          </div>

          <div className="space-y-3 font-display">
            {TRENDING_TOPICS.map((topic) => (
              <div key={topic.id} className="text-xs">
                <a 
                  href={`#topic-${topic.id}`} 
                  onClick={(e) => {
                    e.preventDefault();
                    setNewPostText(prev => (prev ? `${prev} ${topic.topic}` : topic.topic));
                    triggerToast(`Inserted ${topic.topic} meta-marker into workspace post.`, 'info');
                  }}
                  className="font-bold text-slate-200 hover:text-cyan-aurora transition-colors"
                >
                  {topic.topic}
                </a>
                <p className="text-[10px] font-mono text-slate-500 uppercase mt-0.5">{topic.count}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Available Premium Careers listings */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-4.5 h-4.5 text-indigo-aurora" />
            <h4 className="font-display text-sm font-bold text-white">Premium Placements</h4>
          </div>

          <div className="space-y-3.5">
            {TRENDING_JOBS.map((job) => (
              <div 
                key={job.id} 
                className="text-xs p-2 rounded-lg bg-obsidian-950/40 border border-white/5 hover:border-cyan-aurora/30 transition-all cursor-pointer group"
                onClick={() => triggerToast(`Interactive cloud portal initiated for ${job.role} at ${job.company}. Ready for payload.`, 'success')}
              >
                <h5 className="font-bold text-slate-150 leading-tight group-hover:text-cyan-aurora transition-colors truncate">{job.role}</h5>
                <p className="text-[10px] text-slate-400 font-display mt-0.5 leading-none">{job.company}</p>
                <p className="text-[9px] font-mono text-slate-500 uppercase mt-1 leading-none">{job.location}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

    </div>
  );
}
