export type SupportedLanguage = 'python' | 'cpp' | 'java' | 'javascript';

export type ExplanationLevel = 'beginner' | 'intermediate' | 'advanced';

export interface CodeErrorItem {
  type: string;
  location?: string;
  line?: number;
  explanation: string;
  severity: 'error' | 'warning' | 'logic_gap';
}

export interface PossibleMisconception {
  concept: string;
  headline: string;
  explanation: string;
  reasoning: string;
}

export interface DetailedExplanation {
  whatHappened: string;
  whyItHappened: string;
  smallExample: string;
  problematicCodeSnippet: string;
  correctApproachCode: string;
  correctApproachExplanation: string;
  rememberThisTakeaway: string;
}

export interface ProgressiveHint {
  level: 1 | 2 | 3;
  title: string;
  text: string;
}

export interface PracticeQuestion {
  id: string;
  concept: string;
  difficulty: 'easy' | 'medium' | 'challenge';
  title: string;
  problemStatement: string;
  constraints: string[];
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  starterCode: string;
  hints: string[];
  solutionCode?: string;
}

export interface AnalysisResponse {
  summary: string;
  hasErrors: boolean;
  errors: CodeErrorItem[];
  detectedConcepts: string[];
  possibleMisconceptions: PossibleMisconception[];
  explanation: DetailedExplanation;
  hints: ProgressiveHint[];
  conceptExplanationDeep: string;
  correctedCode: string;
  takeaway: string;
  practiceQuestions: PracticeQuestion[];
}

export interface PracticeEvaluation {
  isCorrect: boolean;
  score: number; // 0-100
  whatYouDidWell: string;
  whatNeedsImprovement: string;
  conceptTested: string;
  mistakeDetected?: string;
  hintForImprovement: string;
  fullSolution?: string;
}

export interface ConceptStrengthInfo {
  concept: string;
  status: 'Strong' | 'Good' | 'Needs Practice' | 'Developing' | 'Not enough attempts yet';
  totalAttempts: number;
  successfulAttempts: number;
  recurringMistakes: string[];
  lastAttemptDate?: string;
  trend: 'improving' | 'stable' | 'declining' | 'new';
}

export interface RecurringMistake {
  id: string;
  concept: string;
  mistakeType: string;
  count: number;
  lastSeen: string;
  language: SupportedLanguage;
  exampleSnippet: string;
  explanation: string;
}

export interface RecentActivityItem {
  id: string;
  type: 'analysis' | 'practice';
  title: string;
  timestamp: string;
  concept: string;
  language: SupportedLanguage;
  status: 'passed' | 'review_needed' | 'completed';
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  isDemoMode: boolean;
  conceptStrengths: Record<string, ConceptStrengthInfo>;
  recurringMistakes: RecurringMistake[];
  recentActivity: RecentActivityItem[];
  totalAnalyses: number;
  totalPracticesCompleted: number;
}
