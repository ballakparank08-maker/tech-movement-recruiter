import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';

const LANGUAGES: { code: Language; name: string; flag: string; label: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', label: 'EN' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩', label: 'ID' },
  { code: 'zh', name: '中文 (简体)', flag: '🇨🇳', label: 'ZH' }
];

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded-xl bg-[#0A1128]/90 hover:bg-[#0F1B3E] text-slate-200 border border-white/10 hover:border-[#FF6B35]/50 text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-[#38BDF8]" />
        <span className="text-sm">{currentLang.flag}</span>
        <span>{currentLang.label}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-[#050B1D]/95 backdrop-blur-xl border border-white/15 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="text-[10px] font-mono font-bold text-slate-400 px-3 py-1 uppercase tracking-wider border-b border-white/10 mb-1">
            Select Language
          </div>
          {LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#FF6B35]/20 text-[#F7C59F] font-bold border border-[#FF6B35]/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.name}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#FF7F4E]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
