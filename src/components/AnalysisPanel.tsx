import React, { useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Lightbulb, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Bookmark, 
  Code, 
  BookOpen, 
  ChevronRight,
  Flame,
  KeyRound,
  Compass
} from 'lucide-react';
import { AnalysisResponse, ExplanationLevel, PracticeQuestion } from '../types';

interface AnalysisPanelProps {
  analysis: AnalysisResponse | null;
  level: ExplanationLevel;
  onLevelChange: (lvl: ExplanationLevel) => void;
  onStartPractice: (question: PracticeQuestion) => void;
  isLoading: boolean;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  analysis,
  level,
  onLevelChange,
  onStartPractice,
  isLoading
}) => {
  const [unlockedHintIndex, setUnlockedHintIndex] = useState<number>(0);
  const [showConceptExplanation, setShowConceptExplanation] = useState<boolean>(false);
  const [showFullSolution, setShowFullSolution] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'explanation' | 'hints' | 'practice'>('explanation');

  if (isLoading) {
    return (
      <div className="h-full min-h-[460px] flex flex-col items-center justify-center p-8 bg-white/80 rounded-2xl border border-[#332A24]/10 shadow-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#234236]/10 text-[#234236] flex items-center justify-center mb-4 animate-bounce">
          <Sparkles className="w-7 h-7 text-[#C65D32]" />
        </div>
        <h3 className="text-lg font-bold text-[#234236] mb-1">Diagnosing Cognitive Gap...</h3>
        <p className="text-sm text-[#6B5B52] max-w-sm">
          CodeMentor is inspecting syntax, mapping loop boundaries, and detecting possible underlying misconceptions.
        </p>
        <div className="mt-6 flex items-center gap-2 text-xs font-mono text-[#D6A84F]">
          <span className="w-2 h-2 rounded-full bg-[#D6A84F] animate-ping"></span>
          <span>Analyzing execution frames & concept maps...</span>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="h-full min-h-[460px] flex flex-col items-center justify-center p-8 bg-[#FDFBF7] rounded-2xl border border-dashed border-[#332A24]/20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#EDE5D0] flex items-center justify-center mb-4 text-[#234236]">
          <Compass className="w-8 h-8 text-[#234236]" />
        </div>
        <h3 className="text-lg font-bold text-[#234236] mb-2">Ready to Decode Your Logic</h3>
        <p className="text-sm text-[#6B5B52] max-w-md mb-6 leading-relaxed">
          Submit your code on the left or click <span className="font-semibold text-[#C65D32]">"Load Demo Scenario"</span>. We won't just dump a patch—we'll pinpoint what tripped you up and guide your conceptual growth.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md w-full text-left text-xs">
          <div className="p-3 bg-white rounded-xl border border-[#332A24]/10">
            <span className="font-bold text-[#234236] block mb-1">🌱 Progressive Hints</span>
            <span className="text-[#6B5B52]">3 gentle nudges before spoiling the solution.</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#332A24]/10">
            <span className="font-bold text-[#234236] block mb-1">🎯 Targeted Practice</span>
            <span className="text-[#6B5B52]">Questions crafted for your exact misconception.</span>
          </div>
        </div>
      </div>
    );
  }

  const primaryMisconception = analysis.possibleMisconceptions?.[0];

  return (
    <div className="flex flex-col h-full bg-[#FDFBF7] rounded-2xl border border-[#332A24]/15 shadow-md overflow-hidden">
      {/* Header with Level Switcher */}
      <div className="p-4 bg-white border-b border-[#332A24]/10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              analysis.hasErrors 
                ? 'bg-[#C65D32]/15 text-[#C65D32] border border-[#C65D32]/30' 
                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}>
              {analysis.hasErrors ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              {analysis.hasErrors ? 'Concept Gap Identified' : 'Valid Code Structure'}
            </span>
          </div>

          {/* Explanation Level Selector */}
          <div className="flex items-center gap-1 bg-[#EDE5D0] p-1 rounded-xl border border-[#332A24]/10 text-xs">
            <span className="px-1 text-[11px] font-semibold text-[#6B5B52] hidden sm:inline">Depth:</span>
            {(['beginner', 'intermediate', 'advanced'] as ExplanationLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => onLevelChange(lvl)}
                className={`px-2.5 py-1 rounded-lg font-medium capitalize transition-all ${
                  level === lvl 
                    ? 'bg-[#234236] text-[#F7F1E3] shadow-xs' 
                    : 'text-[#6B5B52] hover:text-[#234236]'
                }`}
              >
                {lvl === 'beginner' && '🌱 '}
                {lvl === 'intermediate' && '📚 '}
                {lvl === 'advanced' && '🧠 '}
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Code Summary */}
        <p className="text-xs sm:text-sm text-[#332A24] bg-[#F7F1E3] p-3 rounded-xl border border-[#332A24]/10 leading-relaxed">
          <strong className="text-[#234236] font-semibold">Intent: </strong>
          {analysis.summary}
        </p>

        {/* Concept Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          <span className="text-xs font-semibold text-[#6B5B52]">Concepts detected:</span>
          {analysis.detectedConcepts.map((concept, idx) => (
            <span 
              key={idx}
              className="text-xs px-2.5 py-0.5 rounded-md bg-[#234236]/10 text-[#234236] font-medium border border-[#234236]/15"
            >
              {concept}
            </span>
          ))}
        </div>
      </div>

      {/* Main Analysis Tabs */}
      <div className="flex border-b border-[#332A24]/10 bg-[#EDE5D0]/50 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('explanation')}
          className={`flex-1 py-2.5 px-4 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'explanation'
              ? 'border-[#234236] text-[#234236] bg-white'
              : 'border-transparent text-[#6B5B52] hover:text-[#234236]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Understanding & Why</span>
        </button>
        <button
          onClick={() => setActiveTab('hints')}
          className={`flex-1 py-2.5 px-4 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'hints'
              ? 'border-[#C65D32] text-[#C65D32] bg-white'
              : 'border-transparent text-[#6B5B52] hover:text-[#C65D32]'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Progressive Hints ({unlockedHintIndex}/{analysis.hints?.length || 3})</span>
        </button>
        <button
          onClick={() => setActiveTab('practice')}
          className={`flex-1 py-2.5 px-4 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'practice'
              ? 'border-[#D6A84F] text-[#332A24] bg-white'
              : 'border-transparent text-[#6B5B52] hover:text-[#332A24]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D6A84F]" />
          <span>Practice ({analysis.practiceQuestions?.length || 0})</span>
        </button>
      </div>

      {/* Scrollable Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Tab 1: Explanation */}
        {activeTab === 'explanation' && (
          <div className="space-y-4">
            {/* Misconception Diagnostic Card */}
            {primaryMisconception && (
              <div className="p-4 rounded-xl bg-white border-l-4 border-l-[#C65D32] border border-[#332A24]/10 shadow-xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <Flame className="w-4 h-4 text-[#C65D32]" />
                  <h4 className="text-xs uppercase font-bold text-[#C65D32] tracking-wider">
                    Possible Concept Gap: {primaryMisconception.concept}
                  </h4>
                </div>
                <h3 className="text-sm font-bold text-[#234236] mb-1.5">
                  {primaryMisconception.headline}
                </h3>
                <p className="text-xs text-[#332A24] leading-relaxed mb-2">
                  {primaryMisconception.explanation}
                </p>
                <div className="text-[11px] text-[#6B5B52] bg-[#F7F1E3] p-2.5 rounded-lg border border-[#332A24]/10">
                  <span className="font-semibold text-[#234236]">Under the hood: </span>
                  {primaryMisconception.reasoning}
                </div>
              </div>
            )}

            {/* Error Detail Card if present */}
            {analysis.errors?.length > 0 && (
              <div className="p-3 bg-red-50/80 rounded-xl border border-red-200 text-xs">
                <div className="flex items-center gap-2 text-red-800 font-bold mb-1">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>{analysis.errors[0].type}</span>
                  {analysis.errors[0].location && (
                    <span className="px-2 py-0.5 bg-red-100 rounded text-[10px] text-red-700">
                      {analysis.errors[0].location}
                    </span>
                  )}
                </div>
                <p className="text-red-700 leading-relaxed">
                  {analysis.errors[0].explanation}
                </p>
              </div>
            )}

            {/* What Happened & Why */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-[#332A24]/10 shadow-2xs">
                <span className="text-xs font-bold text-[#234236] block mb-1 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#C65D32]" />
                  What happened?
                </span>
                <p className="text-xs text-[#6B5B52] leading-relaxed">
                  {analysis.explanation.whatHappened}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#332A24]/10 shadow-2xs">
                <span className="text-xs font-bold text-[#234236] block mb-1 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-[#D6A84F]" />
                  Why did it happen?
                </span>
                <p className="text-xs text-[#6B5B52] leading-relaxed">
                  {analysis.explanation.whyItHappened}
                </p>
              </div>
            </div>

            {/* Small Unrelated Example */}
            {analysis.explanation.smallExample && (
              <div className="p-3.5 rounded-xl bg-[#234236]/5 border border-[#234236]/15">
                <span className="text-xs font-bold text-[#234236] block mb-1.5 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-[#234236]" />
                  Small concept demonstration (unrelated example)
                </span>
                <pre className="text-xs font-mono p-2.5 rounded-lg bg-[#21252B] text-[#98C379] overflow-x-auto whitespace-pre">
                  {analysis.explanation.smallExample}
                </pre>
              </div>
            )}

            {/* Side by side / Comparison: Your code vs Correct Approach */}
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="text-xs font-bold text-amber-900 block mb-1">
                  Your code snippet to examine:
                </span>
                <pre className="text-xs font-mono p-2 rounded bg-white text-amber-950 border border-amber-200 overflow-x-auto">
                  {analysis.explanation.problematicCodeSnippet}
                </pre>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-900 block mb-1">
                  Correct approach:
                </span>
                <pre className="text-xs font-mono p-2 rounded bg-white text-emerald-950 border border-emerald-200 overflow-x-auto">
                  {analysis.explanation.correctApproachCode}
                </pre>
                <p className="text-xs text-emerald-800 mt-1.5">
                  {analysis.explanation.correctApproachExplanation}
                </p>
              </div>
            </div>

            {/* "Remember this" takeaway callout */}
            <div className="p-3.5 rounded-xl bg-[#D6A84F]/15 border border-[#D6A84F]/30 flex items-start gap-3">
              <Bookmark className="w-4 h-4 text-[#D6A84F] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#332A24] block">Remember this rule:</span>
                <p className="text-xs text-[#332A24] font-medium mt-0.5">
                  "{analysis.explanation.rememberThisTakeaway || analysis.takeaway}"
                </p>
              </div>
            </div>

            {/* Direct CTA into Practice */}
            <div className="p-4 rounded-xl bg-[#234236] text-[#F7F1E3] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-sm">"Let's make sure it actually clicked."</h4>
                <p className="text-xs text-[#A8B89F]">Try 3 personalized questions targeting this concept.</p>
              </div>
              <button
                onClick={() => setActiveTab('practice')}
                className="px-4 py-2 rounded-lg bg-[#C65D32] hover:bg-[#D96B3E] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                <span>Start Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Progressive Hints */}
        {activeTab === 'hints' && (
          <div className="space-y-4">
            <div className="bg-[#F7F1E3] p-3 rounded-xl border border-[#332A24]/10 text-xs text-[#6B5B52]">
              <strong className="text-[#234236]">Cognitive principle: </strong>
              Revealing an answer immediately robs your brain of the "Aha!" moment. Work through each progressive hint step by step before viewing the solution.
            </div>

            {/* Hint Steps */}
            <div className="space-y-3">
              {analysis.hints?.map((hint, idx) => {
                const isUnlocked = idx < unlockedHintIndex;
                const isNext = idx === unlockedHintIndex;

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isUnlocked
                        ? 'bg-white border-[#234236]/30 shadow-2xs'
                        : isNext
                        ? 'bg-white border-dashed border-[#C65D32] shadow-xs'
                        : 'bg-gray-100/70 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                          isUnlocked 
                            ? 'bg-[#234236] text-[#F7F1E3]' 
                            : 'bg-gray-300 text-gray-700'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-[#234236]">
                          {hint.title}
                        </span>
                      </div>

                      {!isUnlocked && isNext && (
                        <button
                          onClick={() => setUnlockedHintIndex(idx + 1)}
                          className="px-3 py-1 text-xs font-bold rounded-md bg-[#C65D32] text-white hover:bg-[#D96B3E] transition-colors cursor-pointer"
                        >
                          Unlock Hint {idx + 1}
                        </button>
                      )}
                    </div>

                    {isUnlocked ? (
                      <p className="text-xs text-[#332A24] leading-relaxed pl-7">
                        {hint.text}
                      </p>
                    ) : (
                      <p className="text-xs text-[#888] italic pl-7">
                        Locked hint. Solve it yourself or click Unlock above.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Deep Concept Explanation Button */}
            <div className="pt-2 border-t border-[#332A24]/10 space-y-2">
              <button
                onClick={() => setShowConceptExplanation(!showConceptExplanation)}
                className="w-full py-2 px-3 rounded-lg border border-[#234236]/20 bg-white hover:bg-[#F7F1E3] text-xs font-bold text-[#234236] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[#D6A84F]" />
                  Deep Concept Theory ({level})
                </span>
                {showConceptExplanation ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>

              {showConceptExplanation && (
                <div className="p-3 bg-white rounded-xl border border-[#234236]/15 text-xs text-[#332A24] leading-relaxed animate-fadeIn">
                  {analysis.conceptExplanationDeep}
                </div>
              )}

              {/* Reveal Solution Button */}
              <button
                onClick={() => setShowFullSolution(!showFullSolution)}
                className="w-full py-2 px-3 rounded-lg border border-[#C65D32]/30 bg-[#C65D32]/5 hover:bg-[#C65D32]/10 text-xs font-bold text-[#C65D32] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4" />
                  {showFullSolution ? 'Hide Working Solution' : 'Show Full Solution Code'}
                </span>
                {showFullSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>

              {showFullSolution && (
                <div className="p-3 bg-[#21252B] rounded-xl text-xs text-[#98C379] font-mono overflow-x-auto whitespace-pre animate-fadeIn">
                  {analysis.correctedCode}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Personalized Practice */}
        {activeTab === 'practice' && (
          <div className="space-y-3">
            <div className="p-3 bg-[#EDE5D0]/60 rounded-xl border border-[#332A24]/10 text-xs">
              <span className="font-bold text-[#234236] block mb-0.5">
                Targeting your detected weakness:
              </span>
              <span className="text-[#6B5B52]">
                {primaryMisconception?.concept || 'Programming Concept'}. These 3 challenges step from basic validation up to algorithmic reasoning.
              </span>
            </div>

            <div className="space-y-3">
              {analysis.practiceQuestions?.map((q, idx) => {
                const diffColor = 
                  q.difficulty === 'easy' ? 'bg-green-100 text-green-800 border-green-300' :
                  q.difficulty === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                  'bg-purple-100 text-purple-800 border-purple-300';

                return (
                  <div 
                    key={q.id || idx}
                    className="p-3.5 bg-white rounded-xl border border-[#332A24]/10 shadow-2xs hover:border-[#234236]/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${diffColor}`}>
                          {q.difficulty}
                        </span>
                        <span className="text-[11px] font-mono text-[#6B5B52]">
                          Concept: {q.concept}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#234236] mb-1">
                        {q.title}
                      </h4>
                      <p className="text-xs text-[#6B5B52] line-clamp-2 mb-3">
                        {q.problemStatement}
                      </p>
                    </div>

                    <button
                      onClick={() => onStartPractice(q)}
                      className="w-full py-1.5 px-3 rounded-lg bg-[#234236] hover:bg-[#2D5445] text-[#F7F1E3] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Solve in Practice Lab</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
