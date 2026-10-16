import React from 'react';
import { 
  GraduationCap, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Layers, 
  Flame, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles,
  Calendar,
  Award
} from 'lucide-react';
import { ConceptStrengthInfo, StudentProfile } from '../types';

interface ProfilePageProps {
  profile: StudentProfile;
  onResetData: () => void;
  onToggleDemo: (enable: boolean) => void;
  onPracticeConcept: (concept: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  onResetData,
  onToggleDemo,
  onPracticeConcept
}) => {
  const conceptEntries = Object.entries(profile.conceptStrengths || {});

  const getStatusBadge = (status: ConceptStrengthInfo['status']) => {
    switch (status) {
      case 'Strong':
        return <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Strong Mastery</span>;
      case 'Good':
        return <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 border border-blue-300">Good Progression</span>;
      case 'Needs Practice':
        return <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#C65D32]/15 text-[#C65D32] border border-[#C65D32]/30">Needs Practice</span>;
      default:
        return <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-300">Developing</span>;
    }
  };

  const getTrendBadge = (trend: ConceptStrengthInfo['trend']) => {
    switch (trend) {
      case 'improving':
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Improving</span>
          </span>
        );
      case 'declining':
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-[#C65D32] bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Needs Attention</span>
          </span>
        );
      case 'stable':
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            <Minus className="w-3.5 h-3.5" />
            <span>Stable</span>
          </span>
        );
      default:
        return (
          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200">
            New Concept
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Profile Card Header */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#332A24]/15 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#234236] text-[#F7F1E3] flex items-center justify-center font-bold text-2xl shadow-sm">
            <GraduationCap className="w-8 h-8 text-[#D6A84F]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-[#234236]">
                {profile.name}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#EDE5D0] text-[#234236] border border-[#332A24]/10">
                {profile.totalAnalyses > 10 ? 'Intermediate Coder' : 'Undergraduate Student'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6B5B52]">
              Tracked learning trajectory across core Computer Science subjects.
            </p>
          </div>
        </div>

        {/* Demo / Reset Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onToggleDemo(!profile.isDemoMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              profile.isDemoMode
                ? 'bg-[#EDE5D0] text-[#234236] border-[#332A24]/20'
                : 'bg-[#234236] text-[#F7F1E3] border-[#234236]'
            }`}
          >
            {profile.isDemoMode ? 'Switch to Real Student Mode' : 'Load Viva Demo Scenario Profile'}
          </button>

          <button
            onClick={onResetData}
            className="p-2 text-xs font-semibold rounded-xl text-[#6B5B52] hover:text-[#C65D32] hover:bg-red-50 border border-[#332A24]/10 transition-colors"
            title="Reset student learning history"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* High-Level Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#332A24]/10 shadow-2xs">
          <span className="text-xs text-[#6B5B52] font-semibold block mb-1">Code Submissions</span>
          <span className="text-3xl font-black text-[#234236] font-mono">{profile.totalAnalyses}</span>
          <span className="text-[11px] text-[#A8B89F] block mt-1">Diagnosed by Gemini</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#332A24]/10 shadow-2xs">
          <span className="text-xs text-[#6B5B52] font-semibold block mb-1">Practice Solved</span>
          <span className="text-3xl font-black text-[#234236] font-mono">{profile.totalPracticesCompleted}</span>
          <span className="text-[11px] text-[#A8B89F] block mt-1">Concept reinforcement problems</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#332A24]/10 shadow-2xs">
          <span className="text-xs text-[#6B5B52] font-semibold block mb-1">Tracked Misconceptions</span>
          <span className="text-3xl font-black text-[#C65D32] font-mono">{profile.recurringMistakes?.length || 0}</span>
          <span className="text-[11px] text-[#A8B89F] block mt-1">Cognitive traps identified</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#332A24]/10 shadow-2xs">
          <span className="text-xs text-[#6B5B52] font-semibold block mb-1">Concepts Mapped</span>
          <span className="text-3xl font-black text-[#D6A84F] font-mono">{conceptEntries.length}</span>
          <span className="text-[11px] text-[#A8B89F] block mt-1">Active skill domains</span>
        </div>
      </div>

      {/* Concept Strengths Matrix */}
      <div className="bg-white p-6 rounded-3xl border border-[#332A24]/15 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#332A24]/10 pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#234236]">Concept Mastery Matrix</h2>
            <p className="text-xs text-[#6B5B52]">
              Honest data: attempts, success ratio, recurring mistakes, and learning velocity.
            </p>
          </div>
          <span className="text-xs font-mono text-[#888]">Updated in real-time</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#332A24]/10 text-[#6B5B52] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Concept Domain</th>
                <th className="py-3 px-4">Mastery Level</th>
                <th className="py-3 px-4">Success Ratio</th>
                <th className="py-3 px-4">Learning Trend</th>
                <th className="py-3 px-4">Known Traps</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#332A24]/5">
              {conceptEntries.map(([conceptName, data]) => {
                const ratio = data.totalAttempts > 0 
                  ? Math.round((data.successfulAttempts / data.totalAttempts) * 100) 
                  : 0;

                return (
                  <tr key={conceptName} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#234236]">
                      {conceptName}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(data.status)}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {data.successfulAttempts} / {data.totalAttempts} ({ratio}%)
                    </td>
                    <td className="py-3.5 px-4">
                      {getTrendBadge(data.trend)}
                    </td>
                    <td className="py-3.5 px-4 text-[#6B5B52]">
                      {data.recurringMistakes.length > 0 ? (
                        <span className="text-[#C65D32]">
                          {data.recurringMistakes.join(', ')}
                        </span>
                      ) : (
                        <span className="text-emerald-700">None detected</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onPracticeConcept(conceptName)}
                        className="px-3 py-1 rounded-lg bg-[#234236] hover:bg-[#2D5445] text-[#F7F1E3] font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        Practice
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
