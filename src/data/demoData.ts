import { AnalysisResponse, StudentProfile } from '../types';

export const SAMPLE_PYTHON_DEMO_CODE = `numbers = [10, 20, 30]

for i in range(len(numbers)):
    print(numbers[i + 1])`;

export const SAMPLE_PYTHON_DEMO_ANALYSIS: AnalysisResponse = {
  summary: 'The code attempts to iterate through a 3-element list of numbers and print each element shifted ahead by one index.',
  hasErrors: true,
  errors: [
    {
      type: 'IndexError: list index out of range',
      location: 'Line 4',
      line: 4,
      explanation: 'When the loop reaches its final iteration (i = 2), accessing numbers[i + 1] requests index 3, which is beyond the list bounds.',
      severity: 'error'
    }
  ],
  detectedConcepts: [
    'List Indexing',
    'Loop Iteration',
    'Boundary Conditions',
    'Zero-based Indexing'
  ],
  possibleMisconceptions: [
    {
      concept: 'List Index Boundaries',
      headline: 'Confusing loop iteration count with valid index bounds',
      explanation: 'This may indicate that you are assuming the list has an element at index equal to its length, or that i + 1 is safe on the final iteration.',
      reasoning: 'Because range(len(numbers)) loops through i = 0, 1, 2, computing numbers[i + 1] requests numbers[3]. In Python, a list of length 3 only has indices 0, 1, and 2.'
    }
  ],
  explanation: {
    whatHappened: 'The program crashed with an `IndexError: list index out of range` on the 3rd iteration.',
    whyItHappened: 'Arrays and lists in Python are zero-indexed. For a list with N elements, the valid indices run from 0 to N - 1. When `i` equals 2 (the last valid index), `i + 1` becomes 3, which points past the end of the list.',
    smallExample: '# A tiny unrelated example:\nfruits = ["apple", "banana"] # length 2, valid indices: 0 and 1\n# fruits[2] throws IndexError!',
    problematicCodeSnippet: 'for i in range(len(numbers)):\n    print(numbers[i + 1]) # <- On last turn, i=2, so i+1=3 (out of bounds)',
    correctApproachCode: 'numbers = [10, 20, 30]\n\n# Option 1: Stop the loop one step early so i + 1 stays inside bounds\nfor i in range(len(numbers) - 1):\n    print(numbers[i + 1])\n\n# Option 2: If you intended to print all numbers, print numbers[i]\nfor i in range(len(numbers)):\n    print(numbers[i])',
    correctApproachExplanation: 'If you need to look ahead to `i + 1` (for adjacent comparisons), terminate the loop at `len(numbers) - 1`. If you simply wanted to print every item, use `numbers[i]` or direct iteration `for num in numbers:`.',
    rememberThisTakeaway: 'The last valid index of any collection of length N is always N - 1.'
  },
  hints: [
    {
      level: 1,
      title: 'Check the bounds',
      text: 'Take a close look at how many items are in `numbers` vs what index is accessed on the very last iteration.'
    },
    {
      level: 2,
      title: 'Trace values on paper',
      text: 'For length 3, `range(3)` produces `i = 0`, then `1`, then `2`. What does `i + 1` equal when `i = 2`?'
    },
    {
      level: 3,
      title: 'Adjust either the range or the index',
      text: 'If you need `i + 1`, stop your loop at `range(len(numbers) - 1)`. If you meant to print the current number, use `numbers[i]`.'
    }
  ],
  conceptExplanationDeep: 'In computer memory, contiguous lists compute address as `base_address + (index * element_size)`. Accessing index 3 in an allocated block of 3 items asks the operating system or runtime for memory belonging to another object, which Python intercepts and halts with an IndexError.',
  correctedCode: `numbers = [10, 20, 30]

# If looking ahead to the next item:
for i in range(len(numbers) - 1):
    print("Current:", numbers[i], "Next:", numbers[i + 1])

# If printing each item:
for num in numbers:
    print(num)`,
  takeaway: 'The last valid index is always length - 1.',
  practiceQuestions: [
    {
      id: 'demo-practice-easy',
      concept: 'List Indexing',
      difficulty: 'easy',
      title: 'Valid Index Inspector',
      problemStatement: 'Given a list of student names, write a function `get_last_student(names)` that safely returns the very last student in the list without throwing an IndexError. If the list is empty, return None.',
      constraints: ['Do not hardcode indices', 'Handle empty lists gracefully'],
      examples: [
        {
          input: 'names = ["Aarav", "Priya", "Rohan"]',
          output: '"Rohan"',
          explanation: 'Length is 3, last valid index is 3 - 1 = 2.'
        }
      ],
      starterCode: `def get_last_student(names):\n    # TODO: Return the last item safely\n    pass`,
      hints: [
        'Check if len(names) == 0 first.',
        'The last valid index is len(names) - 1 or names[-1].'
      ],
      solutionCode: `def get_last_student(names):\n    if not names:\n        return None\n    return names[len(names) - 1]`
    },
    {
      id: 'demo-practice-med',
      concept: 'Boundary Conditions',
      difficulty: 'medium',
      title: 'Adjacent Differences',
      problemStatement: 'Write a function `adjacent_differences(nums)` that takes a list of integers and returns a new list of differences between each element and the one right after it: `nums[i + 1] - nums[i]`. Avoid any IndexError.',
      constraints: ['List contains 2 or more numbers', 'Do not exceed length - 1 in the loop'],
      examples: [
        {
          input: 'nums = [10, 25, 40, 50]',
          output: '[15, 15, 10]',
          explanation: '25-10=15, 40-25=15, 50-40=10. Notice there are 3 differences for 4 numbers.'
        }
      ],
      starterCode: `def adjacent_differences(nums):\n    diffs = []\n    # TODO: Loop safely up to len(nums) - 1\n    return diffs`,
      hints: [
        'How many adjacent pairs exist in a list of size N? Exactly N - 1 pairs.',
        'Use range(len(nums) - 1) so i + 1 is always valid.'
      ],
      solutionCode: `def adjacent_differences(nums):\n    diffs = []\n    for i in range(len(nums) - 1):\n        diffs.append(nums[i + 1] - nums[i])\n    return diffs`
    },
    {
      id: 'demo-practice-challenge',
      concept: 'Circular Indexing',
      difficulty: 'challenge',
      title: 'Circular Next Element',
      problemStatement: 'Write a function `circular_next(nums)` that for every element at index `i`, prints the element and the next element, but when it reaches the very last element, it wraps around and pairs with index 0 using modulo arithmetic.',
      constraints: ['Use modulo operator (%) for boundary wrap-around', 'Returns list of tuples (current, next_circular)'],
      examples: [
        {
          input: 'nums = [10, 20, 30]',
          output: '[(10, 20), (20, 30), (30, 10)]',
          explanation: '30 wraps back around to 10 because (2 + 1) % 3 = 0.'
        }
      ],
      starterCode: `def circular_next(nums):\n    result = []\n    n = len(nums)\n    # TODO: use (i + 1) % n to wrap safely\n    return result`,
      hints: [
        'Modulo arithmetic `(i + 1) % n` wraps index n back to 0 without branching!',
        'Check that nums is not empty before indexing.'
      ],
      solutionCode: `def circular_next(nums):\n    if not nums:\n        return []\n    n = len(nums)\n    return [(nums[i], nums[(i + 1) % n]) for i in range(n)]`
    }
  ]
};

