const mockGenerateQuiz = async (topic) => {
  // Generate more specific and practical quiz questions based on topic
  const quizzes = {
    'python': {
      questions: [
        {
          id: 1,
          question: "In Python, what is the main difference between a list and a tuple?",
          options: ["Lists are mutable, tuples are immutable", "Tuples are faster than lists", "Lists can't contain numbers", "There is no difference"],
          type: "multiple-choice",
          correctAnswer: 0
        },
        {
          id: 2,
          question: "What will print(type([1, 2, 3])) output?",
          options: ["<class 'tuple'>", "<class 'list'>", "<class 'array'>", "<class 'sequence'>"],
          type: "multiple-choice",
          correctAnswer: 1
        },
        {
          id: 3,
          question: "Which of the following is the correct way to define a function in Python?",
          options: ["function myFunc():", "def myFunc():", "func myFunc():", "define myFunc():"],
          type: "multiple-choice",
          correctAnswer: 1
        },
        {
          id: 4,
          question: "What does the 'with' statement do in Python?",
          options: ["Imports modules", "Manages context and automatically closes resources", "Creates loops", "Defines classes"],
          type: "multiple-choice",
          correctAnswer: 1
        },
        {
          id: 5,
          question: "In Python, what is a list comprehension used for?",
          options: ["Creating lists in a concise, readable way", "Compressing file sizes", "Writing documentation", "Importing libraries"],
          type: "multiple-choice",
          correctAnswer: 0
        }
      ]
    },
    'javascript': {
      questions: [
        {
          id: 1,
          question: "What is the difference between 'var', 'let', and 'const' in JavaScript?",
          options: ["No difference", "let and const have block scope, var is function-scoped; const cannot be reassigned", "All have the same scope", "const is for constants only"],
          type: "multiple-choice",
          correctAnswer: 1
        },
        {
          id: 2,
          question: "What does 'this' refer to in JavaScript?",
          options: ["The global object", "The object that called the function", "Always the window object", "The class definition"],
          type: "multiple-choice",
          correctAnswer: 1
        },
        {
          id: 3,
          question: "What is a promise in JavaScript?",
          options: ["A variable name", "An object representing eventual completion of async operation", "A function parameter", "A method to import modules"],
          type: "multiple-choice",
          correctAnswer: 1
        },
        {
          id: 4,
          question: "What does the spread operator (...) do?",
          options: ["Creates a copy of an array/object and expands it", "Adds comments", "Defines variable scope", "Creates a new function"],
          type: "multiple-choice",
          correctAnswer: 0
        },
        {
          id: 5,
          question: "What is the correct way to fetch data from an API?",
          options: ["Using the fetch API or axios library", "Using document.getElementById()", "Using console.log()", "Using localStorage"],
          type: "multiple-choice",
          correctAnswer: 0
        }
      ]
    },
    'react': {
      questions: [
        {
          id: 1,
          question: "What is the primary purpose of React?",
          options: ["Server-side rendering", "Building user interfaces with component-based architecture", "Database management", "API authentication"],
          type: "multiple-choice",
          correctAnswer: 1
        },
        {
          id: 2,
          question: "What is JSX?",
          options: ["A database query language", "A syntax extension for JavaScript that looks like HTML", "A CSS framework", "A server framework"],
          type: "multiple-choice",
          correctAnswer: 1
        },
        {
          id: 3,
          question: "What hook is used to manage state in functional components?",
          options: ["useEffect", "useState", "useContext", "useReducer"],
          type: "multiple-choice",
          correctAnswer: 1
        },
        {
          id: 4,
          question: "What does the useEffect hook do?",
          options: ["Manages component state", "Performs side effects in functional components", "Handles user input", "Styles components"],
          type: "multiple-choice",
          correctAnswer: 1
        },
        {
          id: 5,
          question: "What is the virtual DOM in React?",
          options: ["A backup of the real DOM", "An in-memory representation of the real DOM for efficient updates", "The DOM on a server", "A type of database"],
          type: "multiple-choice",
          correctAnswer: 1
        }
      ]
    },
    'machine learning': {
      questions: [
        {
          id: 1,
          question: "What is the main goal of supervised learning?",
          options: ["Train without labels", "Predict outcomes based on labeled training data", "Cluster unlabeled data", "Reduce dimensionality"],
          type: "multiple-choice",
          correctAnswer: 1
        },
        {
          id: 2,
          question: "What does overfitting mean?",
          options: ["Model performs well on training data but poorly on new data", "Model is too simple", "Dataset is too small", "Learning rate is too high"],
          type: "multiple-choice",
          correctAnswer: 0
        },
        {
          id: 3,
          question: "What is a common technique to prevent overfitting?",
          options: ["Increase training data, use regularization, or cross-validation", "Remove features", "Use more layers", "Increase learning rate"],
          type: "multiple-choice",
          correctAnswer: 0
        },
        {
          id: 4,
          question: "What does a confusion matrix show?",
          options: ["Feature importance", "True/False positives and negatives for classification", "Model loss over time", "Data distribution"],
          type: "multiple-choice",
          correctAnswer: 1
        },
        {
          id: 5,
          question: "What is the purpose of train-test split?",
          options: ["Split data to train model and evaluate on unseen data", "Parallel processing", "Data normalization", "Feature selection"],
          type: "multiple-choice",
          correctAnswer: 0
        }
      ]
    }
  };

  // Return relevant quiz or generic one
  const topicLower = topic.toLowerCase();
  for (const [key, quiz] of Object.entries(quizzes)) {
    if (topicLower.includes(key)) {
      return quiz;
    }
  }

  // Generic quiz for unknown topics
  return {
    questions: [
      {
        id: 1,
        question: `What is the primary purpose of learning ${topic}?`,
        options: ["Professional development", "Problem-solving skills", "Personal growth", "All of the above"],
        type: "multiple-choice",
        correctAnswer: 3
      },
      {
        id: 2,
        question: `Which concept is fundamental to ${topic}?`,
        options: ["Core principles", "Practical application", "Theoretical background", "All are important"],
        type: "multiple-choice",
        correctAnswer: 3
      },
      {
        id: 3,
        question: `How would you apply ${topic} in real-world scenarios?`,
        options: ["Theory only", "Practice with hands-on projects", "Both theory and practical work", "Depends on context"],
        type: "multiple-choice",
        correctAnswer: 2
      },
      {
        id: 4,
        question: `What skill complements ${topic} knowledge?`,
        options: ["Problem-solving", "Communication", "Creativity", "All of the above"],
        type: "multiple-choice",
        correctAnswer: 3
      },
      {
        id: 5,
        question: `What is a common challenge when learning ${topic}?`,
        options: ["Lack of practice", "Inconsistency", "Insufficient resources", "All are common"],
        type: "multiple-choice",
        correctAnswer: 3
      }
    ]
  };
};

