import React, { useRef } from 'react';
import { Play, RotateCcw, Sparkles, Terminal, Copy, Check } from 'lucide-react';
import { SupportedLanguage } from '../types';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onAnalyze: () => void;
  onReset: () => void;
  onLoadDemo: () => void;
  isAnalyzing: boolean;
  errorLine?: number;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language,
  onLanguageChange,
  onAnalyze,
  onReset,
  onLoadDemo,
  isAnalyzing,
  errorLine,
  readOnly = false,
}) => {
  const [copied, setCopied] = React.useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lines = code.split('\n');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = '    ';

      const newCode = code.substring(0, start) + spaces + code.substring(end);
      onChange(newCode);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const languages: Array<{ id: SupportedLanguage; label: string; icon: string }> = [
    { id: 'python', label: 'Python 3', icon: '🐍' },
    { id: 'javascript', label: 'JavaScript (ES6+)', icon: '⚡' },
    { id: 'cpp', label: 'C++ 20', icon: '⚙️' },
    { id: 'java', label: 'Java 17', icon: '☕' },
  ];

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-[#332A24]/20 shadow-lg bg-[#1E1E1E]">
      {/* Editor Top Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#2D2D2D] border-b border-[#3D3D3D] text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#E06C75]/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#E5C07B]/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#98C379]/80 inline-block"></span>
          </div>

          <div className="h-4 w-px bg-white/15"></div>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#ABB2BF] font-mono">Language:</span>
            <select
              id="language-select"
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              disabled={readOnly || isAnalyzing}
              aria-label="Programming Language"
              className="bg-[#1E1E1E] text-[#D4D4D4] border border-[#444] rounded-md px-2.5 py-1 text-xs font-mono focus:outline-hidden focus:border-[#D6A84F] cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.icon} {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <button
            type="button"
            onClick={onLoadDemo}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-[#332A24] text-[#D6A84F] border border-[#D6A84F]/40 hover:bg-[#3D322B] transition-colors"
            title="Load the canonical Python indexing boundary error demo scenario"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Demo Scenario</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-md text-[#888] hover:text-[#D4D4D4] hover:bg-[#3D3D3D] transition-colors"
            title="Copy Code"
            aria-label="Copy code to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {!readOnly && (
            <button
              type="button"
              onClick={onReset}
              disabled={isAnalyzing}
              className="p-1.5 rounded-md text-[#888] hover:text-[#D4D4D4] hover:bg-[#3D3D3D] transition-colors"
              title="Clear Editor"
              aria-label="Clear code editor"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Code Editor Body with Line Numbers */}
      <div className="relative flex-1 flex overflow-hidden min-h-[340px] max-h-[580px] bg-[#1E1E1E]">
        {/* Line Numbers column */}
        <div className="select-none py-3 px-3 text-right font-mono text-xs text-[#5C6370] bg-[#21252B] border-r border-[#2D3139] min-w-[44px]">
          {lines.map((_, index) => {
            const lineNum = index + 1;
            const isErrorLine = errorLine === lineNum;
            return (
              <div 
                key={index} 
                className={`leading-6 h-6 flex items-center justify-end gap-1 ${
                  isErrorLine ? 'text-[#E06C75] font-bold bg-[#E06C75]/20 -mr-3 pr-3 rounded-l-sm' : ''
                }`}
              >
                {isErrorLine && <span className="w-1.5 h-1.5 rounded-full bg-[#E06C75] animate-pulse"></span>}
                <span>{lineNum}</span>
              </div>
            );
          })}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          id="code-input"
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          placeholder={`# Paste or write your ${language} code here...\n# CodeMentor will analyze your logic, identify concept gaps, and provide progressive hints.`}
          className="w-full h-full p-3 font-mono text-sm leading-6 text-[#ABB2BF] bg-transparent resize-none focus:outline-hidden selection:bg-[#3E4451] overflow-auto whitespace-pre tab-size-4"
        />
      </div>

      {/* Editor Footer / Run Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#21252B] border-t border-[#2D3139] text-xs text-[#828997]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-mono">
            <Terminal className="w-3.5 h-3.5 text-[#98C379]" />
            UTF-8
          </span>
          <span>•</span>
          <span>{lines.length} lines</span>
          <span>•</span>
          <span>{code.length} chars</span>
        </div>

        {!readOnly && (
          <button
            type="button"
            id="run-analyze-button"
            onClick={onAnalyze}
            disabled={isAnalyzing || !code.trim()}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-semibold text-sm transition-all shadow-sm ${
              isAnalyzing || !code.trim()
                ? 'bg-[#333] text-[#777] cursor-not-allowed'
                : 'bg-[#C65D32] hover:bg-[#D96B3E] text-white cursor-pointer active:scale-95'
            }`}
          >
            {isAnalyzing ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Diagnosing Concept...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Analyze Code & Concept</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
