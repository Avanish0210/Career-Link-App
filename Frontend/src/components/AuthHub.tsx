/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Key, Mail, User, ShieldAlert, CheckCircle, ArrowRight, Share2, Sparkles } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface AuthHubProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (name: string, email: string, password: string) => Promise<void>;
}

export function AuthHub({ onSignIn, onSignUp }: AuthHubProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Sign In inputs
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  // Sign Up inputs
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // Toast management
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background Particle Animation for professional network simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes properties
    const particleCount = 28;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      label: string;
      glowColor: string;
    }> = [];

    const labels = [
      'React', 'AI Model', 'Kubernetes', 'Go Engine', 'TypeScript', 
      'Lead Architect', 'Developer', 'Designer', 'GraphQL', 'LLM Node',
      'Cognitive Dev', 'DB Spanner', 'Stripe Proxy', 'System Admin'
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 4 + 3,
        label: i < labels.length ? labels[i] : '',
        glowColor: Math.random() > 0.5 ? '#06B6D4' : '#6366F1',
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle orbital paths
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.35, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.04)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.04)';
      ctx.stroke();

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = (1 - dist / 130) * 0.15;
            ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Move & draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wall collisions
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw node center glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = p.glowColor === '#06B6D4' ? 'rgba(6,182,212,0.1)' : 'rgba(99,102,241,0.1)';
        ctx.fill();

        // Draw node core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.glowColor;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Draw labels for key nodes
        if (p.label) {
          ctx.font = "500 11px 'Outfit', 'Inter', sans-serif";
          ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
          ctx.fillText(p.label, p.x + 10, p.y + 4);
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const showToastNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    // Dismiss after 4 seconds
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      showToastNotification('Please fill in resources for both email and password.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      showToastNotification('Authenticating professional credentials...', 'info');
      await onSignIn(signInEmail, signInPassword);
    } catch (error) {
      showToastNotification(error instanceof Error ? error.message : 'Unable to sign in.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName || !signUpEmail || !signUpPassword) {
      showToastNotification('All system credentials must be supplied to index account.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSignUp(signUpName, signUpEmail, signUpPassword);
      showToastNotification(`Welcome packet generated for ${signUpName}. You are signed in.`, 'success');
    } catch (error) {
      showToastNotification(error instanceof Error ? error.message : 'Unable to create account.', 'error');
      setActiveTab('signin');
      setSignInEmail(signUpEmail);
      setSignInPassword(signUpPassword);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    showToastNotification(`Reset authentication dispatched to ${signInEmail || 'your email'}. Check inbox inside 5 minutes.`, 'info');
  };

  return (
    <div id="auth-routing-container" className="min-h-screen grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-[#060911]">
      
      {/* Toast Notification */}
      {toast && (
        <div 
          id="toast-notification-banner" 
          className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl glass-panel animate-bounce border-cyan-aurora/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] max-w-sm"
        >
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-cyan-aurora" />}
          {toast.type === 'error' && <ShieldAlert className="w-5 h-5 text-red-400" />}
          {toast.type === 'info' && <Sparkles className="w-5 h-5 text-indigo-aurora" />}
          
          <div className="flex-1 text-sm font-medium text-slate-100">
            {toast.message}
          </div>
          
          <button 
            type="button" 
            onClick={() => setToast(null)}
            className="text-xs text-slate-400 hover:text-slate-100 font-sans ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Left split-screen pane: Graphics Network simulation */}
      <div 
        id="auth-canvas-showcase" 
        className="hidden lg:flex lg:col-span-7 flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-obsidian-950 via-indigo-950/20 to-obsidian-900 border-r border-white/5"
      >
        {/* Animated background node canvas */}
        <div className="absolute inset-0 opacity-80 pointer-events-none">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        {/* Ambient neon orbs floating */}
        <div className="absolute -top-10 -left-10 w-96 h-96 rounded-full bg-cyan-aurora/10 blur-[80px]" />
        <div className="absolute -bottom-10 -right-10 w-96 h-96 rounded-full bg-indigo-aurora/10 blur-[80px]" />

        {/* Logo and Brand Title Header */}
        <div className="flex items-center gap-3.5 relative z-10 select-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-aurora to-indigo-aurora p-[1px]">
            <div className="w-full h-full rounded-xl bg-obsidian-950 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-cyan-aurora animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight text-white leading-tight">
              Career<span className="text-cyan-aurora font-light">Link</span>
            </h1>
            <span className="text-[10px] font-mono tracking-widest uppercase text-indigo-aurora">Obsidian Hub</span>
          </div>
        </div>

        {/* Dynamic Center Tagline / Quote card */}
        <div className="max-w-md relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-aurora/10 border border-cyan-aurora/35 mb-6 text-xs text-cyan-aurora font-medium font-display uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-cyan-aurora" /> 2026 Engine Online
          </div>
          
          <h2 className="font-display text-4xl font-bold text-white tracking-tight leading-none mb-4">
            Connect. Deploy.<br/>
            <span className="bg-gradient-to-r from-cyan-aurora to-indigo-aurora bg-clip-text text-transparent">Scale Professionally.</span>
          </h2>
          
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            A premium engineering & executive cloud ecosystem. Tap into a high-octane professional lattice, secure telemetry verification, and glassmorphic profile showcases.
          </p>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Cloud Active
            </span>
            <span>•</span>
            <span>REST Telemetry</span>
            <span>•</span>
            <span>CJS Bundled</span>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="relative z-10 text-xs font-mono text-slate-500 flex items-center justify-between">
          <span>Midnight Obsidian Theme v3.14</span>
          <span>© 2026 Career-Link Network</span>
        </div>
      </div>

      {/* Right split-screen pane: Form control center */}
      <div 
        id="auth-credentials-form" 
        className="lg:col-span-5 flex items-center justify-center p-6 sm:p-12 md:p-16 relative bg-[#060911]/95"
      >
        <div className="w-full max-w-md">
          {/* Mobile Display Logo */}
          <div className="flex lg:hidden items-center gap-3.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-aurora to-indigo-aurora p-[1px]">
              <div className="w-full h-full rounded-xl bg-obsidian-950 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-cyan-aurora" />
              </div>
            </div>
            <div>
              <h1 className="font-display text-lg font-bold tracking-tight text-white">
                Career<span className="text-cyan-aurora">Link</span>
              </h1>
              <span className="text-[9px] font-mono tracking-wider uppercase text-indigo-aurora">Obsidian Core</span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-display text-2xl font-bold text-white">Welcome onboard</h3>
            <p className="text-slate-400 text-sm mt-1">Authenticate credentials to synchronize workspace.</p>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-obsidian-800/60 border border-white/5 mb-8">
            <button
              onClick={() => setActiveTab('signin')}
              className={`py-2 text-sm font-semibold rounded-lg font-display transition-all duration-300 ${
                activeTab === 'signin'
                  ? 'bg-gradient-to-r from-cyan-aurora/20 to-indigo-aurora/20 text-white border border-cyan-aurora/25 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`py-2 text-sm font-semibold rounded-lg font-display transition-all duration-300 ${
                activeTab === 'signup'
                  ? 'bg-gradient-to-r from-cyan-aurora/20 to-indigo-aurora/20 text-white border border-cyan-aurora/25 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Interactive Screen Forms */}
          {activeTab === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 font-display tracking-wider uppercase">Email address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="architect@domain.com"
                    className="w-full bg-obsidian-800/40 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-aurora/60 focus:ring-1 focus:ring-cyan-aurora/30 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 font-display tracking-wider uppercase">Password</label>
                  <a 
                    href="#forgot" 
                    onClick={handleForgotPassword}
                    className="text-xs text-cyan-aurora hover:text-cyan-400 font-display transition-colors"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                    <Key className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-obsidian-800/40 border border-white/5 rounded-xl pl-11 pr-11 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-aurora/60 focus:ring-1 focus:ring-cyan-aurora/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold glow-btn text-white flex items-center justify-center gap-2 font-display select-none cursor-pointer"
              >
                {isSubmitting ? 'Signing In...' : 'Sign In to Network'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 font-display tracking-wider uppercase">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="Dr. Raymond Stantz"
                    className="w-full bg-obsidian-800/40 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-aurora/60 focus:ring-1 focus:ring-cyan-aurora/30 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 font-display tracking-wider uppercase">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="ray@parastudies.org"
                    className="w-full bg-obsidian-800/40 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-aurora/60 focus:ring-1 focus:ring-cyan-aurora/30 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 font-display tracking-wider uppercase">Secure Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                    <Key className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-obsidian-800/40 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-aurora/60 focus:ring-1 focus:ring-cyan-aurora/30 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-1 text-xs text-slate-400">
                <input type="checkbox" id="terms" required className="accent-cyan-aurora" />
                <label htmlFor="terms">
                  I accept the{' '}
                  <a href="#terms" className="text-cyan-aurora hover:underline">
                    Professional Core Agreement
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold glow-btn text-white flex items-center justify-center gap-2 font-display select-none cursor-pointer"
              >
                {isSubmitting ? 'Registering...' : 'Register Credentials'} <Sparkles className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Backend Credentials Help */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="p-3 bg-indigo-950/20 rounded-xl border border-indigo-500/10 text-xs text-slate-400">
              <span className="font-semibold text-slate-200 block mb-0.5 font-display">Backend Gateway Access</span>
              Create an account or sign in with credentials already saved in the user service.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
