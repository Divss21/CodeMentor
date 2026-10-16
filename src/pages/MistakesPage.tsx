import React, { useState } from 'react';
import { 
  History, 
  Flame, 
  Code2, 
  Calendar, 
  Filter, 
  ArrowRight, 
  Sparkles,
  Search,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { RecurringMistake, StudentProfile } from '../types';

interface MistakesPageProps {
  profile: StudentProfile;
  onPracticeConcept: (concept: string) => void;
}

export const MistakesPage: React.FC<MistakesPageProps> = ({
  profile,
  onPracticeConcept
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedConcept, setSelectedConcept] = useState<string>('all');

  const mistakes = profile.recurringMistakes || [];

  const availableConcepts = Array.from(new Set(mistakes.map(m => m.concept)));
  const availableLanguages = Array.from(new Set(mistakes.map(m => m.language)));

  const filteredMistakes = mistakes.filter((m) => {
    if (selectedLanguage !== 'all' && m.language !== selectedLanguage) return false;
    if (selectedConcept !== 'all' && m.concept !== selectedConcept) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        m.concept.toLowerCase().includes(q) ||
        m.mistakeType.toLowerCase().includes(q) ||
        m.explanation.toLowerCase().includes(q) ||
        m.exampleSnippet.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#332A24]/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C65D32]"></span>
            <span className="text-xs uppercase font-bold tracking-wider text-[#C65D32]">Cognitive Misconception Archive</span>
          </div>
          <h1 className="text-2xl font-black text-[#234236] tracking-tight">
            My Mistakes & Cognitive Gaps
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B52]">
            "A mistake is just an unlearned rule." Review patterns that tripped you up and practice until mastery.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#6B5B52] bg-[#EDE5D0] px-3.5 py-1.5 rounded-xl border border-[#332A24]/10">
          <Flame className="w-4 h-4 text-[#C65D32]" />
          <span>{mistakes.length} Recurring Patterns Cataloged</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-[#332A24]/10 shadow-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#6B5B52] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search mistakes, concepts or snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#FDFBF7] border border-[#332A24]/15 rounded-xl text-xs text-[#332A24] focus:outline-hidden focus:border-[#234236]"
          />
        </div>

        {/* Concept Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#6B5B52] whitespace-nowrap">Concept:</span>
          <select
            value={selectedConcept}
            onChange={(e) => setSelectedConcept(e.target.value)}
            className="w-full bg-[#FDFBF7] border border-[#332A24]/15 rounded-xl px-3 py-2 text-xs text-[#332A24] focus:outline-hidden"
          >
            <option value="all">All Concepts</option>
            {availableConcepts.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Language Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#6B5B52] whitespace-nowrap">Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full bg-[#FDFBF7] border border-[#332A24]/15 rounded-xl px-3 py-2 text-xs text-[#332A24] focus:outline-hidden"
          >
            <option value="all">All Languages</option>
            {availableLanguages.map((l) => (
              <option key={l} value={l}>{l.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mistakes List */}
      {filteredMistakes.length > 0 ? (
        <div className="space-y-4">
          {filteredMistakes.map((mistake) => (
            <div
              key={mistake.id}
              className="p-5 rounded-2xl bg-white border border-[#332A24]/15 shadow-xs hover:border-[#C65D32]/40 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#332A24]/5 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-[#234236]/10 text-[#234236]">
                    {mistake.concept}
                  </span>
                  <span className="text-xs font-mono uppercase text-[#6B5B52] px-2 py-0.5 rounded bg-gray-100">
                    {mistake.language}
                  </span>
                  <span className="text-xs text-[#888] flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    Last seen {mistake.lastSeen}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#C65D32] text-white flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    {mistake.count} occurrences
                  </span>
                  <button
                    onClick={() => onPracticeConcept(mistake.concept)}
                    className="px-3 py-1 rounded-lg bg-[#234236] hover:bg-[#2D5445] text-[#F7F1E3] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Practice Fix</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#234236] mb-1">
                  {mistake.mistakeType}
                </h3>
                <p className="text-xs text-[#6B5B52] leading-relaxed">
                  {mistake.explanation}
                </p>
              </div>

              {/* Code snippet */}
              {mistake.exampleSnippet && (
                <div className="bg-[#21252B] p-3 rounded-xl border border-[#332A24]/20 text-xs font-mono text-[#E06C75] overflow-x-auto whitespace-pre">
                  <div className="text-[10px] text-[#5C6370] uppercase font-bold mb-1">
                    Problematic code snapshot:
                  </div>
                  {mistake.exampleSnippet}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-[#332A24]/15">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#234236] mb-1">No Mistakes Found</h3>
          <p className="text-xs text-[#6B5B52] max-w-sm mx-auto">
            {searchQuery
              ? 'No misconceptions match your current filter query.'
              : 'You have no logged errors yet! Run an analysis in the Code Analyzer to start building your record.'}
          </p>
        </div>
      )}
    </div>
  );
};
