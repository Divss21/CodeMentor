import React from 'react';
import { 
  Code2, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  Layers, 
  GraduationCap, 
  Terminal, 
  Lightbulb,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { SupportedLanguage } from '../types';

interface LandingPageProps {
  onStartLearning: () => void;
  onTryAnalysis: () => void;
  onTryDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartLearning,
  onTryAnalysis,
  onTryDemo
}) => {
  const supportedLangs: Array<{ name: string; icon: string; desc: string }> = [
    { name: 'Python', icon: '🐍', desc: 'Indentation, list slices & exceptions' },
    { name: 'JavaScript', icon: '⚡', desc: 'Type coercion, closures & scope' },
    { name: 'C++', icon: '⚙️', desc: 'Pointers, memory bounds & loops' },
    { name: 'Java', icon: '☕', desc: 'OOP, null pointer safety & collections' },
  ];

  const features = [
    {
      icon: Flame,
      title: 'Cognitive Gap Detection',
      desc: 'Instead of just flagging line numbers, CodeMentor diagnoses the underlying misunderstanding (e.g. confusing loop position with valid index bounds).'
    },
    {
      icon: Lightbulb,
      title: 'Progressive Hint System',
      desc: 'Three calibrated clues (subtle clue → direct pointer → strong guidance) encourage active student recall before spoiling the full solution.'
    },
    {
      icon: Sparkles,
      title: 'Personalized Practice Lab',
      desc: 'Automatically generates 3 tailored problems (Easy, Medium, Challenge) targeting the specific misconception until it actually clicks.'
    },
    {
      icon: GraduationCap,
      title: 'Persistent Learning Profile',
      desc: 'Tracks recurring mistakes, concept strengths, and improvement trends so students and viva examiners see measurable progress.'
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between paper-pattern">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center">
        {/* Viva Mini-Project Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDE5D0] border border-[#332A24]/15 text-xs font-semibold text-[#234236] mb-6 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#C65D32] animate-pulse"></span>
          <span>GenAI CSE Viva & Presentation Ready • Code → Concept Tutor</span>
        </div>

        {/* Primary Hero Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#234236] tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Don't Just Fix Your Code. <br />
          <span className="text-[#C65D32] relative inline-block">
            Understand It.
            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
              <path d="M0,5 Q50,0 100,5" stroke="#D6A84F" strokeWidth="4" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-lg sm:text-xl text-[#6B5B52] max-w-2xl mx-auto leading-relaxed">
          CodeMentor AI finds the concept behind your coding mistakes, explains it simply with progressive hints, and helps you practice until it clicks.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onStartLearning}
            className="px-6 py-3.5 rounded-xl bg-[#234236] hover:bg-[#2D5445] text-[#F7F1E3] font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onTryAnalysis}
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-[#FDFBF7] text-[#234236] font-bold text-sm border border-[#332A24]/20 shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Code2 className="w-4 h-4 text-[#C65D32]" />
            <span>Try Code Analysis</span>
          </button>

          <button
            onClick={onTryDemo}
            className="px-5 py-3 rounded-xl bg-[#EDE5D0] hover:bg-[#E3D9BE] text-[#332A24] font-semibold text-xs border border-[#332A24]/20 flex items-center gap-2 cursor-pointer"
            title="Pre-loads canonical Python indexing demonstration scenario for examination"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C65D32]" />
            <span>Run Python Demo Scenario</span>
          </button>
        </div>

        {/* Example Analysis Snapshot Preview */}
        <div className="mt-14 max-w-4xl mx-auto text-left">
          <div className="bg-[#1E1E1E] rounded-2xl shadow-xl overflow-hidden border border-[#332A24]/30">
            <div className="px-4 py-2.5 bg-[#2D2D2D] flex items-center justify-between border-b border-[#3D3D3D]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#E06C75]"></span>
                <span className="w-3 h-3 rounded-full bg-[#E5C07B]"></span>
                <span className="w-3 h-3 rounded-full bg-[#98C379]"></span>
                <span className="ml-2 text-xs font-mono text-[#ABB2BF]">sample_index_error.py — CodeMentor AI Diagnostics</span>
              </div>
              <span className="text-[11px] font-mono text-[#D6A84F] bg-[#332A24] px-2 py-0.5 rounded">Python 3.12</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#3D3D3D]">
              {/* Left code snapshot */}
              <div className="p-4 font-mono text-xs leading-relaxed text-[#ABB2BF] bg-[#1E1E1E]">
                <div className="text-[#5C6370] mb-2"># Student submitted code:</div>
                <div><span className="text-[#E06C75]">numbers</span> = [10, 20, 30]</div>
                <div className="mt-2"><span className="text-[#C678DD]">for</span> i <span className="text-[#C678DD]">in</span> <span className="text-[#61AFEF]">range</span>(<span className="text-[#61AFEF]">len</span>(numbers)):</div>
                <div className="bg-[#E06C75]/20 text-[#E06C75] px-1 py-0.5 rounded border border-[#E06C75]/40 mt-1">
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#61AFEF]">print</span>(numbers[i + 1]) <span className="text-[#E06C75] font-bold"># IndexError!</span>
                </div>
              </div>

              {/* Right pedagogical concept response */}
              <div className="p-4 bg-[#282C34] text-xs space-y-2.5">
                <div className="flex items-center gap-1.5 text-[#E5C07B] font-bold">
                  <Flame className="w-4 h-4 text-[#C65D32]" />
                  <span>Detected Gap: List Index Boundaries</span>
                </div>
                <p className="text-[#ABB2BF] leading-relaxed">
                  "This may indicate that you are assuming <code className="text-[#98C379]">i + 1</code> is safe on the final iteration. For length 3, valid indices are only 0, 1, 2."
                </p>
                <div className="bg-[#21252B] p-2.5 rounded-lg border border-[#3D3D3D] text-[11px] text-[#98C379]">
                  💡 <strong>Rule of thumb:</strong> The last valid index is always <span className="underline">length - 1</span>.
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#5C6370] pt-1">
                  <span>Progressive hints available (3)</span>
                  <span className="text-[#D6A84F]">3 Practice problems generated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="bg-white/70 border-y border-[#332A24]/10 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C65D32]">The Pedagogical Loop</span>
            <h2 className="text-3xl font-extrabold text-[#234236] mt-1">How CodeMentor AI Teaches</h2>
            <p className="text-sm text-[#6B5B52] mt-2">Moving past shallow error logs to deep understanding.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Submit Code', desc: 'Paste problematic code in Python, C++, Java, or JavaScript.' },
              { step: '02', title: 'Diagnose Misconception', desc: 'AI isolates the cognitive root cause using non-judgmental language.' },
              { step: '03', title: 'Progressive Hints', desc: 'Unlock subtle clues layer-by-layer rather than copying answers.' },
              { step: '04', title: 'Targeted Practice', desc: 'Solve tailored questions until the concept is permanently mastered.' },
            ].map((st, i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#F7F1E3] border border-[#332A24]/10 relative group hover:border-[#234236]/30 transition-all">
                <span className="text-2xl font-extrabold text-[#D6A84F]/60 block mb-2 font-mono">{st.step}</span>
                <h3 className="font-bold text-base text-[#234236] mb-1.5">{st.title}</h3>
                <p className="text-xs text-[#6B5B52] leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-[#234236]">Engineered for Student Success</span>
          <h2 className="text-3xl font-extrabold text-[#234236] mt-1">Why It Outperforms Generic Chatbots</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div 
                key={i}
                className="p-6 rounded-2xl bg-white border border-[#332A24]/10 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#234236]/10 text-[#234236] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#C65D32]" />
                  </div>
                  <h3 className="font-bold text-base text-[#234236] mb-2">{feat.title}</h3>
                  <p className="text-xs text-[#6B5B52] leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Supported Languages */}
      <section className="bg-[#EDE5D0]/60 border-t border-[#332A24]/10 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase font-bold tracking-widest text-[#234236] block mb-2">Supported Language Ecosystem</span>
          <h3 className="text-xl font-bold text-[#234236] mb-6">Built for Core Computer Science Courses</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {supportedLangs.map((lang, idx) => (
              <div key={idx} className="p-4 bg-white rounded-xl border border-[#332A24]/10 shadow-2xs text-left">
                <span className="text-2xl block mb-1">{lang.icon}</span>
                <span className="font-bold text-sm text-[#234236] block">{lang.name}</span>
                <span className="text-[11px] text-[#6B5B52] leading-tight block mt-0.5">{lang.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Academic Footer */}
      <footer className="bg-[#234236] text-[#F7F1E3] py-8 px-4 border-t border-[#332A24]/20 text-center text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[#D6A84F]" />
            <span className="font-bold">CodeMentor AI — AI Code → Concept Tutor</span>
          </div>
          <p className="text-[#A8B89F]">
            Designed for college programming practicals, vivas, and exam preparation.
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-[#D6A84F]">
            <span>Model: Gemini 3.8 Flash</span>
            <span>•</span>
            <span>Full-Stack Express + React</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
