import React, { useState } from 'react';
import { CodeEditor } from '../components/CodeEditor';
import { AnalysisPanel } from '../components/AnalysisPanel';
import { AnalysisResponse, ExplanationLevel, PracticeQuestion, SupportedLanguage } from '../types';
import { SAMPLE_PYTHON_DEMO_CODE } from '../data/demoData';

interface AnalyzerPageProps {
  initialCode?: string;
  initialLanguage?: SupportedLanguage;
  onStartPractice: (question: PracticeQuestion) => void;
  onAnalysisSuccess: (analysis: AnalysisResponse) => void;
}

export const AnalyzerPage: React.FC<AnalyzerPageProps> = ({
  initialCode = SAMPLE_PYTHON_DEMO_CODE,
  initialLanguage = 'python',
  onStartPractice,
  onAnalysisSuccess
}) => {
  const [code, setCode] = useState<string>(initialCode);
  const [language, setLanguage] = useState<SupportedLanguage>(initialLanguage);
  const [level, setLevel] = useState<ExplanationLevel>('beginner');
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!code.trim()) return;

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, level }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server failed to analyze code.');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
      onAnalysisSuccess(data.analysis);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'An error occurred while communicating with CodeMentor.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadDemo = () => {
    setCode(SAMPLE_PYTHON_DEMO_CODE);
    setLanguage('python');
    setAnalysis(null);
    setErrorMessage(null);
  };

  const handleReset = () => {
    setCode('');
    setAnalysis(null);
    setErrorMessage(null);
  };

  const handleLevelChange = async (newLevel: ExplanationLevel) => {
    setLevel(newLevel);
    // If we already have analysis, re-query with new depth level
    if (analysis && code.trim()) {
      setIsAnalyzing(true);
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language, level: newLevel }),
        });
        if (response.ok) {
          const data = await response.json();
          setAnalysis(data.analysis);
        }
      } catch (e) {
        console.error('Failed to change level:', e);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Workspace Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#332A24]/10">
        <div>
          <h1 className="text-2xl font-black text-[#234236] tracking-tight">
            Code & Concept Diagnostic Workspace
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B52]">
            Examine the cognitive mechanics of your code, not just line syntax.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadDemo}
            className="px-3 py-1.5 rounded-lg bg-[#EDE5D0] hover:bg-[#E3D9BE] text-[#234236] text-xs font-semibold border border-[#332A24]/15 transition-colors cursor-pointer"
          >
            Load Python Indexing Bug Demo
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="font-bold underline ml-2">Dismiss</button>
        </div>
      )}

      {/* Main Split Layout: Editor on Left, AI Analysis on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column (Editor): 6 cols on lg */}
        <div className="lg:col-span-6 flex flex-col">
          <CodeEditor
            code={code}
            onChange={setCode}
            language={language}
            onLanguageChange={setLanguage}
            onAnalyze={handleAnalyze}
            onReset={handleReset}
            onLoadDemo={handleLoadDemo}
            isAnalyzing={isAnalyzing}
            errorLine={analysis?.errors?.[0]?.line}
          />
        </div>

        {/* Right Column (AI Analysis): 6 cols on lg */}
        <div className="lg:col-span-6 flex flex-col">
          <AnalysisPanel
            analysis={analysis}
            level={level}
            onLevelChange={handleLevelChange}
            onStartPractice={onStartPractice}
            isLoading={isAnalyzing}
          />
        </div>
      </div>
    </div>
  );
};
