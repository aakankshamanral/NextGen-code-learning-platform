export interface TestCase {
  input: string;          
  expectedOutput: string; 
}

export interface CodingChallenge {
  problemStatement: string;
  constraints: string[];
  initialCode: string;
  testCases: TestCase[];  
}
export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface LevelContent {
  title: string;
  animal: string;
  dialogue: string;
  pdf: string;
  themeColor: string;
  topics: string[];
  flashcards: { question: string; answer: string }[];
  challenge?: CodingChallenge; 
  quizQuestions: QuizQuestion[];
}

export const LEVEL_DATA: Record<string, LevelContent> = {
  "1": {
    title: "Introduction to C",
    animal: "🦊",
    dialogue: "Let's go! Ready to see how Dennis Ritchie changed the world?",
    pdf: "/pdfs/chapter1.pdf",
    themeColor: "from-orange-500 to-red-500",
    topics: ["Programming Basics", "History of C", "Structure", "Compilation", "Hello World"],
    flashcards: [
      { question: "Who developed the C language and when?", answer: "Dennis Ritchie at Bell Labs in 1972." },
      { question: "Why is C called a 'Middle-Level' language?", answer: "It combines High-level features (readable code) with Low-level features (direct memory access)." },
      { question: "What is the very first thing a C compiler looks for?", answer: "The main() function. Execution starts here!" },
      { question: "Is C a Case-Sensitive language?", answer: "Yes! 'Variable' and 'variable' are treated as two different things." },
      { question: "What does the '\\n' character do in a printf statement?", answer: "It creates a 'New Line', moving the cursor to the next line." },
      { question: "How do you declare a constant value that can't be changed?", answer: "By using the 'const' keyword (e.g., const int speed = 100;)." },
      { question: "What is the purpose of the semi-colon (;) in C?", answer: "It acts as a 'Statement Terminator' to show where a command ends." },
      { question: "Which header file is needed for printf() and scanf()?", answer: "stdio.h (Standard Input Output)." },
      { question: "What are the 3 basic types of variables in C?", answer: "int (integers), float (decimals), and char (single characters)." },
      { question: "What is a 'Keyword' in C?", answer: "Reserved words (like 'int' or 'return') that have special meanings and cannot be used as names." }
    ],
    challenge: {
      problemStatement: "Welcome to C! Your first task is to ask for a user's name and print 'Welcome to Nextgen, [name]'.",
      constraints: ["Include <stdio.h>", "Return 0 at the end"],
      initialCode: "#include <stdio.h>\n\nint main() {\n    char name[50];\n    // Use scanf to get the name\n    // Use printf to welcome the user\n    return 0;\n}",
      testCases: [
        { input: "Aakanksha", expectedOutput: "Welcome to Nextgen, Aakanksha" },
        { input: "Larry", expectedOutput: "Welcome to Nextgen, Larry" }
      ]
    },
    quizQuestions: [
  { q: "Which data type would you use to store a student's grade (e.g., 'A')?", options: ["int", "float", "char", "double"], correct: 2, explanation: "The 'char' data type is designed specifically to store single characters or ASCII symbols." },
  { q: "What happens if you store 5.9 in an 'int' variable?", options: ["It rounds to 6", "It stays 5.9", "It truncates to 5", "It causes an error"], correct: 2, explanation: "Integers do not support decimals; C truncates the fractional part, keeping only the whole number." },
  { q: "Which of these variable names follows C naming conventions?", options: ["2nd_year", "student name", "_score", "total-amt"], correct: 2, explanation: "Variables must start with a letter or underscore and cannot contain spaces or hyphens." },
  { q: "Why is 'double' preferred over 'float' for scientific calculations?", options: ["It is faster", "It uses less memory", "It has higher precision", "It is easier to type"], correct: 2, explanation: "Double-precision variables provide roughly 15-17 decimal digits of precision, compared to 6-7 for float." },
  { q: "What is the purpose of 'type casting' in C?", options: ["To delete a variable", "To change a variable's data type temporarily", "To rename a variable", "To hide code from the compiler"], correct: 1, explanation: "Type casting allows you to force a variable of one type to act as another for a specific operation." },
  { q: "Which keyword is used to define a variable whose value never changes?", options: ["static", "fixed", "const", "permanent"], correct: 2, explanation: "The 'const' keyword creates a read-only variable that cannot be modified after initialization." },
  { q: "What does the 'sizeof' operator actually return?", options: ["The number of bits", "The number of bytes", "The variable name length", "The value stored"], correct: 1, explanation: "Sizeof calculates the memory footprint of a data type or variable in bytes." },
  { q: "Which format specifier is required to print a 'double' value?", options: ["%d", "%f", "%c", "%lf"], correct: 3, explanation: "While %f works for floats, %lf (Long Float) is the precise specifier for double values." },
  { q: "In C, a 'char' variable is actually stored internally as:", options: ["A small image", "A string", "An ASCII integer value", "A boolean"], correct: 2, explanation: "Characters are mapped to specific integer values in the ASCII table for machine processing." },
  { q: "What is the result of 'signed' vs 'unsigned' for an integer?", options: ["Signed allows negative numbers", "Unsigned is faster", "Signed uses more memory", "There is no difference"], correct: 0, explanation: "Signed integers reserve one bit for the +/- sign, whereas unsigned use all bits for positive range." }
]

  },

  "2": {
    title: "Data Types & Variables",
    animal: "🤖",
    dialogue: "Beep Boop! Code your first program and master how memory stores data!",
    pdf: "/pdfs/chapter2.pdf",
    themeColor: "from-blue-500 to-indigo-600",
    topics: ["Naming Rules", "int/float/char", "Constants", "Type Casting"],
    flashcards: [
      { "question": "What are the four primary fundamental data types in C?", "answer": "• int (integer)\n• char (character)\n• float (single-precision floating point)\n• double (double-precision floating point)" },
      { "question": "How much memory does a standard 'int' usually occupy?", "answer": "Typically 2 or 4 bytes, depending on the compiler architecture (16-bit vs 32/64-bit)." },
      { "question": "What is the format specifier used to print a character variable?", "answer": "The %c format specifier is used for single characters." },
      { "question": "Which data type would you use to store the value 3.14159 with high precision?", "answer": "The 'double' data type, as it provides about 15-17 decimal digits of precision." },
      { "question": "What are the rules for naming a variable (Identifier) in C?", "answer": "Must start with a letter or underscore (_), followed by letters, digits, or underscores. No spaces or special symbols!" },
      { "question": "What is the difference between 'signed' and 'unsigned' int?", "answer": "'signed' holds positive and negative numbers, while 'unsigned' holds only zero and positive numbers, doubling the positive range." },
      { "question": "How do you find the exact size of a data type in bytes during runtime?", "answer": "By using the 'sizeof()' operator (e.g., sizeof(int))." },
      { "question": "What happens if you assign a decimal value (e.g., 5.8) to an 'int' variable?", "answer": "Type Truncation: The decimal part is dropped, and only the integer part (5) is stored." },
      { "question": "What is the range of a standard 'char' data type?", "answer": "It ranges from -128 to 127 (based on ASCII values)." },
      { "question": "What is 'Variable Initialization'?", "answer": "The process of assigning an initial value to a variable at the time of declaration (e.g., int age = 20;)." }
    ],
    challenge: {
      problemStatement: "Declare an integer 'age', set it to 20, and print 'I am 20 years old'.",
      constraints: ["Use %d specifier", "Variable name must be age"],
      initialCode: "#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}",
      testCases: [
        { input: "", expectedOutput: "I am 20 years old" }
      ]
    },
    quizQuestions: []

  },

 
  
  
};