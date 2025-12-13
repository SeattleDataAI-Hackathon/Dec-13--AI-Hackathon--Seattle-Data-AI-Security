const mockGenerateQuiz = async (topic) => {
  return {
    questions: [
      {
        id: 1,
        question: `What is the fundamental purpose of ${topic}?`,
        options: ["To solve complex problems", "Entertainment only", "Building skills", "All of the above"],
        type: "multiple-choice"
      },
      {
        id: 2,
        question: `Which concept is most important in ${topic}?`,
        options: ["Fundamentals", "Advanced techniques", "Tools", "None of these"],
        type: "multiple-choice"
      },
      {
        id: 3,
        question: `How long does it typically take to learn ${topic}?`,
        options: ["1 week", "1 month", "3-6 months", "Depends on effort"],
        type: "multiple-choice"
      },
      {
        id: 4,
        question: `What is a common challenge when learning ${topic}?`,
        options: ["Lack of resources", "Consistency", "Complexity", "All of the above"],
        type: "multiple-choice"
      },
      {
        id: 5,
        question: `Which skill complements ${topic} well?`,
        options: ["Communication", "Problem-solving", "Creativity", "All of the above"],
        type: "multiple-choice"
      }
    ]
  };
};

const mockAssessKnowledge = async () => {
  return {
    score: 3,
    totalQuestions: 5,
    percentage: 60,
    weakAreas: ["Advanced concepts", "Practical applications"],
    strongAreas: ["Fundamentals", "Basic theory"]
  };
};

const mockGenerateRoadmap = async (topic, timeline, assessmentScore, weakAreas) => {
  return {
    topic,
    timeline,
    assessmentScore,
    summary: `Based on your assessment score of ${assessmentScore}%, here's a personalized roadmap for ${topic}. This roadmap focuses on strengthening your weak areas while building on your existing knowledge.`,
    focusAreas: weakAreas || ["Advanced concepts", "Practical applications"],
    steps: [
      {
        title: "1. Review Fundamentals",
        description: "Start by reviewing the core concepts to ensure a strong foundation",
        estimatedTime: "1-2 weeks",
        resources: [
          {
            title: "Official Documentation",
            type: "documentation",
            description: `Official ${topic} documentation covering all basic concepts`,
            isPremium: false,
            url: "https://docs.example.com"
          },
          {
            title: "Beginner Tutorial Series",
            type: "video",
            description: "10-part video series on fundamentals",
            isPremium: false,
            url: "https://youtube.example.com"
          },
          {
            title: "Interactive Learning Platform",
            type: "course",
            description: "Hands-on interactive course with exercises",
            isPremium: true,
            url: "https://premium.example.com"
          }
        ]
      },
      {
        title: "2. Deep Dive into Weak Areas",
        description: `Focus on mastering ${weakAreas?.[0] || "the challenging concepts"} that were identified in your assessment`,
        estimatedTime: "2-3 weeks",
        resources: [
          {
            title: "Advanced Concepts Guide",
            type: "book",
            description: "Comprehensive guide to advanced topics",
            isPremium: true,
            url: "https://example.com/advanced"
          },
          {
            title: "Practice Problems (Free Tier)",
            type: "tutorial",
            description: "100+ practice problems with solutions",
            isPremium: false,
            url: "https://problems.example.com"
          },
          {
            title: "Expert Master Class",
            type: "course",
            description: "In-depth master class taught by industry experts",
            isPremium: true,
            url: "https://masterclass.example.com"
          }
        ]
      },
      {
        title: "3. Hands-on Projects",
        description: "Apply your knowledge by working on real-world projects",
        estimatedTime: "2-4 weeks",
        resources: [
          {
            title: "Project Ideas Database",
            type: "documentation",
            description: "25+ real-world project ideas with requirements",
            isPremium: false,
            url: "https://projects.example.com"
          },
          {
            title: "Code Samples & Templates",
            type: "tutorial",
            description: "Production-ready code samples and templates",
            isPremium: true,
            url: "https://templates.example.com"
          },
          {
            title: "Project Mentoring Sessions",
            type: "course",
            description: "One-on-one guidance for your projects",
            isPremium: true,
            url: "https://mentoring.example.com"
          }
        ]
      },
      {
        title: "4. Advanced Topics",
        description: "Explore advanced concepts and best practices",
        estimatedTime: "2-3 weeks",
        resources: [
          {
            title: "Research Papers Digest",
            type: "book",
            description: "Curated list of important research papers",
            isPremium: false,
            url: "https://research.example.com"
          },
          {
            title: "Industry Best Practices",
            type: "video",
            description: "Talks from industry leaders on best practices",
            isPremium: true,
            url: "https://talks.example.com"
          },
          {
            title: "Advanced Course",
            type: "course",
            description: "Deep dive into expert-level topics",
            isPremium: true,
            url: "https://advanced.example.com"
          }
        ]
      },
      {
        title: "5. Specialization",
        description: "Choose a specialization path and go deeper",
        estimatedTime: "Ongoing",
        resources: [
          {
            title: "Specialization Paths Guide",
            type: "documentation",
            description: "Overview of different specialization options",
            isPremium: false,
            url: "https://paths.example.com"
          },
          {
            title: "Specialized Certification Course",
            type: "course",
            description: "Earn industry-recognized certification",
            isPremium: true,
            url: "https://cert.example.com"
          },
          {
            title: "1-on-1 Mentorship Program",
            type: "course",
            description: "Personalized mentoring for your specialization",
            isPremium: true,
            url: "https://mentor.example.com"
          }
        ]
      }
    ]
  };
};

module.exports = {
  mockGenerateQuiz,
  mockAssessKnowledge,
  mockGenerateRoadmap
};
