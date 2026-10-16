import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  ArrowRight, 
  Sparkles, 
  AlertTriangle, 
  Lightbulb, 
  BookOpen, 
  Code, 
  ChevronRight
} from 'lucide-react';
import { CONCEPT_LIBRARY, ConceptItem } from '../data/conceptLibrary';

interface ConceptLibraryPageProps {
  onPracticeConcept: (conceptName: string) => void;
}

export const ConceptLibraryPage: React.FC<ConceptLibraryPageProps> = ({
  onPracticeConcept
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<ConceptItem>(CONCEPT_LIBRARY[0]);

  const categories = [
    { id: 'all', label: 'All Concepts' },
    { id: 'Programming Basics', label: 'Programming Basics' },
    { id: 'Data Structures', label: 'Data Structures' },
    { id: 'Advanced', label: 'Advanced Topics' },
  ];

  const filteredArticles = CONCEPT_LIBRARY.filter((art) => {
    if (selectedCategory !== 'all' && art.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        art.name.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.detailedExplanation.toLowerCase().includes(q) ||
        art.commonMisconceptions.some((m: string) => m.toLowerCase().includes(q));
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
            <span className="w-2.5 h-2.5 rounded-full bg-[#234236]"></span>
            <span className="text-xs uppercase font-bold tracking-wider text-[#234236]">Pedagogical Reference</span>
          </div>
          <h1 className="text-2xl font-black text-[#234236] tracking-tight">
            Concept Library & Mental Models
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B52]">
            Crystal-clear explanations, intuition diagrams, and common traps for core CS concepts.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#EDE5D0] p-1 rounded-xl border border-[#332A24]/10 text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedCategory === c.id
                  ? 'bg-[#234236] text-[#F7F1E3] shadow-xs font-bold'
                  : 'text-[#6B5B52] hover:text-[#234236]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#6B5B52] absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Search concepts, common misconceptions, or syntax..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#332A24]/15 rounded-xl text-xs text-[#332A24] focus:outline-hidden focus:border-[#234236] shadow-2xs"
        />
      </div>

      {/* Split View: List on Left, Active Article on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Concepts */}
        <div className="lg:col-span-4 space-y-2.5">
          {filteredArticles.map((art) => {
            const isSelected = activeArticle.id === art.id;
            return (
              <div
                key={art.id}
                onClick={() => setActiveArticle(art)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#234236] text-[#F7F1E3] border-[#234236] shadow-sm'
                    : 'bg-white hover:bg-[#FDFBF7] text-[#332A24] border-[#332A24]/10 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-white/20 text-[#D6A84F]' : 'bg-[#EDE5D0] text-[#234236]'
                  }`}>
                    {art.category}
                  </span>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-[#D6A84F]' : 'text-gray-400'}`} />
                </div>
                <h3 className="font-bold text-sm mb-1">{art.name}</h3>
                <p className={`text-xs line-clamp-2 ${isSelected ? 'text-[#A8B89F]' : 'text-[#6B5B52]'}`}>
                  {art.summary}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column: In-Depth Article Viewer */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#332A24]/15 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#332A24]/10 pb-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#C65D32] block mb-1">
                {activeArticle.category}
              </span>
              <h2 className="text-2xl font-black text-[#234236]">
                {activeArticle.name}
              </h2>
            </div>

            <button
              onClick={() => onPracticeConcept(activeArticle.name)}
              className="px-4 py-2 rounded-xl bg-[#234236] hover:bg-[#2D5445] text-[#F7F1E3] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D6A84F]" />
              <span>Practice This Concept</span>
            </button>
          </div>

          {/* Simple Explanation & Summary */}
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#234236] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#D6A84F]" />
              Intuitive Explanation
            </span>
            <p className="text-sm text-[#332A24] leading-relaxed bg-[#F7F1E3]/70 p-4 rounded-xl border border-[#332A24]/10">
              {activeArticle.detailedExplanation}
            </p>
          </div>

          {/* Code Example: Bad Code vs Good Code */}
          <div className="space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-[#234236] flex items-center gap-1.5">
              <Code className="w-4 h-4 text-[#234236]" />
              Code Comparison ({activeArticle.codeExample.language.toUpperCase()})
            </span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#C65D32]">Common Buggy Pattern:</span>
                <pre className="p-3 bg-[#21252B] rounded-xl text-xs font-mono text-[#E06C75] overflow-x-auto whitespace-pre">
                  {activeArticle.codeExample.badCode}
                </pre>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700">Corrected & Idiomatic Approach:</span>
                <pre className="p-3 bg-[#21252B] rounded-xl text-xs font-mono text-[#98C379] overflow-x-auto whitespace-pre">
                  {activeArticle.codeExample.goodCode}
                </pre>
              </div>
            </div>

            {activeArticle.codeExample.notes && (
              <p className="text-xs text-[#6B5B52] italic bg-[#EDE5D0]/50 p-2.5 rounded-lg border border-[#332A24]/10">
                💡 <strong>Key note:</strong> {activeArticle.codeExample.notes}
              </p>
            )}
          </div>

          {/* Common Misconceptions */}
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#C65D32] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#C65D32]" />
              Common Student Pitfalls & Misconceptions
            </span>
            <div className="space-y-2">
              {activeArticle.commonMisconceptions.map((mistake: string, idx: number) => (
                <div key={idx} className="p-3 bg-red-50/70 border border-red-200 rounded-xl text-xs text-red-900 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
                  <span>{mistake}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related Concepts */}
          {activeArticle.relatedConcepts?.length > 0 && (
            <div className="pt-3 border-t border-[#332A24]/10">
              <span className="text-xs font-bold text-[#6B5B52] mr-2">Related Concepts:</span>
              <div className="inline-flex flex-wrap gap-1.5 mt-1">
                {activeArticle.relatedConcepts.map((rc: string, i: number) => (
                  <span key={i} className="text-xs px-2.5 py-0.5 rounded-md bg-[#EDE5D0] text-[#234236] font-medium border border-[#332A24]/10">
                    {rc}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