export const DEMO_STUDENT_PROFILE: StudentProfile = {
  id: 'demo_student_viva_2026',
  name: 'Devin Sharma (Demo Student)',
  email: 'devin.coder@college.edu',
  createdAt: '2026-09-12',
  isDemoMode: true,
  totalAnalyses: 14,
  totalPracticesCompleted: 9,
  conceptStrengths: {
    'Loops': {
      concept: 'Loops',
      status: 'Strong',
      totalAttempts: 12,
      successfulAttempts: 11,
      recurringMistakes: [],
      lastAttemptDate: 'Yesterday',
      trend: 'improving'
    },
    'Functions': {
      concept: 'Functions',
      status: 'Good',
      totalAttempts: 9,
      successfulAttempts: 7,
      recurringMistakes: ['Missing return value'],
      lastAttemptDate: '2 days ago',
      trend: 'improving'
    },
    'Arrays': {
      concept: 'Arrays',
      status: 'Needs Practice',
      totalAttempts: 15,
      successfulAttempts: 8,
      recurringMistakes: ['Array boundary off-by-one', 'Index out of bounds on lookahead'],
      lastAttemptDate: 'Today',
      trend: 'declining'
    },
    'Recursion': {
      concept: 'Recursion',
      status: 'Developing',
      totalAttempts: 6,
      successfulAttempts: 3,
      recurringMistakes: ['Missing base case', 'Incorrect recursion decrement'],
      lastAttemptDate: '3 days ago',
      trend: 'stable'
    },
    'OOP': {
      concept: 'OOP',
      status: 'Not enough attempts yet',
      totalAttempts: 1,
      successfulAttempts: 1,
      recurringMistakes: [],
      lastAttemptDate: '5 days ago',
      trend: 'new'
    },
    'Data Structures': {
      concept: 'Data Structures',
      status: 'Good',
      totalAttempts: 8,
      successfulAttempts: 6,
      recurringMistakes: ['KeyError in dictionary'],
      lastAttemptDate: 'Yesterday',
      trend: 'improving'
    },
    'Variables & Scope': {
      concept: 'Variables & Scope',
      status: 'Strong',
      totalAttempts: 7,
      successfulAttempts: 6,
      recurringMistakes: ['Global mutation without keyword'],
      lastAttemptDate: '4 days ago',
      trend: 'improving'
    },
    'Error Handling': {
      concept: 'Error Handling',
      status: 'Not enough attempts yet',
      totalAttempts: 0,
      successfulAttempts: 0,
      recurringMistakes: [],
      trend: 'new'
    }
  },
  recurringMistakes: [
    {
      id: 'mistake-1',
      concept: 'Array Boundaries',
      mistakeType: 'IndexOutOfBounds on Lookahead (i + 1)',
      count: 5,
      lastSeen: 'Today',
      language: 'python',
      exampleSnippet: 'for i in range(len(arr)):\n    print(arr[i + 1])',
      explanation: 'You frequently look ahead one step using i + 1 without terminating the range at len - 1.'
    },
    {
      id: 'mistake-2',
      concept: 'Recursion Base Cases',
      mistakeType: 'Missing or Unreachable Base Case',
      count: 3,
      lastSeen: '3 days ago',
      language: 'python',
      exampleSnippet: 'def count(n):\n    print(n)\n    count(n - 1)',
      explanation: 'Omitting a conditional stop (`if n <= 0: return`) causes maximum recursion depth exceeded.'
    },
    {
      id: 'mistake-3',
      concept: 'Variable Scope',
      mistakeType: 'UnboundLocalError / Scope Shadowing',
      count: 2,
      lastSeen: '4 days ago',
      language: 'python',
      exampleSnippet: 'counter = 0\ndef bump():\n    counter += 1',
      explanation: 'Attempting to reassign a global variable inside a local scope without declaring it.'
    }
  ],
  recentActivity: [
    {
      id: 'act-1',
      type: 'analysis',
      title: 'Python List Index Lookahead',
      timestamp: '10 minutes ago',
      concept: 'Arrays',
      language: 'python',
      status: 'review_needed'
    },
    {
      id: 'act-2',
      type: 'practice',
      title: 'Loop Counter Bounds Solved',
      timestamp: '2 hours ago',
      concept: 'Loops',
      language: 'python',
      status: 'passed'
    },
    {
      id: 'act-3',
      type: 'analysis',
      title: 'Recursion Countdown Check',
      timestamp: 'Yesterday',
      concept: 'Recursion',
      language: 'python',
      status: 'review_needed'
    },
    {
      id: 'act-4',
      type: 'practice',
      title: 'Dictionary Frequency Counter',
      timestamp: 'Yesterday',
      concept: 'Data Structures',
      language: 'python',
      status: 'passed'
    },
    {
      id: 'act-5',
      type: 'practice',
      title: 'Function Return Value Refactor',
      timestamp: '3 days ago',
      concept: 'Functions',
      language: 'javascript',
      status: 'passed'
    }
  ]
};

