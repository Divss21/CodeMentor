import { BLANK_STUDENT_PROFILE, DEMO_STUDENT_PROFILE } from "../src/data/demoData";
import { AnalysisResponse, PracticeEvaluation, PracticeQuestion, StudentProfile, SupportedLanguage } from "../src/types";

let currentProfile: StudentProfile = JSON.parse(JSON.stringify(DEMO_STUDENT_PROFILE));

export const store = {
  getProfile(): StudentProfile {
    return currentProfile;
  },

  setDemoMode(enableDemo: boolean): StudentProfile {
    if (enableDemo) {
      currentProfile = JSON.parse(JSON.stringify(DEMO_STUDENT_PROFILE));
    } else {
      currentProfile = JSON.parse(JSON.stringify(BLANK_STUDENT_PROFILE));
    }
    return currentProfile;
  },

  resetProfile(): StudentProfile {
    currentProfile = JSON.parse(JSON.stringify(BLANK_STUDENT_PROFILE));
    return currentProfile;
  },

  recordSubmission(
    language: SupportedLanguage,
    code: string,
    analysis: AnalysisResponse
  ): StudentProfile {
    currentProfile.totalAnalyses += 1;

    // Add to recent activity
    const firstConcept = analysis.detectedConcepts[0] || 'Code Analysis';
    currentProfile.recentActivity.unshift({
      id: `act_${Date.now()}`,
      type: 'analysis',
      title: `${language.toUpperCase()}: ${analysis.possibleMisconceptions[0]?.headline || firstConcept}`,
      timestamp: 'Just now',
      concept: firstConcept,
      language,
      status: analysis.hasErrors ? 'review_needed' : 'passed'
    });
    if (currentProfile.recentActivity.length > 20) {
      currentProfile.recentActivity.pop();
    }

    // Update concept strengths
    for (const concept of analysis.detectedConcepts) {
      // Find matching or default concept category
      const targetCategory = mapConceptToCategory(concept);
      if (!currentProfile.conceptStrengths[targetCategory]) {
        currentProfile.conceptStrengths[targetCategory] = {
          concept: targetCategory,
          status: 'Developing',
          totalAttempts: 0,
          successfulAttempts: 0,
          recurringMistakes: [],
          trend: 'new'
        };
      }

      const item = currentProfile.conceptStrengths[targetCategory];
      item.totalAttempts += 1;
      item.lastAttemptDate = 'Today';

      if (analysis.hasErrors) {
        // Misconception detected
        const errorDesc = analysis.errors[0]?.type || 'Syntax/Logic Gap';
        if (!item.recurringMistakes.includes(errorDesc)) {
          item.recurringMistakes.push(errorDesc);
        }
        item.status = item.totalAttempts < 3 ? 'Developing' : 'Needs Practice';
        item.trend = 'declining';
      } else {
        item.successfulAttempts += 1;
        const successRate = item.successfulAttempts / item.totalAttempts;
        if (successRate >= 0.8 && item.totalAttempts >= 3) {
          item.status = 'Strong';
          item.trend = 'improving';
        } else if (successRate >= 0.5) {
          item.status = 'Good';
          item.trend = 'stable';
        } else {
          item.status = 'Developing';
        }
      }
    }

    // Record recurring mistakes if error present
    if (analysis.hasErrors && analysis.possibleMisconceptions.length > 0) {
      const primaryMisconception = analysis.possibleMisconceptions[0];
      const existingMistake = currentProfile.recurringMistakes.find(
        m => m.concept.toLowerCase() === primaryMisconception.concept.toLowerCase() ||
             m.mistakeType.toLowerCase().includes(primaryMisconception.headline.toLowerCase().slice(0, 10))
      );

      if (existingMistake) {
        existingMistake.count += 1;
        existingMistake.lastSeen = 'Today';
        existingMistake.exampleSnippet = analysis.explanation.problematicCodeSnippet || code.slice(0, 100);
      } else {
        currentProfile.recurringMistakes.unshift({
          id: `mst_${Date.now()}`,
          concept: primaryMisconception.concept,
          mistakeType: primaryMisconception.headline,
          count: 1,
          lastSeen: 'Today',
          language,
          exampleSnippet: analysis.explanation.problematicCodeSnippet || code.slice(0, 100),
          explanation: primaryMisconception.explanation
        });
      }
    }

    return currentProfile;
  },

  recordPracticeAttempt(
    question: PracticeQuestion,
    submittedCode: string,
    evaluation: PracticeEvaluation,
    language: SupportedLanguage
  ): StudentProfile {
    currentProfile.totalPracticesCompleted += 1;

    currentProfile.recentActivity.unshift({
      id: `act_${Date.now()}`,
      type: 'practice',
      title: `${question.title} (${question.difficulty})`,
      timestamp: 'Just now',
      concept: question.concept,
      language,
      status: evaluation.isCorrect ? 'passed' : 'review_needed'
    });
    if (currentProfile.recentActivity.length > 20) {
      currentProfile.recentActivity.pop();
    }

    // Update concept strengths
    const targetCategory = mapConceptToCategory(question.concept);
    if (!currentProfile.conceptStrengths[targetCategory]) {
      currentProfile.conceptStrengths[targetCategory] = {
        concept: targetCategory,
        status: 'Developing',
        totalAttempts: 0,
        successfulAttempts: 0,
        recurringMistakes: [],
        trend: 'new'
      };
    }

    const item = currentProfile.conceptStrengths[targetCategory];
    item.totalAttempts += 1;
    item.lastAttemptDate = 'Today';

    if (evaluation.isCorrect) {
      item.successfulAttempts += 1;
      const rate = item.successfulAttempts / item.totalAttempts;
      if (rate >= 0.8 && item.totalAttempts >= 3) {
        item.status = 'Strong';
      } else {
        item.status = 'Good';
      }
      item.trend = 'improving';
    } else {
      item.status = 'Needs Practice';
      item.trend = 'declining';
    }

    return currentProfile;
  }
};

function mapConceptToCategory(concept: string): string {
  const c = concept.toLowerCase();
  if (c.includes('loop') || c.includes('iteration') || c.includes('for') || c.includes('while')) return 'Loops';
  if (c.includes('array') || c.includes('index') || c.includes('list') || c.includes('boundary')) return 'Arrays';
  if (c.includes('func') || c.includes('return') || c.includes('parameter')) return 'Functions';
  if (c.includes('recurs') || c.includes('base case') || c.includes('stack')) return 'Recursion';
  if (c.includes('class') || c.includes('object') || c.includes('oop') || c.includes('method')) return 'OOP';
  if (c.includes('dict') || c.includes('map') || c.includes('hash') || c.includes('tree') || c.includes('structure')) return 'Data Structures';
  if (c.includes('scope') || c.includes('variable') || c.includes('global') || c.includes('local')) return 'Variables & Scope';
  if (c.includes('error') || c.includes('exception') || c.includes('try') || c.includes('catch')) return 'Error Handling';
  return 'Data Structures';
}
