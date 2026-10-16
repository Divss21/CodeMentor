import React, { useState } from 'react';
import { 
  BookOpen, 
  Code2, 
  Sparkles, 
  History, 
  GraduationCap, 
  UserCheck, 
  LayoutDashboard, 
  Menu, 
  X,
  Layers,
  Flame
} from 'lucide-react';
import { StudentProfile } from '../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  profile: StudentProfile | null;
  onToggleDemo: (enable: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  profile,
  onToggleDemo
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: BookOpen },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyzer', label: 'Code Analyzer', icon: Code2, highlight: true },
    { id: 'practice', label: 'Practice Lab', icon: Sparkles },
    { id: 'mistakes', label: 'My Mistakes', icon: History, badge: profile?.recurringMistakes?.length },
    { id: 'library', label: 'Concept Library', icon: Layers },
    { id: 'profile', label: 'Learning Profile', icon: GraduationCap },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F7F1E3]/95 backdrop-blur-md border-b border-[#332A24]/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Subtitle */}
          <div 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#234236] text-[#F7F1E3] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5 text-[#D6A84F]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-[#234236] tracking-tight">CodeMentor AI</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#C65D32]/10 text-[#C65D32] border border-[#C65D32]/20">
                  Concept Tutor
                </span>
              </div>
              <p className="text-xs text-[#6B5B52] hidden sm:block">Don't just fix code. Understand why.</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#234236] text-[#F7F1E3] shadow-xs'
                      : item.highlight
                      ? 'text-[#234236] hover:bg-[#234236]/10 font-semibold'
                      : 'text-[#332A24] hover:bg-[#332A24]/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D6A84F]' : 'text-[#6B5B52]'}`} />
                  <span>{item.label}</span>
                  {Boolean(item.badge && item.badge > 0) && (
                    <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-[#C65D32] text-white' : 'bg-[#C65D32]/15 text-[#C65D32]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Demo Mode Toggle & Viva Badge */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center bg-[#EDE5D0] p-1 rounded-lg border border-[#332A24]/10">
              <button
                onClick={() => onToggleDemo(true)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  profile?.isDemoMode
                    ? 'bg-[#234236] text-[#F7F1E3] shadow-xs'
                    : 'text-[#6B5B52] hover:text-[#332A24]'
                }`}
                title="Loads sample Python indexing demo scenario & student mistakes for viva evaluation"
              >
                <Flame className={`w-3.5 h-3.5 ${profile?.isDemoMode ? 'text-[#D6A84F]' : ''}`} />
                <span>Demo Data</span>
              </button>
              <button
                onClick={() => onToggleDemo(false)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  !profile?.isDemoMode
                    ? 'bg-[#234236] text-[#F7F1E3] shadow-xs'
                    : 'text-[#6B5B52] hover:text-[#332A24]'
                }`}
                title="Switch to blank real student mode"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Real Student</span>
              </button>
            </div>
          </div>

          {/* Mobile menu trigger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => onToggleDemo(!profile?.isDemoMode)}
              className="text-xs px-2 py-1 rounded bg-[#EDE5D0] text-[#234236] font-medium border border-[#332A24]/10"
            >
              {profile?.isDemoMode ? 'Demo' : 'Real'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#332A24] hover:bg-[#332A24]/10"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F7F1E3] border-b border-[#332A24]/15 px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-[#234236] text-[#F7F1E3]'
                    : 'text-[#332A24] hover:bg-[#332A24]/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D6A84F]' : 'text-[#6B5B52]'}`} />
                  <span>{item.label}</span>
                </div>
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#C65D32] text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
