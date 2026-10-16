import React from 'react';
import { 
  Code2, 
  Sparkles, 
  History, 
  GraduationCap, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Layers,
  Flame,
  Clock,
  RotateCcw
} from 'lucide-react';
import { StudentProfile } from '../types';

interface DashboardPageProps {
  profile: StudentProfile;
  onNavigate: (page: string) => void;
  onSelectMistakeForPractice: (concept: string) => void;
  onResetData: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  profile,
  onNavigate,
  onSelectMistakeForPractice,
  onResetData,
}) => {
  const conceptsList = [
    'Loops',
    'Arrays',
    'Functions',
    'Recursion',
    'OOP',
    'Data Structures',
    'Variables & Scope',
    'Error Handling'
  ];

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Strong':
        return <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Strong</span>;
      case 'Good':
        return <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 border border-blue-300">Good</span>;
      case 'Needs Practice':
        return <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#C65D32]/15 text-[#C65D32] border border-[#C65D32]/30">Needs Practice</span>;
      case 'Developing':
        return <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-300">Developing</span>;
      default:
        return <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-gray-100 text-[#888] border border-gray-200">Not enough attempts yet</span>;
    }
  };

  const getTrendIcon = (trend?: string) => {
    if (trend === 'improving') return <span title="Improving trend"><TrendingUp className="w-3.5 h-3.5 text-emerald-600" /></span>;
    if (trend === 'declining') return <span title="Needs focus"><TrendingDown className="w-3.5 h-3.5 text-[#C65D32]" /></span>;
    if (trend === 'stable') return <span title="Stable"><Minus className="w-3.5 h-3.5 text-amber-600" /></span>;
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#234236] text-[#F7F1E3] shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xl">👋</span>
            <span className="text-xs uppercase font-bold tracking-widest text-[#D6A84F]">
              {profile.isDemoMode ? 'Demo Student Viva Mode' : 'Live Student Workspace'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hey, {profile.name || 'coder'}
          </h1>
          <p className="text-[#A8B89F] text-sm sm:text-base max-w-xl">
            "Ready to turn another bug into a skill? Don't just patch errors—understand the concept behind them."
          </p>
        </div>

        {/* Quick Stats Banner */}
        <div className="flex items-center gap-3 z-10">
          <div className="px-4 py-3 rounded-2xl bg-[#193128] border border-white/10 text-center">
            <span className="text-2xl font-black text-[#D6A84F] block font-mono">{profile.totalAnalyses || 0}</span>
            <span className="text-[11px] text-[#A8B89F]">Code Diagnoses</span>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-[#193128] border border-white/10 text-center">
            <span className="text-2xl font-black text-[#F7F1E3] block font-mono">{profile.totalPracticesCompleted || 0}</span>
            <span className="text-[11px] text-[#A8B89F]">Practices Solved</span>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-[#193128] border border-white/10 text-center">
            <span className="text-2xl font-black text-[#C65D32] block font-mono">{profile.recurringMistakes?.length || 0}</span>
            <span className="text-[11px] text-[#A8B89F]">Tracked Gaps</span>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#2D5445]/50 pointer-events-none blur-2xl"></div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Analyze Code',
            desc: 'Detect errors & cognitive gap',
            icon: Code2,
            page: 'analyzer',
            color: 'bg-[#234236] text-white',
            btnText: 'Open Editor'
          },
          {
            title: 'Practice Weak Topics',
            desc: 'Target detected misconceptions',
            icon: Sparkles,
            page: 'practice',
            color: 'bg-[#C65D32] text-white',
            btnText: 'Start Lab'
          },
          {
            title: 'View Mistakes',
            desc: 'Review past code patterns',
            icon: History,
            page: 'mistakes',
            color: 'bg-[#D6A84F] text-[#332A24]',
            btnText: 'Inspect History'
          },
          {
            title: 'View Progress',
            desc: 'Concept mastery matrix',
            icon: GraduationCap,
            page: 'profile',
            color: 'bg-[#EDE5D0] text-[#234236]',
            btnText: 'View Profile'
          },
        ].map((action, i) => {
          const Icon = action.icon;
          return (
            <div 
              key={i}
              onClick={() => onNavigate(action.page)}
              className="p-5 rounded-2xl bg-white border border-[#332A24]/10 shadow-xs hover:shadow-md hover:border-[#234236]/30 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mb-3 shadow-2xs group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#234236] mb-1">{action.title}</h3>
                <p className="text-xs text-[#6B5B52] leading-tight">{action.desc}</p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#234236] group-hover:text-[#C65D32] transition-colors">
                <span>{action.btnText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Coding Skill Overview + Recurring Mistakes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 cols: Coding Skill Overview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#234236]">Coding Skill Overview</h2>
              <p className="text-xs text-[#6B5B52]">Real historical understanding data (no arbitrary percentages)</p>
            </div>
            <button
              onClick={() => onNavigate('profile')}
              className="text-xs font-bold text-[#C65D32] hover:underline flex items-center gap-1"
            >
              <span>Detailed Matrix</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {conceptsList.map((conceptName) => {
              const strength = profile.conceptStrengths?.[conceptName];
              const attempts = strength?.totalAttempts || 0;
              const hasData = attempts > 0;

              return (
                <div 
                  key={conceptName}
                  className="p-4 rounded-xl bg-white border border-[#332A24]/10 shadow-2xs hover:border-[#332A24]/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[#234236] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#D6A84F]" />
                      {conceptName}
                    </span>
                    <div className="flex items-center gap-1">
                      {hasData && getTrendIcon(strength?.trend)}
                    </div>
                  </div>

                  <div className="mb-2">
                    {getStatusBadge(strength?.status)}
                  </div>

                  {hasData ? (
                    <div className="text-[11px] text-[#6B5B52] flex items-center justify-between pt-1 border-t border-[#332A24]/5">
                      <span>{strength?.successfulAttempts} / {attempts} successful</span>
                      <span>Last: {strength?.lastAttemptDate || 'Recent'}</span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#999] italic pt-1 border-t border-[#332A24]/5">
                      Practice this topic to build your skill map.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 cols: Recurring Mistakes + Recent Activity */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recurring Mistakes Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#332A24]/10 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#332A24]/10 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#C65D32]" />
                <h3 className="font-bold text-sm text-[#234236]">Recurring Misconceptions</h3>
              </div>
              <span className="text-xs font-semibold text-[#6B5B52]">
                {profile.recurringMistakes?.length || 0} patterns
              </span>
            </div>

            {profile.recurringMistakes && profile.recurringMistakes.length > 0 ? (
              <div className="space-y-3">
                {profile.recurringMistakes.map((mistake) => (
                  <div 
                    key={mistake.id}
                    className="p-3.5 rounded-xl bg-[#F7F1E3]/80 border border-[#332A24]/10 hover:border-[#C65D32]/40 transition-all flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-[#234236]">{mistake.concept}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#C65D32] text-white">
                          {mistake.count} occurrences
                        </span>
                      </div>
                      <p className="text-xs font-medium text-[#C65D32] mb-1">
                        {mistake.mistakeType}
                      </p>
                      <p className="text-[11px] text-[#6B5B52] line-clamp-2">
                        {mistake.explanation}
                      </p>
                    </div>

                    <button
                      onClick={() => onSelectMistakeForPractice(mistake.concept)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#234236] hover:bg-[#2D5445] text-[#F7F1E3] text-[11px] font-bold shrink-0 transition-colors cursor-pointer mt-1"
                      title="Generate practice problems specifically targeting this mistake"
                    >
                      Practice
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-[#6B5B52] bg-[#FDFBF7] rounded-xl border border-dashed border-[#332A24]/15">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <p className="font-medium text-[#234236]">Your mistake history is empty — that's okay.</p>
                <p className="mt-1">Paste your first piece of code and let's find something to learn.</p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-5 rounded-2xl border border-[#332A24]/10 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#332A24]/10 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#234236]" />
                <h3 className="font-bold text-sm text-[#234236]">Recent Activity</h3>
              </div>
              <span className="text-xs text-[#6B5B52]">Latest attempts</span>
            </div>

            {profile.recentActivity && profile.recentActivity.length > 0 ? (
              <div className="space-y-2.5">
                {profile.recentActivity.slice(0, 5).map((act) => (
                  <div 
                    key={act.id} 
                    className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-[#FDFBF7] border border-[#332A24]/5"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        act.status === 'passed' ? 'bg-emerald-500' : 'bg-[#C65D32]'
                      }`}></span>
                      <div>
                        <span className="font-semibold text-[#234236] block">{act.title}</span>
                        <span className="text-[10px] text-[#6B5B52]">{act.concept} • {act.language}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#888] font-mono">{act.timestamp}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#888] italic text-center py-4">No recent activity logged yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
