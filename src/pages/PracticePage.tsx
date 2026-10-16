import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  ArrowRight,
  Filter,
  Flame,
  Award,
  BookOpen
} from 'lucide-react';
import { CodeEditor } from '../components/CodeEditor';
import { PracticeEvaluation, PracticeQuestion, StudentProfile, SupportedLanguage } from '../types';
import { SAMPLE_PYTHON_DEMO_ANALYSIS } from '../data/demoData';
import { triggerConfetti } from '../components/Celebration';

interface PracticePageProps {
  profile: StudentProfile;
  activeQuestion?: PracticeQuestion | null;
  onPracticeCompleted: (evaluation: PracticeEvaluation) => void;
}

export const PracticePage: React.FC<PracticePageProps> = ({
  profile,
  activeQuestion = null,
  onPracticeCompleted
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'challenge'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentQuestion, setCurrentQuestion] = useState<PracticeQuestion>(
    activeQuestion || SAMPLE_PYTHON_DEMO_ANALYSIS.practiceQuestions[0]
  );
  const [studentCode, setStudentCode] = useState<string>(
    activeQuestion?.starterCode || SAMPLE_PYTHON_DEMO_ANALYSIS.practiceQuestions[0].starterCode
  );
  const [language, setLanguage] = useState<SupportedLanguage>('python');
  const [unlockedHintIndex, setUnlockedHintIndex] = useState<number>(0);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<PracticeEvaluation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (activeQuestion) {
      setCurrentQuestion(activeQuestion);
      setStudentCode(activeQuestion.starterCode);
      setEvaluation(null);
      setUnlockedHintIndex(0);
      setShowSolution(false);
    }
  }, [activeQuestion]);

  // Pre-loaded questions catalog based on demo analysis and common interview practicals
  const questionsCatalog: PracticeQuestion[] = [
    ...SAMPLE_PYTHON_DEMO_ANALYSIS.practiceQuestions,
    {
      id: 'loop-bounds-1',
      concept: 'Loops',
      difficulty: 'easy',
      title: 'Even Counter Without Off-By-One',
      problemStatement: 'Write a function `count_evens(n)` that returns how many even numbers exist strictly between 1 and n (inclusive). Watch your upper boundary.',
      constraints: ['n is a positive integer', 'Handle n = 1 returning 0'],
      examples: [
        { input: 'n = 5', output: '2', explanation: '2 and 4 are even.' },
        { input: 'n = 6', output: '3', explanation: '2, 4, 6 are even.' }
      ],
      starterCode: `def count_evens(n):\n    # TODO: return count of even numbers from 1 to n\n    count = 0\n    for i in range(1, n + 1):\n        if i % 2 == 0:\n            count += 1\n    return count`,
      hints: ['Remember range(1, n) stops at n-1! You need range(1, n + 1) to be inclusive.'],
      solutionCode: `def count_evens(n):\n    return n // 2`
    },
    {
      id: 'recursion-base-1',
      concept: 'Recursion',
      difficulty: 'medium',
      title: 'Factorial With Proper Base Case',
      problemStatement: 'Write a recursive function `factorial(n)` that calculates n! without causing maximum recursion depth exceeded. Remember to guard for negative input.',
      constraints: ['0! = 1', 'Recursion must terminate at base case'],
      examples: [
        { input: 'n = 4', output: '24', explanation: '4 * 3 * 2 * 1 = 24' },
        { input: 'n = 0', output: '1', explanation: '0! is mathematically 1.' }
      ],
      starterCode: `def factorial(n):\n    # TODO: Add base case and progress toward it\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)`,
      hints: ['Ensure you check n <= 1 as the terminating condition.'],
      solutionCode: `def factorial(n):\n    if n < 0:\n        raise ValueError("Factorial undefined for negative numbers")\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)`
    },
    {
      id: 'dict-safe-lookup-1',
      concept: 'Data Structures',
      difficulty: 'easy',
      title: 'Safe Word Counter',
      problemStatement: 'Given a list of words, return a dictionary with the frequency count of each word. Do not trigger KeyError on the first occurrence.',
      constraints: ['Handle empty list returning {}', 'Do not crash on unseen keys'],
      examples: [
        { input: 'words = ["cat", "dog", "cat"]', output: '{"cat": 2, "dog": 1}' }
      ],
      starterCode: `def count_words(words):\n    freq = {}\n    # TODO: Safely count frequencies\n    for w in words:\n        freq[w] = freq.get(w, 0) + 1\n    return freq`,
      hints: ['Use dict.get(w, 0) to avoid checking if w in freq manually.'],
      solutionCode: `def count_words(words):\n    freq = {}\n    for w in words:\n        freq[w] = freq.get(w, 0) + 1\n    return freq`
    }
  ];

  const filteredQuestions = questionsCatalog.filter((q) => {
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    if (selectedCategory !== 'all' && q.concept !== selectedCategory) return false;
    return true;
  });

  const handleSelectQuestion = (q: PracticeQuestion) => {
    setCurrentQuestion(q);
    setStudentCode(q.starterCode);
    setEvaluation(null);
    setUnlockedHintIndex(0);
    setShowSolution(false);
  };

  const handleSubmitPractice = async () => {
    if (!studentCode.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/practice/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion,
          submittedCode: studentCode,
          language
        })
      });

      if (!res.ok) {
        throw new Error('Failed to evaluate practice submission.');
      }

      const data = await res.json();
      setEvaluation(data.evaluation);
      onPracticeCompleted(data.evaluation);

      if (data.evaluation.isCorrect) {
        triggerConfetti();
      }
    } catch (err: any) {
      console.error('Practice submission error:', err);
      setErrorMessage(err.message || 'Failed to submit practice.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#332A24]/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C65D32]"></span>
            <span className="text-xs uppercase font-bold tracking-wider text-[#C65D32]">Active Recall Lab</span>
          </div>
          <h1 className="text-2xl font-black text-[#234236] tracking-tight">
            Targeted Concept Practice
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B52]">
            "Don't just fix your code. Understand why it went wrong and practice until it clicks."
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty filter */}
          <div className="flex items-center gap-1 bg-[#EDE5D0] p-1 rounded-xl border border-[#332A24]/10 text-xs">
            <span className="px-1 text-[11px] font-semibold text-[#6B5B52]">Difficulty:</span>
            {(['all', 'easy', 'medium', 'challenge'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-[#234236] text-[#F7F1E3] shadow-xs'
                    : 'text-[#6B5B52] hover:text-[#234236]'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Random button */}
          <button
            onClick={() => {
              const rand = questionsCatalog[Math.floor(Math.random() * questionsCatalog.length)];
              handleSelectQuestion(rand);
            }}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FDFBF7] text-[#234236] text-xs font-semibold border border-[#332A24]/20 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D6A84F]" />
            <span>Random Problem</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 text-red-800 rounded-xl border border-red-200 text-xs">
          {errorMessage}
        </div>
      )}

      {/* Main Practice Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 4 Cols: Problem Statement & Test Cases */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-[#332A24]/15 shadow-xs space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${
                  currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800 border-green-300' :
                  currentQuestion.difficulty === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                  'bg-purple-100 text-purple-800 border-purple-300'
                }`}>
                  {currentQuestion.difficulty}
                </span>
                <span className="text-xs font-mono text-[#6B5B52]">
                  Concept: {currentQuestion.concept}
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#234236]">
                {currentQuestion.title}
              </h2>
            </div>

            <p className="text-xs text-[#332A24] leading-relaxed">
              {currentQuestion.problemStatement}
            </p>

            {/* Constraints */}
            {currentQuestion.constraints?.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#234236] block">Constraints:</span>
                <ul className="list-disc list-inside text-xs text-[#6B5B52] space-y-0.5">
                  {currentQuestion.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Examples */}
            {currentQuestion.examples?.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#332A24]/10">
                <span className="text-xs font-bold text-[#234236] block">Example:</span>
                {currentQuestion.examples.map((ex, i) => (
                  <div key={i} className="p-2.5 bg-[#F7F1E3] rounded-lg border border-[#332A24]/10 text-xs font-mono space-y-1">
                    <div><span className="text-[#6B5B52]">Input: </span>{ex.input}</div>
                    <div><span className="text-[#234236] font-bold">Output: </span>{ex.output}</div>
                    {ex.explanation && (
                      <div className="text-[11px] font-sans text-[#6B5B52] italic pt-1">{ex.explanation}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Progressive Hint Drawer */}
            <div className="pt-2 border-t border-[#332A24]/10 space-y-2">
              <span className="text-xs font-bold text-[#234236] flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-[#D6A84F]" />
                Hints ({unlockedHintIndex}/{currentQuestion.hints?.length || 1})
              </span>

              {currentQuestion.hints?.map((h, idx) => {
                const isUnlocked = idx < unlockedHintIndex;
                return (
                  <div key={idx} className="text-xs p-2.5 rounded-lg border bg-[#FDFBF7]">
                    {isUnlocked ? (
                      <p className="text-[#332A24]">{h}</p>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-[#888] italic">Hint {idx + 1} locked</span>
                        <button
                          onClick={() => setUnlockedHintIndex(idx + 1)}
                          className="text-[11px] font-bold text-[#C65D32] hover:underline"
                        >
                          Unlock
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Reveal Solution toggle */}
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="w-full text-center text-xs font-bold text-[#6B5B52] hover:text-[#C65D32] pt-1 flex items-center justify-center gap-1"
              >
                {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showSolution ? 'Hide Reference Solution' : 'Reveal Solution (After Attempting)'}</span>
              </button>

              {showSolution && currentQuestion.solutionCode && (
                <pre className="p-3 bg-[#21252B] rounded-lg text-xs font-mono text-[#98C379] overflow-x-auto whitespace-pre">
                  {currentQuestion.solutionCode}
                </pre>
              )}
            </div>
          </div>

          {/* Quick Problem Switcher List */}
          <div className="bg-white p-4 rounded-2xl border border-[#332A24]/15 shadow-xs space-y-2">
            <span className="text-xs font-bold text-[#234236] block">Other Practice Problems:</span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {filteredQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleSelectQuestion(q)}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                    currentQuestion.id === q.id
                      ? 'bg-[#234236] text-[#F7F1E3] font-bold'
                      : 'hover:bg-[#F7F1E3] text-[#332A24]'
                  }`}
                >
                  <span className="truncate pr-2">{q.title}</span>
                  <span className="text-[10px] uppercase font-mono opacity-80">{q.difficulty}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 8 Cols: Code Editor & AI Evaluation */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl overflow-hidden border border-[#332A24]/15 shadow-sm">
            <CodeEditor
              code={studentCode}
              onChange={setStudentCode}
              language={language}
              onLanguageChange={setLanguage}
              onAnalyze={handleSubmitPractice}
              onReset={() => setStudentCode(currentQuestion.starterCode)}
              onLoadDemo={() => setStudentCode(currentQuestion.starterCode)}
              isAnalyzing={isSubmitting}
            />
          </div>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#332A24]/10 shadow-xs">
            <div className="text-xs text-[#6B5B52]">
              Hit <strong className="text-[#234236]">Submit & Evaluate</strong> to let CodeMentor review your conceptual solution.
            </div>

            <button
              onClick={handleSubmitPractice}
              disabled={isSubmitting || !studentCode.trim()}
              className="px-6 py-2.5 rounded-xl bg-[#234236] hover:bg-[#2D5445] text-[#F7F1E3] font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  <span>Evaluating Logic...</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4 text-[#D6A84F]" />
                  <span>Submit & Evaluate Answer</span>
                </>
              )}
            </button>
          </div>

          {/* AI Evaluation Feedback Card */}
          {evaluation && (
            <div className={`p-6 rounded-2xl border shadow-sm space-y-4 animate-fadeIn ${
              evaluation.isCorrect
                ? 'bg-emerald-50/80 border-emerald-300'
                : 'bg-amber-50/80 border-amber-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {evaluation.isCorrect ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-base text-[#234236]">
                      {evaluation.isCorrect ? 'Concept Mastered! Great Job 🎉' : 'Needs a Slight Conceptual Tweak 👀'}
                    </h3>
                    <span className="text-xs text-[#6B5B52]">
                      Score: {evaluation.score}/100 • Concept Tested: {evaluation.conceptTested}
                    </span>
                  </div>
                </div>
              </div>

              {/* Feedback Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-emerald-200">
                  <span className="font-bold text-emerald-900 block mb-1">✅ What you did well:</span>
                  <p className="text-emerald-800 leading-relaxed">{evaluation.whatYouDidWell}</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-amber-200">
                  <span className="font-bold text-amber-900 block mb-1">🔍 What needs improvement:</span>
                  <p className="text-amber-800 leading-relaxed">{evaluation.whatNeedsImprovement}</p>
                </div>
              </div>

              {/* Mistake detected if any */}
              {evaluation.mistakeDetected && (
                <div className="p-3 bg-white rounded-xl border border-red-200 text-xs">
                  <span className="font-bold text-red-900 block mb-0.5">⚠️ Mistake detected:</span>
                  <p className="text-red-700">{evaluation.mistakeDetected}</p>
                </div>
              )}

              {/* Next step hint */}
              <div className="p-3 bg-white rounded-xl border border-[#332A24]/10 text-xs">
                <span className="font-bold text-[#234236] block mb-0.5">💡 Hint for next attempt:</span>
                <p className="text-[#6B5B52]">{evaluation.hintForImprovement}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
