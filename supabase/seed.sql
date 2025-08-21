-- Insert sample courses
INSERT INTO public.courses (
    title,
    description,
    short_description,
    image_url,
    price,
    original_price,
    duration,
    level,
    category,
    instructor_name,
    instructor_bio,
    instructor_image_url,
    instructor_experience,
    syllabus,
    perks,
    students_enrolled,
    rating,
    featured,
    whatsapp_group_link,
    resources
) VALUES 
(
    'AI & Machine Learning Fundamentals',
    'Master the foundations of artificial intelligence and machine learning with hands-on projects and real-world applications. This comprehensive course covers everything from basic concepts to advanced techniques.',
    'Learn AI/ML fundamentals with practical projects and industry applications.',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    12999,
    19999,
    '8 weeks',
    'Beginner',
    'Artificial Intelligence',
    'Dr. Sarah Johnson',
    'PhD in Computer Science with 10+ years of experience in AI research and development.',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop',
    '10+ years',
    '[
        {
            "module": "Introduction to AI & ML",
            "topics": ["What is AI and ML", "Types of Machine Learning", "Applications in Industry"]
        },
        {
            "module": "Python for ML",
            "topics": ["NumPy & Pandas", "Data Visualization", "Scikit-learn Basics"]
        },
        {
            "module": "Supervised Learning",
            "topics": ["Linear Regression", "Classification Algorithms", "Model Evaluation"]
        },
        {
            "module": "Deep Learning Basics",
            "topics": ["Neural Networks", "TensorFlow/Keras", "CNN & RNN Introduction"]
        }
    ]'::jsonb,
    ARRAY['Live instructor support', 'Hands-on projects', 'Certificate of completion', 'Job placement assistance', 'Lifetime access to course materials'],
    1250,
    4.8,
    true,
    'https://chat.whatsapp.com/DUMMY_LINK_1',
    '[
        {"title": "Course Materials PDF", "downloadLink": "/resources/ai-ml-materials.pdf"},
        {"title": "Code Examples", "downloadLink": "/resources/ai-ml-code.zip"}
    ]'::jsonb
),
(
    'Data Science & Analytics',
    'Become a data science expert with this comprehensive program covering statistics, Python, SQL, and advanced analytics techniques.',
    'Complete data science program with Python, SQL, and statistical analysis.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    15999,
    24999,
    '12 weeks',
    'Intermediate',
    'Data Science',
    'Prof. Michael Chen',
    'Former Google Data Scientist with expertise in big data and analytics.',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    '8+ years',
    '[
        {
            "module": "Statistics for Data Science",
            "topics": ["Descriptive Statistics", "Probability Theory", "Statistical Inference"]
        },
        {
            "module": "Python Programming",
            "topics": ["Advanced Python", "Data Manipulation", "API Integration"]
        },
        {
            "module": "SQL & Databases",
            "topics": ["Database Design", "Complex Queries", "Data Warehousing"]
        },
        {
            "module": "Machine Learning for Data Science",
            "topics": ["Feature Engineering", "Model Selection", "Ensemble Methods"]
        }
    ]'::jsonb,
    ARRAY['Industry mentorship', 'Portfolio development', 'Interview preparation', 'Networking opportunities', 'Access to premium datasets'],
    890,
    4.9,
    true,
    'https://chat.whatsapp.com/DUMMY_LINK_2',
    '[
        {"title": "Data Science Handbook", "downloadLink": "/resources/data-science-handbook.pdf"},
        {"title": "Sample Datasets", "downloadLink": "/resources/sample-datasets.zip"}
    ]'::jsonb
),
(
    'Web Development Bootcamp',
    'Full-stack web development course covering modern technologies like React, Node.js, and cloud deployment.',
    'Full-stack web development with React, Node.js, and modern tools.',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
    9999,
    16999,
    '10 weeks',
    'Beginner',
    'Web Development',
    'Alex Rodriguez',
    'Senior Full-stack Developer with experience at top tech companies.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    '7+ years',
    '[
        {
            "module": "Frontend Development",
            "topics": ["HTML5 & CSS3", "JavaScript ES6+", "React & Redux"]
        },
        {
            "module": "Backend Development",
            "topics": ["Node.js & Express", "Database Design", "RESTful APIs"]
        },
        {
            "module": "DevOps & Deployment",
            "topics": ["Git & GitHub", "AWS/Heroku", "CI/CD Pipelines"]
        }
    ]'::jsonb,
    ARRAY['Build 3 complete projects', 'Code reviews', 'Career guidance', 'GitHub portfolio setup'],
    2100,
    4.7,
    false,
    'https://chat.whatsapp.com/DUMMY_LINK_3',
    '[
        {"title": "Web Development Guide", "downloadLink": "/resources/web-dev-guide.pdf"},
        {"title": "Project Templates", "downloadLink": "/resources/project-templates.zip"}
    ]'::jsonb
);

-- Note: To create an admin user, you need to:
-- 1. Sign up normally through the app
-- 2. Then manually update their role in the database:
-- UPDATE public.user_profiles SET role = 'admin' WHERE id = 'your-user-id';
