import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, Users, Award, TrendingUp, Star, CheckCircle } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { courses } from "@/data/courses";

const Home = () => {
  const featuredCourses = courses.filter(course => course.featured).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Master the Future with
                  <span className="block bg-gradient-to-r from-white to-accent-foreground bg-clip-text text-transparent">
                    Expert-Led Training
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                  Transform your career with industry-leading courses in AI, Data Science, and Technology. 
                  Join thousands of professionals who've accelerated their growth with CourseCraft.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8">
                    Explore Courses
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8">
                    Our Services
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-white/80 text-sm">Students Trained</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-white/80 text-sm">Expert Instructors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">95%</div>
                  <div className="text-white/80 text-sm">Success Rate</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Live Interactive Classes</div>
                    <div className="text-white/80 text-sm">Learn with industry experts</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Industry Certification</div>
                    <div className="text-white/80 text-sm">Get recognized credentials</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Career Support</div>
                    <div className="text-white/80 text-sm">Job placement assistance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: "Active Students", value: "10,000+" },
              { icon: BookOpen, label: "Courses Available", value: "150+" },
              { icon: Award, label: "Certifications", value: "25,000+" },
              { icon: Star, label: "Average Rating", value: "4.8/5" },
            ].map((stat, index) => (
              <Card key={index} className="text-center p-6 border-0 shadow-soft">
                <CardContent className="p-0 space-y-3">
                  <stat.icon className="h-8 w-8 mx-auto text-accent" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Featured Courses
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular and highly-rated courses designed by industry experts
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/courses">
              <Button size="lg" className="bg-primary hover:bg-primary-hover px-8">
                View All Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Why Choose CourseCraft?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing the best learning experience for your professional growth
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Expert Instructors",
                description: "Learn from industry professionals with years of real-world experience",
                icon: Users
              },
              {
                title: "Hands-on Projects",
                description: "Build your portfolio with practical projects that showcase your skills",
                icon: BookOpen
              },
              {
                title: "Career Support",
                description: "Get job placement assistance and career guidance from our team",
                icon: TrendingUp
              },
              {
                title: "Flexible Learning",
                description: "Study at your own pace with lifetime access to course materials",
                icon: CheckCircle
              },
              {
                title: "Industry Recognition",
                description: "Earn certificates that are recognized by top companies worldwide",
                icon: Award
              },
              {
                title: "Community Support",
                description: "Join a thriving community of learners and professionals",
                icon: Users
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow border-0 shadow-soft">
                <CardContent className="p-0 space-y-4">
                  <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Transform Your Career?
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Join thousands of professionals who have successfully transitioned to high-growth careers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8">
                  Start Learning Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;