/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Plus, 
  X, 
  Trash2, 
  Edit, 
  Save, 
  Check, 
  Share2, 
  Image, 
  Compass, 
  BookOpen, 
  Sparkles,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { UserProfile, Experience } from '../types';

interface ProfileDetailsProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  triggerToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export function ProfileDetails({
  userProfile,
  onUpdateProfile,
  triggerToast,
}: ProfileDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editHeadline, setEditHeadline] = useState(userProfile.headline);
  const [editBio, setEditBio] = useState(userProfile.bio);
  const [editLocation, setEditLocation] = useState(userProfile.location);

  const [newSkillText, setNewSkillText] = useState('');
  const [showBannerConfig, setShowBannerConfig] = useState(false);

  // Preset banners that represent modern tech
  const presetsBanners = [
    { name: 'Aurora Obsidian', value: 'linear-gradient(135deg, #090D16 0%, #1E1B4B 40%, #06B6D4 100%)' },
    { name: 'Electric Velvet', value: 'linear-gradient(135deg, #020617 0%, #311042 50%, #6366F1 100%)' },
    { name: 'Cyberpunk Grid', value: 'linear-gradient(90deg, #1A0B2E 0%, #060E1A 50%, #0D9488 100%)' },
    { name: 'Deep Metal', value: 'linear-gradient(to bottom, #111827, #030712)' },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      triggerToast('Name metric cannot be left blank.', 'error');
      return;
    }

    onUpdateProfile({
      name: editName,
      headline: editHeadline,
      bio: editBio,
      location: editLocation,
    });
    setIsEditing(false);
    triggerToast('Profile specs successfully written to memory node.', 'success');
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSkill = newSkillText.trim();
    if (!cleanSkill) return;

    if (userProfile.skills.includes(cleanSkill)) {
      triggerToast('Skill already compiled.', 'info');
      return;
    }

    const updated = [...userProfile.skills, cleanSkill];
    onUpdateProfile({ skills: updated });
    setNewSkillText('');
    triggerToast(`Appended Skill: ${cleanSkill}`, 'success');
  };

  const handleRemoveSkill = (skill: string) => {
    const updated = userProfile.skills.filter((s) => s !== skill);
    onUpdateProfile({ skills: updated });
    triggerToast(`Removed Skill: ${skill}`, 'info');
  };

  const handleBannerSelect = (gradientValue: string) => {
    onUpdateProfile({ banner: gradientValue });
    setShowBannerConfig(false);
    triggerToast('Premium banner gradient changed successfully.', 'success');
  };

  const handleShareProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    const link = `${window.location.origin}/profile/${userProfile.id}`;
    navigator.clipboard.writeText(link);
    triggerToast('Portfolio share token generated and copied to clipboard!', 'success');
  };

  return (
    <div id="profile-portfolio-root" className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      
      {/* HEADER SECTION: Premium Banner & Absolute Profile Photo */}
      <div className="relative rounded-2xl overflow-hidden glass-panel border border-white/10">
        
        {/* Banner container */}
        <div 
          className="h-44 sm:h-56 w-full relative transition-all duration-300"
          style={{ backgroundImage: userProfile.banner, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          {/* Cover gradient */}
          <div className="absolute inset-0 bg-black/10" />

          {/* Quick Banner Changer button */}
          <button
            onClick={() => setShowBannerConfig(!showBannerConfig)}
            className="absolute top-4 right-4 py-1.5 px-3 rounded-lg bg-obsidian-950/80 border border-white/10 hover:border-cyan-aurora/35 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer z-10"
            title="Update cover schematic"
          >
            <Image className="w-3.5 h-3.5 text-cyan-aurora" />
            <span>Customize Banner</span>
          </button>

          {showBannerConfig && (
            <div className="absolute top-14 right-4 w-52 rounded-xl glass-panel border-white/10 bg-obsidian-900/95 p-3 z-30 shadow-2xl space-y-2">
              <span className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">Preset Gradients</span>
              {presetsBanners.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => handleBannerSelect(theme.value)}
                  className="w-full text-left font-display block text-xs p-1.5 rounded-lg hover:bg-white/5 transition-all text-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-md block border border-white/10" style={{ background: theme.value }} />
                    <span className="truncate">{theme.name}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bio information spacing */}
        <div className="px-6 pb-6 pt-5 sm:pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            
            {/* Absolute positioned or layered layout */}
            <div className="relative -mt-16 sm:-mt-12 z-10">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white object-cover bg-obsidian-950 shadow-2xl"
              />
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">{userProfile.name}</h2>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-aurora/10 border border-cyan-aurora/30 text-[9px] font-mono font-bold text-cyan-400">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-aurora" /> VERIFIED
                </div>
              </div>
              <p className="text-sm text-slate-350 leading-relaxed max-w-xl mt-1.5">{userProfile.headline}</p>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {userProfile.location}
                </span>
                <span>•</span>
                <span className="text-cyan-aurora font-semibold font-mono">{userProfile.connectionsCount} cluster connection points</span>
              </div>
            </div>
          </div>

          {/* Action triggers bar */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Toggle edit state */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex-1 sm:flex-none py-2 px-4 rounded-xl border border-white/10 hover:border-cyan-aurora/30 text-xs font-semibold font-display text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5 text-cyan-aurora" />
              <span>{isEditing ? 'Collapse Details' : 'Edit Specs'}</span>
            </button>

            {/* Share profile code */}
            <button
              onClick={handleShareProfile}
              className="py-2 px-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-xs text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1 w-fit"
              title="Share profile link"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* EXPANDABLE PROFILE EDIT PANEL FORM */}
      {isEditing && (
        <GlassCard className="border-cyan-aurora/25 shadow-[0_0_20px_rgba(6,182,212,0.04)] ring-1 ring-cyan-aurora/20">
          <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-3">
            <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-cyan-aurora" /> Configure Portfolio Specifications
            </h4>
            <span className="text-[10px] font-mono text-cyan-aurora tracking-widest uppercase">Local Node Editor</span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 font-display tracking-widest uppercase block">Name Token</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-obsidian-900 border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-slate-250 focus:outline-none focus:border-cyan-aurora/40 focus:ring-0"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 font-display tracking-widest uppercase block">Spatial Coordinates (Location)</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full bg-obsidian-900 border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-slate-250 focus:outline-none focus:border-cyan-aurora/40 focus:ring-0"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 font-display tracking-widest uppercase block">Professional Headline Spec</label>
              <input
                type="text"
                value={editHeadline}
                onChange={(e) => setEditHeadline(e.target.value)}
                className="w-full bg-obsidian-900 border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-slate-250 focus:outline-none focus:border-cyan-aurora/40 focus:ring-0"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 font-display tracking-widest uppercase block">Curriculum Vitae Biography (Markdown supported)</label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={4}
                className="w-full bg-obsidian-900 border border-white/5 rounded-xl p-3.5 text-xs text-slate-250 focus:outline-none focus:border-cyan-aurora/40 focus:ring-0"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-white/10 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Abstain
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold glow-btn text-white flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save portfolio node</span>
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* CORE TWO-COLUMN EXPANSION GRID: Left is bio/experience, Right is customizable skills */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COMPONENT: Biography details & Vertical experience timeline */}
        <div className="lg:col-span-8 space-y-6">
          {/* Biography summary */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
              <BookOpen className="w-4.5 h-4.5 text-cyan-aurora" />
              <h3 className="font-display text-sm font-bold text-white">Curriculum Vitae specs</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">{userProfile.bio}</p>
          </GlassCard>

          {/* Vertical Experience Timeline */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-3">
              <Layers className="w-4.5 h-4.5 text-indigo-aurora" />
              <h3 className="font-display text-sm font-bold text-white">Experience Timeline ledger</h3>
            </div>

            <div className="relative pl-6 border-l-2 border-white/10 space-y-8.5 py-1">
              {userProfile.experience.map((job) => (
                <div key={job.id} className="relative group">
                  {/* Glowing Node pointer absolute over container */}
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-obsidian-950 border-2 border-cyan-aurora group-hover:bg-cyan-aurora transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <div>
                      <h4 className="font-display font-semibold text-slate-100 text-sm">{job.role}</h4>
                      <p className="text-xs text-cyan-300 font-medium font-display">{job.company}</p>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
                      <Calendar className="w-3 h-3 text-indigo-aurora" />
                      <span>{job.startDate} – {job.endDate}</span>
                    </div>
                  </div>

                  <ul className="space-y-1.5">
                    {job.description.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-350 leading-normal font-sans">
                        <ChevronRight className="w-3.5 h-3.5 text-cyan-aurora/65 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* RIGHT COMPONENT: Interactive skills block */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard>
            <div className="flex items-center justify-between mb-4.5 border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4.5 h-4.5 text-cyan-aurora" />
                <h3 className="font-display text-sm font-bold text-white">Core Skills lattice</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">{userProfile.skills.length} nodes</span>
            </div>

            {/* Input field to add skill */}
            <form onSubmit={handleAddSkill} className="flex gap-2 mb-4.5">
              <input
                type="text"
                value={newSkillText}
                onChange={(e) => setNewSkillText(e.target.value)}
                placeholder="Declare new skill..."
                className="flex-1 bg-obsidian-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-aurora/50 focus:ring-0"
              />
              <button
                type="submit"
                className="p-2 bg-cyan-aurora/10 hover:bg-cyan-aurora/20 border border-cyan-aurora/20 text-cyan-aurora rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
                title="Append skill badge"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* Skills Pills Grids with glowing border */}
            <div className="flex flex-wrap gap-2">
              {userProfile.skills.length > 0 ? (
                userProfile.skills.map((skill) => (
                  <div
                    key={skill}
                    className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-aurora/5 border border-cyan-aurora/15 text-slate-200 text-xs hover:border-cyan-aurora/40 transition-all font-display hover:shadow-[0_0_12px_rgba(6,182,212,0.05)] cursor-default select-none"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-500 hover:text-red-400 p-0.5 rounded transition-colors"
                      title={`De-register ${skill}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-xs italic font-mono py-2">Lattice skills stack is completely empty.</p>
              )}
            </div>
          </GlassCard>

          {/* Verification summary stats panel */}
          <GlassCard className="p-5 flex flex-col justify-between aspect-video relative overflow-hidden bg-gradient-to-br from-[#101625] to-[#0A0E18]">
            {/* Background vector simulation */}
            <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" stroke-width="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest text-[#6366F1] font-bold uppercase">SECURE VERIFIED LEDGER</span>
              <span className="p-1 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-mono font-bold">NODE_01</span>
            </div>

            <div className="relative z-10 my-4">
              <span className="text-slate-500 text-[10px] font-mono uppercase block mb-1">COMPILATION VERDICT</span>
              <p className="font-display font-semibold text-sm text-slate-100">
                Continuous integration tests passed over CV metadata payload.
              </p>
            </div>

            <div className="relative z-10 text-slate-500 text-[9px] font-mono flex items-center justify-between">
              <span>SHA-256 COMPLIANT</span>
              <span>2026-05-21 UTC</span>
            </div>
          </GlassCard>
        </div>

      </div>

    </div>
  );
}