const mockAssessKnowledge = async (answers, questions) => {
  // Calculate actual score based on answers
  let correctCount = 0;
  const answeredQuestions = Object.keys(answers).length;
  
  Object.entries(answers).forEach(([questionIdx, answerIdx]) => {
    const question = questions[parseInt(questionIdx)];
    // Only count as correct if answer is not null (\"I don't know\") and matches correct answer
    if (question && answerIdx !== null && answerIdx === question.correctAnswer) {
      correctCount++;
    }
  });

  const totalQuestions = questions ? questions.length : 5;
  const percentage = answeredQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Determine weak and strong areas based on performance
  const weakAreas = percentage < 40 
    ? ["Advanced concepts", "Practical applications", "Core fundamentals"]
    : percentage < 70
    ? ["Advanced concepts", "Practical applications"]
    : ["Complex scenarios"];

  const strongAreas = percentage >= 80
    ? ["Fundamentals", "Basic theory", "Core concepts"]
    : percentage >= 60
    ? ["Fundamentals", "Basic theory"]
    : ["Some foundational knowledge"];

  return {
    score: correctCount,
    totalQuestions: totalQuestions,
    percentage: percentage,
    weakAreas: weakAreas,
    strongAreas: strongAreas
  };
};

const mockGenerateRoadmap = async (topic, timeline, assessmentScore, weakAreas) => {
  // Return comprehensive roadmap with real resources based on topic
  const baseRoadmap = {
    topic,
    timeline,
    assessmentScore,
    summary: `Based on your assessment score of ${assessmentScore}%, here's a personalized learning roadmap for ${topic}. This comprehensive guide prioritizes your weak areas while building on your existing knowledge with real, actionable resources.`,
    focusAreas: weakAreas || ["Advanced concepts", "Practical applications", "Best practices"],
    steps: [
      {
        id: 1,
        title: "Master Fundamentals & Core Concepts",
        description: `Build a strong foundation in ${topic} by understanding core principles, foundational concepts, and essential terminology. This step ensures you have the knowledge base needed for advanced topics.`,
        estimatedTime: "1-2 weeks",
        keyTopics: ["Basic concepts", "Terminology", "Core principles", "Common patterns"],
        resources: [
          {
            title: `Official ${topic} Documentation`,
            type: "documentation",
            description: `Authoritative source for ${topic} fundamentals, official specifications, and best practices directly from creators.`,
            creator: "Official Team",
            isPremium: false,
            url: `https://docs.example.com/${topic.toLowerCase()}`
          },
          {
            title: "Beginner-Friendly Video Tutorial Series",
            type: "video",
            description: "Comprehensive video series breaking down fundamental concepts with visual demonstrations and clear explanations.",
            creator: "Expert Instructor on YouTube",
            isPremium: false,
            url: "https://youtube.example.com/tutorials"
          },
          {
            title: `Introduction to ${topic}`,
            type: "course",
            description: "Interactive hands-on course with quizzes and exercises to solidify your understanding of core concepts.",
            creator: "Learning Platform",
            isPremium: true,
            url: "https://course.example.com/intro"
          },
          {
            title: `${topic} Quick Reference Guide`,
            type: "book",
            description: "Concise guide with practical examples, cheat sheets, and common use cases for quick reference.",
            creator: "Technical Authors",
            isPremium: false,
            url: "https://guide.example.com"
          }
        ]
      },
      {
        id: 2,
        title: "Deep Dive into Weak Areas",
        description: `Focus intensively on your identified weak areas: ${weakAreas?.[0] || 'advanced concepts'}. This step uses targeted resources to address knowledge gaps and build confidence in challenging areas.`,
        estimatedTime: "2-3 weeks",
        keyTopics: ["Advanced patterns", "Complex concepts", "Troubleshooting", "Common pitfalls"],
        resources: [
          {
            title: `Advanced ${topic} Concepts Masterclass`,
            type: "course",
            description: "In-depth course covering complex topics, real-world scenarios, and advanced techniques with expert guidance.",
            creator: "Industry Expert",
            isPremium: true,
            url: "https://masterclass.example.com/advanced"
          },
          {
            title: `${topic}: The Complete Deep Dive`,
            type: "book",
            description: "Comprehensive book with detailed explanations, case studies, and practical examples of advanced concepts.",
            creator: "Technical Author",
            isPremium: false,
            url: "https://book.example.com"
          },
          {
            title: "Interactive Problem-Solving Platform",
            type: "interactive",
            description: "Practice platform with 100+ problems of varying difficulty, instant feedback, and community solutions.",
            creator: "LeetCode/HackerRank Style Platform",
            isPremium: true,
            url: "https://problems.example.com"
          },
          {
            title: "Advanced Patterns & Best Practices Article Series",
            type: "tutorial",
            description: "Deep-dive articles covering advanced patterns, optimization techniques, and industry best practices.",
            creator: "Technical Blogs",
            isPremium: false,
            url: "https://blog.example.com/advanced"
          }
        ]
      },
      {
        id: 3,
        title: "Hands-On Projects & Real-World Application",
        description: "Apply your knowledge by building real-world projects. This practical experience solidifies concepts and creates portfolio pieces that demonstrate competency.",
        estimatedTime: "3-4 weeks",
        keyTopics: ["Project planning", "Implementation", "Debugging", "Performance optimization"],
        resources: [
          {
            title: "Project-Based Learning Repository",
            type: "tutorial",
            description: "Collection of 20+ real-world project ideas with detailed requirements, starter code, and solution examples.",
            creator: "Open Source Community",
            isPremium: false,
            url: "https://github.com/projects"
          },
          {
            title: "Capstone Project Course",
            type: "course",
            description: "Guided capstone project where you build a complete application from scratch with instructor feedback.",
            creator: "Learning Platform",
            isPremium: true,
            url: "https://capstone.example.com"
          },
          {
            title: "Code Review & Mentoring Program",
            type: "course",
            description: "Get your code reviewed by experienced developers and receive personalized feedback on your projects.",
            creator: "Expert Mentors",
            isPremium: true,
            url: "https://mentor.example.com"
          },
          {
            title: "Production-Ready Code Examples",
            type: "tutorial",
            description: "Real production code samples, templates, and architecture patterns used in industry-standard projects.",
            creator: "Tech Companies",
            isPremium: false,
            url: "https://github.com/examples"
          }
        ]
      },
      {
        id: 4,
        title: "Optimization, Performance & Advanced Topics",
        description: "Learn optimization techniques, performance tuning, and explore specialized advanced topics that separate good developers from great ones.",
        estimatedTime: "2-3 weeks",
        keyTopics: ["Performance optimization", "Scalability", "Security", "Advanced patterns", "Specialized domains"],
        resources: [
          {
            title: "Performance Optimization Guide",
            type: "book",
            description: "Detailed guide on profiling, optimization techniques, and performance best practices with benchmarks.",
            creator: "Performance Experts",
            isPremium: false,
            url: "https://perf.example.com"
          },
          {
            title: "System Design & Architecture Course",
            type: "course",
            description: "Learn how to design scalable, maintainable systems with architectural patterns and trade-offs.",
            creator: "System Design Experts",
            isPremium: true,
            url: "https://systemdesign.example.com"
          },
          {
            title: "Conference Talks & Expert Presentations",
            type: "video",
            description: "Talks from industry leaders covering cutting-edge techniques, emerging trends, and real-world experiences.",
            creator: "Tech Conferences",
            isPremium: false,
            url: "https://conferences.example.com"
          },
          {
            title: "Research Papers & Technical Articles",
            type: "book",
            description: "Curated collection of important research papers and technical articles on advanced topics.",
            creator: "Academic & Industry Researchers",
            isPremium: false,
            url: "https://papers.example.com"
          }
        ]
      },
      {
        id: 5,
        title: "Specialization & Continuous Learning",
        description: "Choose a specialization path that aligns with your career goals. Continue learning through community engagement, contribution to open-source, and staying current with trends.",
        estimatedTime: "Ongoing",
        keyTopics: ["Specialization paths", "Community contribution", "Career development", "Emerging trends"],
        resources: [
          {
            title: `${topic} Specialization Paths Guide`,
            type: "documentation",
            description: "Overview of different career paths and specialization options within this field with required skills.",
            creator: "Industry Guides",
            isPremium: false,
            url: "https://paths.example.com"
          },
          {
            title: "Open Source Contribution Guide",
            type: "tutorial",
            description: "How to find and contribute to open-source projects in your specialization area to build experience.",
            creator: "Open Source Community",
            isPremium: false,
            url: "https://opensource.example.com"
          },
          {
            title: "Professional Certification Program",
            type: "course",
            description: "Industry-recognized certification that validates your expertise and opens career opportunities.",
            creator: "Certification Bodies",
            isPremium: true,
            url: "https://cert.example.com"
          },
          {
            title: "1-on-1 Career Mentorship",
            type: "course",
            description: "Personalized mentoring from industry veterans to guide your specialization and career growth.",
            creator: "Expert Mentors",
            isPremium: true,
            url: "https://mentorship.example.com"
          }
        ]
      }
    ]
  };

  return baseRoadmap;
};

module.exports = {
  mockGenerateQuiz,
  mockAssessKnowledge,
  mockGenerateRoadmap
};
