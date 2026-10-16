import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyzerPage } from './pages/AnalyzerPage';
import { PracticePage } from './pages/PracticePage';
import { MistakesPage } from './pages/MistakesPage';
import { ConceptLibraryPage } from './pages/ConceptLibraryPage';
import { ProfilePage } from './pages/ProfilePage';
import { AnalysisResponse, PracticeEvaluation, PracticeQuestion, StudentProfile } from './types';
import { DEMO_STUDENT_PROFILE, SAMPLE_PYTHON_DEMO_CODE, SAMPLE_PYTHON_DEMO_ANALYSIS } from './data/demoData';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [profile, setProfile] = useState<StudentProfile>(DEMO_STUDENT_PROFILE);
  const [activePracticeQuestion, setActivePracticeQuestion] = useState<PracticeQuestion | null>(null);
  const [analyzerInitialCode, setAnalyzerInitialCode] = useState<string>(SAMPLE_PYTHON_DEMO_CODE);

  // Fetch initial profile
  useEffect(() => {
    fetch('/api/profile')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load profile');
        return res.json();
      })
      .then((data) => {
        if (data) setProfile(data);
      })
      .catch((err) => {
        console.warn('Backend profile fetch note, using local demo profile:', err);
      });
  }, []);

  const handleToggleDemo = async (enable: boolean) => {
    try {
      const res = await fetch('/api/profile/toggle-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enableDemo: enable })
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (e) {
      console.error('Error toggling demo mode:', e);
    }
  };

  const handleResetData = async () => {
    try {
      const res = await fetch('/api/profile/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (e) {
      console.error('Error resetting profile:', e);
    }
  };

  const handleStartPractice = (question: PracticeQuestion) => {
    setActivePracticeQuestion(question);
    setCurrentPage('practice');
  };

  const handleSelectMistakeForPractice = (concept: string) => {
    // Find or craft a matching practice question
    const matched = SAMPLE_PYTHON_DEMO_ANALYSIS.practiceQuestions.find(
      q => q.concept.toLowerCase() === concept.toLowerCase()
    );
    if (matched) {
      setActivePracticeQuestion(matched);
    } else {
      setActivePracticeQuestion({
        id: `practice_${Date.now()}`,
        concept,
        difficulty: 'medium',
        title: `Mastering ${concept}`,
        problemStatement: `Practice problem focusing on fixing common misconceptions in ${concept}. Examine boundary conditions and logic flow.`,
        constraints: ['Handle edge cases such as empty input or single element', 'Ensure termination for recursive or loop logic'],
        examples: [
          { input: '# Valid input test', output: 'Expected valid result', explanation: 'Demonstrates correct handling of boundary cases.' }
        ],
        starterCode: `# Write your solution for ${concept} here:\ndef solve():\n    pass`,
        hints: ['Review edge cases before running the loop.'],
        solutionCode: `def solve():\n    return True`
      });
    }
    setCurrentPage('practice');
  };

  const handleAnalysisSuccess = (analysis: AnalysisResponse) => {
    // Re-fetch profile to sync real-time progress
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(() => {});
  };

  const handlePracticeCompleted = (_eval: PracticeEvaluation) => {
    // Re-sync student profile with updated attempts & streaks
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(() => {});
  };

  return (
    <div className="min-h-screen bg-[#F7F1E3] text-[#332A24] flex flex-col font-sans selection:bg-[#D6A84F]/30 selection:text-[#234236]">
      {/* Top Academic Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        profile={profile}
        onToggleDemo={handleToggleDemo}
      />

      {/* Main Routed Page Container */}
      <main className="flex-1">
        {currentPage === 'landing' && (
          <LandingPage
            onStartLearning={() => setCurrentPage('dashboard')}
            onTryAnalysis={() => setCurrentPage('analyzer')}
            onTryDemo={() => {
              setAnalyzerInitialCode(SAMPLE_PYTHON_DEMO_CODE);
              setCurrentPage('analyzer');
            }}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage
            profile={profile}
            onNavigate={setCurrentPage}
            onSelectMistakeForPractice={handleSelectMistakeForPractice}
            onResetData={handleResetData}
          />
        )}

        {currentPage === 'analyzer' && (
          <AnalyzerPage
            initialCode={analyzerInitialCode}
            onStartPractice={handleStartPractice}
            onAnalysisSuccess={handleAnalysisSuccess}
          />
        )}

        {currentPage === 'practice' && (
          <PracticePage
            profile={profile}
            activeQuestion={activePracticeQuestion}
            onPracticeCompleted={handlePracticeCompleted}
          />
        )}

        {currentPage === 'mistakes' && (
          <MistakesPage
            profile={profile}
            onPracticeConcept={handleSelectMistakeForPractice}
          />
        )}

        {currentPage === 'library' && (
          <ConceptLibraryPage
            onPracticeConcept={handleSelectMistakeForPractice}
          />
        )}

        {currentPage === 'profile' && (
          <ProfilePage
            profile={profile}
            onResetData={handleResetData}
            onToggleDemo={handleToggleDemo}
            onPracticeConcept={handleSelectMistakeForPractice}
          />
        )}
      </main>
    </div>
  );
}
