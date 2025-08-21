import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  Users, 
  Clock, 
  Award, 
  CheckCircle, 
  ArrowLeft, 
  Play,
  Download,
  MessageCircle,
  BookOpen
} from "lucide-react";
import { courses } from "@/data/courses";
import PaymentModal from "@/components/PaymentModal";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const course = courses.find(c => c.id === id);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Course not found</h1>
          <p className="text-muted-foreground">The course you're looking for doesn't exist.</p>
          <Link to="/courses">
            <Button className="bg-primary hover:bg-primary-hover">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link to="/courses" className="hover:text-accent">Courses</Link>
          <span>/</span>
          <span className="text-foreground">{course.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Button size="lg" className="bg-white/20 backdrop-blur-sm border-white text-white hover:bg-white/30">
                    <Play className="mr-2 h-5 w-5" />
                    Preview Course
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="secondary">{course.category}</Badge>
                  <Badge variant="outline">{course.level}</Badge>
                  {course.featured && (
                    <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {course.title}
                </h1>

                <p className="text-lg text-muted-foreground">
                  {course.description}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{course.rating}</span>
                    <span className="text-muted-foreground ml-1">rating</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{course.studentsEnrolled.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{course.duration}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Syllabus */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-primary" />
                  Course Curriculum
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.syllabus.map((module, index) => (
                  <div key={index} className="space-y-3">
                    <h4 className="font-semibold text-foreground">
                      Module {index + 1}: {module.module}
                    </h4>
                    <ul className="space-y-2 ml-4">
                      {module.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-success mr-2 flex-shrink-0" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                    {index < course.syllabus.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Instructor Info */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Meet Your Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <img
                    src={course.instructor.image}
                    alt={course.instructor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">{course.instructor.name}</h4>
                    <p className="text-sm text-muted-foreground">{course.instructor.experience} experience</p>
                    <p className="text-sm text-muted-foreground">{course.instructor.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What You'll Get */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>What You'll Get</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {course.perks.map((perk, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-success mr-3 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{perk}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="sticky top-24 border-0 shadow-medium">
              <CardContent className="p-6 space-y-6">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-3xl font-bold text-accent">₹{course.price.toLocaleString()}</span>
                    {course.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">₹{course.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  {course.originalPrice && (
                    <div className="inline-block bg-success-light text-success-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Save ₹{(course.originalPrice - course.price).toLocaleString()}
                    </div>
                  )}
                </div>

                <Button 
                  size="lg" 
                  className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3"
                  onClick={() => setIsPaymentModalOpen(true)}
                >
                  <Award className="mr-2 h-5 w-5" />
                  Enroll Now
                </Button>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-3" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-3" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-3" />
                    <span>Mobile and desktop access</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-3" />
                    <span>30-day money-back guarantee</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact Instructor
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Brochure
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Course Stats */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Course Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Students Enrolled</span>
                  <span className="font-medium">{course.studentsEnrolled.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Course Duration</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Skill Level</span>
                  <span className="font-medium">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{course.rating}/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        courseId={course.id}
        courseTitle={course.title}
        amount={course.price}
        originalPrice={course.originalPrice}
      />
    </div>
  );
};

export default CourseDetail;