/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  hoverable?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  key?: React.Key;
}

export function GlassCard({ children, id, className = '', hoverable = false, onClick, ...rest }: GlassCardProps) {
  return (
    <div
      id={id}
      className={`glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-300 ${
        hoverable ? 'glass-panel-hover cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
      {...rest}
    >
      {/* Subtle top light refraction */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      {/* Subtle bottom dark drop */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/20 to-transparent pointer-events-none" />
      
      {children}
    </div>
  );
}
