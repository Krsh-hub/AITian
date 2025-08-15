import { Course, Service } from "@/types/course";
import aiMlImage from "@/assets/ai-ml-course.jpg";
import dataScienceImage from "@/assets/data-science-course.jpg";
import webDevImage from "@/assets/web-dev-course.jpg";

export const courses: Course[] = [
  {
    id: "1",
    title: "AI & Machine Learning Fundamentals",
    description: "Master the foundations of artificial intelligence and machine learning with hands-on projects and real-world applications. This comprehensive course covers everything from basic concepts to advanced techniques.",
    shortDescription: "Learn AI/ML fundamentals with practical projects and industry applications.",
    image: aiMlImage,
    price: 12999,
    originalPrice: 19999,
    duration: "8 weeks",
    level: "Beginner",
    category: "Artificial Intelligence",
    instructor: {
      name: "Dr. Sarah Johnson",
      bio: "PhD in Computer Science with 10+ years of experience in AI research and development.",
      image: "/api/placeholder/150/150",
      experience: "10+ years"
    },
    syllabus: [
      {
        module: "Introduction to AI & ML",
        topics: ["What is AI and ML", "Types of Machine Learning", "Applications in Industry"]
      },
      {
        module: "Python for ML",
        topics: ["NumPy & Pandas", "Data Visualization", "Scikit-learn Basics"]
      },
      {
        module: "Supervised Learning",
        topics: ["Linear Regression", "Classification Algorithms", "Model Evaluation"]
      },
      {
        module: "Deep Learning Basics",
        topics: ["Neural Networks", "TensorFlow/Keras", "CNN & RNN Introduction"]
      }
    ],
    perks: [
      "Live instructor support",
      "Hands-on projects",
      "Certificate of completion",
      "Job placement assistance",
      "Lifetime access to course materials"
    ],
    studentsEnrolled: 1250,
    rating: 4.8,
    featured: true,
    whatsappGroupLink: "https://chat.whatsapp.com/DUMMY_LINK_1",
    resources: [
      { title: "Course Materials PDF", downloadLink: "/resources/ai-ml-materials.pdf" },
      { title: "Code Examples", downloadLink: "/resources/ai-ml-code.zip" }
    ]
  },
  {
    id: "2",
    title: "Data Science & Analytics",
    description: "Become a data science expert with this comprehensive program covering statistics, Python, SQL, and advanced analytics techniques.",
    shortDescription: "Complete data science program with Python, SQL, and statistical analysis.",
    image: dataScienceImage,
    price: 15999,
    originalPrice: 24999,
    duration: "12 weeks",
    level: "Intermediate",
    category: "Data Science",
    instructor: {
      name: "Prof. Michael Chen",
      bio: "Former Google Data Scientist with expertise in big data and analytics.",
      image: "/api/placeholder/150/150",
      experience: "8+ years"
    },
    syllabus: [
      {
        module: "Statistics for Data Science",
        topics: ["Descriptive Statistics", "Probability Theory", "Statistical Inference"]
      },
      {
        module: "Python Programming",
        topics: ["Advanced Python", "Data Manipulation", "API Integration"]
      },
      {
        module: "SQL & Databases",
        topics: ["Database Design", "Complex Queries", "Data Warehousing"]
      },
      {
        module: "Machine Learning for Data Science",
        topics: ["Feature Engineering", "Model Selection", "Ensemble Methods"]
      }
    ],
    perks: [
      "Industry mentorship",
      "Portfolio development",
      "Interview preparation",
      "Networking opportunities",
      "Access to premium datasets"
    ],
    studentsEnrolled: 890,
    rating: 4.9,
    featured: true
  },
  {
    id: "3",
    title: "Web Development Bootcamp",
    description: "Full-stack web development course covering modern technologies like React, Node.js, and cloud deployment.",
    shortDescription: "Full-stack web development with React, Node.js, and modern tools.",
    image: webDevImage,
    price: 9999,
    originalPrice: 16999,
    duration: "10 weeks",
    level: "Beginner",
    category: "Web Development",
    instructor: {
      name: "Alex Rodriguez",
      bio: "Senior Full-stack Developer with experience at top tech companies.",
      image: "/api/placeholder/150/150",
      experience: "7+ years"
    },
    syllabus: [
      {
        module: "Frontend Development",
        topics: ["HTML5 & CSS3", "JavaScript ES6+", "React & Redux"]
      },
      {
        module: "Backend Development",
        topics: ["Node.js & Express", "Database Design", "RESTful APIs"]
      },
      {
        module: "DevOps & Deployment",
        topics: ["Git & GitHub", "AWS/Heroku", "CI/CD Pipelines"]
      }
    ],
    perks: [
      "Build 3 complete projects",
      "Code reviews",
      "Career guidance",
      "GitHub portfolio setup"
    ],
    studentsEnrolled: 2100,
    rating: 4.7,
    featured: false
  }
];

export const services: Service[] = [
  {
    id: "1",
    title: "AI Training for Schools",
    description: "Comprehensive AI education programs designed specifically for K-12 students, making artificial intelligence concepts accessible and engaging.",
    features: [
      "Age-appropriate AI curriculum",
      "Interactive workshops",
      "Teacher training programs",
      "Student certification",
      "Hands-on projects"
    ],
    targetAudience: "K-12 Students & Educators",
    duration: "Flexible (1 day to 1 semester)",
    priceRange: "₹5,000 - ₹50,000",
    image: "/api/placeholder/400/300"
  },
  {
    id: "2",
    title: "Corporate AI Training",
    description: "Customized AI training solutions for organizations looking to upskill their workforce and implement AI-driven strategies.",
    features: [
      "Customized curriculum",
      "Executive workshops",
      "Technical training",
      "AI strategy consulting",
      "Implementation support"
    ],
    targetAudience: "Corporate Teams & Executives",
    duration: "2-8 weeks",
    priceRange: "₹50,000 - ₹5,00,000",
    image: "/api/placeholder/400/300"
  },
  {
    id: "3",
    title: "Data Analytics Consulting",
    description: "End-to-end data analytics solutions helping businesses make data-driven decisions and optimize their operations.",
    features: [
      "Data audit & assessment",
      "Custom analytics solutions",
      "Dashboard development",
      "Team training",
      "Ongoing support"
    ],
    targetAudience: "Small to Large Enterprises",
    duration: "1-6 months",
    priceRange: "₹25,000 - ₹2,50,000",
    image: "/api/placeholder/400/300"
  }
];