export const BLANK_STUDENT_PROFILE: StudentProfile = {
  id: 'student_live_user',
  name: 'Student Learner',
  email: 'learner@college.edu',
  createdAt: new Date().toISOString().split('T')[0],
  isDemoMode: false,
  totalAnalyses: 0,
  totalPracticesCompleted: 0,
  conceptStrengths: {
    'Loops': { concept: 'Loops', status: 'Not enough attempts yet', totalAttempts: 0, successfulAttempts: 0, recurringMistakes: [], trend: 'new' },
    'Arrays': { concept: 'Arrays', status: 'Not enough attempts yet', totalAttempts: 0, successfulAttempts: 0, recurringMistakes: [], trend: 'new' },
    'Functions': { concept: 'Functions', status: 'Not enough attempts yet', totalAttempts: 0, successfulAttempts: 0, recurringMistakes: [], trend: 'new' },
    'Recursion': { concept: 'Recursion', status: 'Not enough attempts yet', totalAttempts: 0, successfulAttempts: 0, recurringMistakes: [], trend: 'new' },
    'OOP': { concept: 'OOP', status: 'Not enough attempts yet', totalAttempts: 0, successfulAttempts: 0, recurringMistakes: [], trend: 'new' },
    'Data Structures': { concept: 'Data Structures', status: 'Not enough attempts yet', totalAttempts: 0, successfulAttempts: 0, recurringMistakes: [], trend: 'new' },
    'Variables & Scope': { concept: 'Variables & Scope', status: 'Not enough attempts yet', totalAttempts: 0, successfulAttempts: 0, recurringMistakes: [], trend: 'new' },
    'Error Handling': { concept: 'Error Handling', status: 'Not enough attempts yet', totalAttempts: 0, successfulAttempts: 0, recurringMistakes: [], trend: 'new' }
  },
  recurringMistakes: [],
  recentActivity: []
};
