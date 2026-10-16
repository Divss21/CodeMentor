import { SupportedLanguage } from '../types';

export interface ConceptItem {
  id: string;
  name: string;
  category: 'Programming Basics' | 'Data Structures' | 'Advanced';
  summary: string;
  detailedExplanation: string;
  commonMisconceptions: string[];
  codeExample: {
    language: SupportedLanguage;
    badCode: string;
    goodCode: string;
    notes: string;
  };
  relatedConcepts: string[];
  quickPracticePrompt: string;
}

export const CONCEPT_LIBRARY: ConceptItem[] = [
  // Programming Basics
  {
    id: 'variables-scope',
    name: 'Variables & Scope',
    category: 'Programming Basics',
    summary: 'Where variables are declared defines where they can be accessed and modified.',
    detailedExplanation: 'Scope determines the accessibility (visibility) of variables. Local variables exist only within the block or function where they are created, while global variables can be accessed everywhere. Modifying a variable without declaring it or assuming an inner scope overrides outer values without declaration causes hidden bugs.',
    commonMisconceptions: [
      'Assuming an inner variable created inside an if/loop block persists globally.',
      'Modifying a global variable inside a function without explicit keyword (e.g. `global` in Python).',
      'Confusing variable shadowing with re-assignment.'
    ],
    codeExample: {
      language: 'python',
      badCode: `count = 10\ndef increment():\n    count += 1 # UnboundLocalError! Python thinks count is local\nincrement()`,
      goodCode: `count = 10\ndef increment():\n    global count\n    count += 1\n# Or better yet: return the value!\ndef increment_clean(val):\n    return val + 1`,
      notes: 'Avoid mutating globals when passing and returning values keeps functions pure and predictable.'
    },
    relatedConcepts: ['Functions', 'Data types', 'Memory Management'],
    quickPracticePrompt: 'Fix variable scope issue in a counter function.'
  },
  {
    id: 'data-types',
    name: 'Data Types & Casting',
    category: 'Programming Basics',
    summary: 'Understanding how values are stored, sized, and converted between string, integer, float, and boolean.',
    detailedExplanation: 'Every programming language operates on specific types. Integer division versus floating-point division, string concatenation with numbers, and precision limits in floating numbers are prime sources of student logic bugs.',
    commonMisconceptions: [
      'Expecting "5" + 5 to evaluate to 10 instead of "55" in JavaScript.',
      'Assuming 0.1 + 0.2 equals exactly 0.3 without IEEE 754 floating point tolerance.',
      'Confusing pass-by-value with pass-by-reference for primitive types.'
    ],
    codeExample: {
      language: 'javascript',
      badCode: `const a = prompt("Enter first number"); // returns string\nconst b = prompt("Enter second number");\nconst sum = a + b; // "1020" instead of 30!`,
      goodCode: `const a = Number(prompt("Enter first number"));\nconst b = Number(prompt("Enter second number"));\nconst sum = a + b; // 30`,
      notes: 'Always sanitize and parse inputs to numeric types before performing arithmetic.'
    },
    relatedConcepts: ['Variables & Scope', 'Operators', 'Error Handling'],
    quickPracticePrompt: 'Safely parse and calculate the sum of user-provided numeric strings.'
  },
  {
    id: 'operators-conditions',
    name: 'Conditions & Boolean Logic',
    category: 'Programming Basics',
    summary: 'Controlling program flow using if-else branches, comparisons, and boolean algebra.',
    detailedExplanation: 'Conditional statements check expressions for truthiness. Common beginner mistakes stem from using assignment instead of equality (`=` vs `==`), misplaced semicolons in C++/Java, or confusing logical AND (`&&`) with OR (`||`).',
    commonMisconceptions: [
      'Using single `=` inside an `if (x = 5)` statement in C++/Java/JS, which assigns rather than compares.',
      'Writing chained comparisons like `if (1 < x < 5)` in languages that do not support mathematical chaining.',
      'Forgetting that empty strings, 0, and null are falsy in many languages.'
    ],
    codeExample: {
      language: 'cpp',
      badCode: `int score = 85;\nif (score = 100) { // Assignment! Always true!\n    cout << "Perfect score!" << endl;\n}`,
      goodCode: `int score = 85;\nif (score == 100) { // Equality check\n    cout << "Perfect score!" << endl;\n}`,
      notes: 'Use Yoda conditions `100 == score` or compiler warnings to prevent accidental assignment in conditionals.'
    },
    relatedConcepts: ['Operators', 'Loops', 'Variables & Scope'],
    quickPracticePrompt: 'Write a clean grading condition without assignment or redundant checks.'
  },
  {
    id: 'loops',
    name: 'Loops & Iteration',
    category: 'Programming Basics',
    summary: 'Executing a sequence of statements repeatedly until a termination condition is satisfied.',
    detailedExplanation: 'Loops (for, while, do-while) repeat tasks. Crucial elements are initialization, step increment/decrement, and terminal boundary conditions. Off-by-one errors and infinite loops occur when termination expressions are miscalculated.',
    commonMisconceptions: [
      'Off-by-one errors: using `<=` instead of `<` when looping over zero-indexed collections.',
      'Infinite loops caused by never updating the loop counter inside a while body.',
      'Modifying a collection while concurrently iterating over it.'
    ],
    codeExample: {
      language: 'python',
      badCode: `items = [10, 20, 30]\n# Off-by-one error: index reaches 3 which is out of range!\nfor i in range(len(items) + 1):\n    print(items[i])`,
      goodCode: `items = [10, 20, 30]\n# Correct: range(len(items)) goes from 0 to len-1\nfor i in range(len(items)):\n    print(items[i])\n# Even better Pythonic iteration:\nfor item in items:\n    print(item)`,
      notes: 'Prefer direct element iteration `for item in list` unless the index is strictly necessary.'
    },
    relatedConcepts: ['Arrays', 'Boundary Conditions', 'Recursion'],
    quickPracticePrompt: 'Find and fix an off-by-one loop that fails on the final array element.'
  },
  {
    id: 'functions',
    name: 'Functions & Return Values',
    category: 'Programming Basics',
    summary: 'Encapsulating reusable blocks of logic, accepting parameters, and returning computed outcomes.',
    detailedExplanation: 'Functions allow modular, testable code. Key pitfalls include confusing `print()` with `return`, forgetting to pass required parameters, mutating outer objects passed as references, or assuming a function automatically returns its last line without an explicit return statement.',
    commonMisconceptions: [
      'Confusing printing to stdout with returning a value to the caller.',
      'Expecting a void function to supply an argument to an assignment.',
      'Mutating a list passed as a parameter unintentionally affecting the caller.'
    ],
    codeExample: {
      language: 'javascript',
      badCode: `function calculateArea(width, height) {\n    console.log(width * height); // Printed, but returns undefined!\n}\nconst area = calculateArea(5, 4);\nconsole.log(area + 10); // NaN!`,
      goodCode: `function calculateArea(width, height) {\n    return width * height; // Returns value\n}\nconst area = calculateArea(5, 4);\nconsole.log(area + 10); // 30`,
      notes: 'Functions should return their results so other functions can compose and reuse them.'
    },
    relatedConcepts: ['Variables & Scope', 'Recursion', 'Error Handling'],
    quickPracticePrompt: 'Convert a console-printing function into a testable pure function returning a payload.'
  },

  // Data Structures
  {
    id: 'arrays-indexing',
    name: 'Arrays & Index Boundaries',
    category: 'Data Structures',
    summary: 'Contiguous memory collections accessed by zero-based integer index.',
    detailedExplanation: 'Arrays store ordered sequences of elements. Because computers start indexing at 0, the first element is at index 0 and the last element is at index (length - 1). Accessing index (length) causes an `IndexOutOfBounds` or `IndexError`.',
    commonMisconceptions: [
      'Accessing `arr[arr.length]` thinking length is the last valid index.',
      'Confusing array length with the maximum valid index.',
      'Assuming negative indices wrap around in all languages (works in Python, fails in C++/Java).'
    ],
    codeExample: {
      language: 'python',
      badCode: `numbers = [10, 20, 30]\n# Length is 3, valid indices are 0, 1, 2\n# When i = 2, i + 1 = 3 -> IndexError!\nfor i in range(len(numbers)):\n    print(numbers[i + 1])`,
      goodCode: `numbers = [10, 20, 30]\n# Stop one element earlier so i + 1 never exceeds len - 1:\nfor i in range(len(numbers) - 1):\n    print(numbers[i], "followed by", numbers[i + 1])`,
      notes: 'The last valid index of any array of length N is always N - 1.'
    },
    relatedConcepts: ['Loops', 'Strings', 'Data Structures'],
    quickPracticePrompt: 'Diagnose and fix an IndexOutOfBounds error when comparing adjacent array items.'
  },
  {
    id: 'strings-manipulation',
    name: 'Strings & Immutability',
    category: 'Data Structures',
    summary: 'Working with sequences of characters, slices, substrings, and immutability rules.',
    detailedExplanation: 'In many modern languages (Python, Java, JavaScript), strings are immutable. Any modification creates a brand new string rather than changing characters in-place. Trying to alter `str[0] = "c"` will crash in Python or fail silently in JavaScript.',
    commonMisconceptions: [
      'Attempting in-place character mutation `s[0] = "A"` on immutable strings.',
      'Heavy string concatenation in loops leading to quadratic O(N^2) memory reallocation.',
      'Confusing substring index boundaries `str.slice(start, end)` (end is exclusive).'
    ],
    codeExample: {
      language: 'python',
      badCode: `word = "hello"\n# TypeError: 'str' object does not support item assignment\nword[0] = "H"`,
      goodCode: `word = "hello"\n# Slice and reassemble or use string methods:\nword = "H" + word[1:] # "Hello"`,
      notes: 'Remember string slicing `[start:end]` is exclusive of the end index.'
    },
    relatedConcepts: ['Arrays & Index Boundaries', 'Loops', 'Memory Management'],
    quickPracticePrompt: 'Reverse the vowels of a string without mutating immutable characters.'
  },
  {
    id: 'hash-maps',
    name: 'Hash Maps & Dictionaries',
    category: 'Data Structures',
    summary: 'Key-value pairs offering average O(1) time complexity for search, insertion, and deletion.',
    detailedExplanation: 'Hash maps map unique keys to values using a hashing algorithm. Common student errors include querying a key that does not exist (causing `KeyError` in Python or `NullPointerException` in Java) without checking, or attempting to use mutable objects (like lists) as keys.',
    commonMisconceptions: [
      'Accessing `dict[key]` without verifying presence or using `.get(key, default)`.',
      'Using mutable lists as dictionary keys in Python.',
      'Assuming hash map iteration preserves strict insertion order across all languages.'
    ],
    codeExample: {
      language: 'python',
      badCode: `counts = {}\nwords = ["apple", "banana", "apple"]\nfor w in words:\n    counts[w] += 1 # KeyError on first occurrence!`,
      goodCode: `counts = {}\nwords = ["apple", "banana", "apple"]\nfor w in words:\n    counts[w] = counts.get(w, 0) + 1\n# Or use collections.defaultdict(int)`,
      notes: 'Use `.get(key, default)` or `if key in dict:` to guard against missing key exceptions.'
    },
    relatedConcepts: ['Arrays', 'Time Complexity', 'Data Structures'],
    quickPracticePrompt: 'Count word frequencies safely handling unseen words.'
  },
  {
    id: 'linked-lists',
    name: 'Linked Lists & Pointers',
    category: 'Data Structures',
    summary: 'Linear collection of data elements where order is determined by pointers or references.',
    detailedExplanation: 'Unlike arrays, linked list nodes do not sit in contiguous memory. Each node holds data and a reference (`next`) to the following node. Common errors include dereferencing null pointers (`node.next.val` when node.next is null) and losing head pointers during traversal.',
    commonMisconceptions: [
      'Forgetting to check if `node` is null before accessing `node.next`.',
      'Losing references to the rest of the list when relinking nodes.',
      'Confusing deep copy of nodes with shallow pointer assignment.'
    ],
    codeExample: {
      language: 'java',
      badCode: `// While traversing, if curr is null, curr.next throws NullPointerException!\nwhile (curr.next != null) {\n    curr = curr.next;\n}`,
      goodCode: `// Safely check both current node and next:\nwhile (curr != null && curr.next != null) {\n    curr = curr.next;\n}`,
      notes: 'Always verify `curr != null` before dereferencing `curr.next`.'
    },
    relatedConcepts: ['Recursion', 'Memory Management', 'Data Structures'],
    quickPracticePrompt: 'Safely find the middle element of a singly linked list without null pointer exceptions.'
  },

  // Advanced
  {
    id: 'recursion-base-cases',
    name: 'Recursion & Base Cases',
    category: 'Advanced',
    summary: 'A method where the solution depends on solutions to smaller instances of the same problem.',
    detailedExplanation: 'Every recursive function MUST have two parts: 1) A base case that terminates without calling itself, and 2) A recursive step that moves closer to the base case. Missing or unreachable base cases cause stack overflow (`RecursionError` / `StackOverflowError`).',
    commonMisconceptions: [
      'Omitting the base case, causing infinite recursive descent.',
      'Placing the recursive call before the base case check.',
      'Not advancing the argument (e.g. calling `foo(n)` instead of `foo(n - 1)`).'
    ],
    codeExample: {
      language: 'python',
      badCode: `def countdown(n):\n    # Missing base case!\n    print(n)\n    countdown(n - 1) # RecursionError: maximum recursion depth exceeded`,
      goodCode: `def countdown(n):\n    if n <= 0: # Base case: stop here!\n        print("Blastoff!")\n        return\n    print(n)\n    countdown(n - 1) # Progresses toward base case`,
      notes: 'Every recursive call must move strictly closer to the terminating condition.'
    },
    relatedConcepts: ['Call Stack', 'Loops', 'Trees & Graph Traversal'],
    quickPracticePrompt: 'Add a guard and proper base case to a recursive factorial calculator.'
  },
  {
    id: 'oop-encapsulation',
    name: 'OOP & Object State',
    category: 'Advanced',
    summary: 'Modeling concepts as classes containing state (fields) and behaviors (methods).',
    detailedExplanation: 'Object-Oriented Programming binds data and behavior together. Students frequently struggle with the `this` / `self` pointer, class variables versus instance variables, and neglecting constructor initialization.',
    commonMisconceptions: [
      'In Python, using a mutable default argument in class definitions causing shared state across all instances.',
      'Forgetting `self` as the first parameter of instance methods in Python.',
      'Accessing instance fields without `this.` or `self.` leading to local shadowing.'
    ],
    codeExample: {
      language: 'python',
      badCode: `class Student:\n    # Class-level list: SHARED across every student instance!\n    grades = []\n    def add_grade(self, g):\n        self.grades.append(g)`,
      goodCode: `class Student:\n    def __init__(self):\n        # Instance-level list: unique to each student\n        self.grades = []\n    def add_grade(self, g):\n        self.grades.append(g)`,
      notes: 'Initialize mutable instance variables inside `__init__` or constructor, never at the class declaration level.'
    },
    relatedConcepts: ['Functions', 'Variables & Scope', 'Data Structures'],
    quickPracticePrompt: 'Refactor a class with leaky shared state into clean instance-level encapsulation.'
  },
  {
    id: 'error-handling',
    name: 'Exception & Error Handling',
    category: 'Advanced',
    summary: 'Gracefully intercepting runtime anomalies and maintaining system resilience.',
    detailedExplanation: 'Exceptions represent unexpected events (file not found, invalid network response, bad user input). Catching generic exceptions (`except Exception: pass` or bare `catch`) swallows critical bugs and makes debugging impossible.',
    commonMisconceptions: [
      'Swallowing exceptions silently with `except: pass`, masking fatal syntax or logic errors.',
      'Using exceptions for normal control flow instead of proper validation.',
      'Forgetting to release resources (use `finally` or `with` statement contexts).'
    ],
    codeExample: {
      language: 'python',
      badCode: `try:\n    value = int(user_input)\nexcept:\n    pass # Silently fails! What went wrong? No one knows!`,
      goodCode: `try:\n    value = int(user_input)\nexcept ValueError as err:\n    print(f"Expected a valid integer: {err}")\n    value = 0`,
      notes: 'Catch specific exception types and provide informative logging or fallback defaults.'
    },
    relatedConcepts: ['Functions', 'Data types', 'Conditions & Boolean Logic'],
    quickPracticePrompt: 'Wrap a file/parsing operation with specific exception traps and clean error messages.'
  }
];
