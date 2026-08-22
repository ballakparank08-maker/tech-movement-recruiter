import React from 'react';
import logoImg from '../assets/logo.png';

interface TechMovementLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export const TechMovementLogo: React.FC<TechMovementLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  showText = true,
  className = '',
  onClick
}) => {
  // Dimensions according to size
  const dimensions = {
    sm: { iconWidth: 42, iconHeight: 42, titleSize: 'text-base', subSize: 'text-[9px]' },
    md: { iconWidth: 56, iconHeight: 56, titleSize: 'text-xl', subSize: 'text-[10px]' },
    lg: { iconWidth: 76, iconHeight: 76, titleSize: 'text-2xl', subSize: 'text-xs' },
    xl: { iconWidth: 112, iconHeight: 112, titleSize: 'text-3xl', subSize: 'text-sm' }
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      id="tech-movement-brand-logo"
    >
      {/* 3D Metallic TM Logo Image */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        {/* Ambient Depth Glow */}
        <div 
          className="absolute -inset-2 opacity-80 blur-md pointer-events-none rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 45%, rgba(0, 102, 204, 0.45) 0%, rgba(220, 38, 38, 0.4) 60%, transparent 80%)'
          }}
        />

        <img
          src={logoImg}
          alt="Tech Movement Logo"
          style={{ width: dimensions.iconWidth, height: dimensions.iconHeight }}
          className="relative z-10 object-contain filter drop-shadow-[0_6px_14px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Brand Typography Section */}
      {showText && (
        <div className="flex flex-col">
          <div className={`font-black tracking-wider leading-none flex items-center gap-1.5 ${dimensions.titleSize}`}>
            <span 
              className="font-['Outfit'] font-black uppercase tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 40%, #2563eb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 12px rgba(37, 99, 235, 0.45))'
              }}
            >
              TECH
            </span>
            <span 
              className="font-['Outfit'] font-black uppercase tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #fdba74 35%, #ef4444 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 14px rgba(239, 68, 68, 0.5))'
              }}
            >
              MOVEMENT
            </span>
          </div>

          {showSubtitle && (
            <div className={`text-[#F7C59F]/80 font-mono tracking-widest uppercase font-medium mt-1 ${dimensions.subSize}`}>
              Innovation & Digital Transformation
            </div>
          )}
        </div>
      )}
    </div>
  );
};
