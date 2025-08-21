import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download, Play, BookOpen, Users, Clock } from "lucide-react";
import { courses } from "@/data/courses";

const PaymentSuccess = () => {
  const { id } = useParams<{ id: string }>();
  const course = courses.find(c => c.id === id);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Course not found</h1>
          <Link to="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-green-800">Payment Successful!</h1>
          <p className="text-xl text-muted-foreground">
            Welcome to {course.title}! You're now enrolled and ready to start learning.
          </p>
          <Badge variant="secondary" className="bg-green-100 text-green-800 text-lg px-4 py-2">
            Transaction ID: TXN{Date.now()}
          </Badge>
        </div>

        {/* Course Access Card */}
        <Card className="mb-8 border-2 border-green-200 shadow-lg">
          <CardHeader className="text-center bg-green-50">
            <CardTitle className="text-2xl text-green-800">
              🎉 You're All Set!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Course Info */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Course Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <span className="text-muted-foreground">Course:</span>
                    <span className="font-medium">{course.title}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="text-muted-foreground">Instructor:</span>
                    <span className="font-medium">{course.instructor.name}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Play className="mr-2 h-4 w-4" />
                    Start Learning
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Course Materials
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Users className="mr-2 h-4 w-4" />
                    Join Student Community
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📧</span>
                </div>
                <h4 className="font-semibold">Check Your Email</h4>
                <p className="text-sm text-muted-foreground">
                  We've sent you a welcome email with course access details and login credentials.
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <h4 className="font-semibold">Join WhatsApp Group</h4>
                <p className="text-sm text-muted-foreground">
                  Connect with fellow students and instructors in our dedicated WhatsApp community.
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-semibold">Start Learning</h4>
                <p className="text-sm text-muted-foreground">
                  Begin your learning journey with the first module and start building your skills.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Perks */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Your Course Perks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {course.perks.map((perk, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-muted-foreground">{perk}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/course/${course.id}`}>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Play className="mr-2 h-5 w-5" />
                Go to Course
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="outline" size="lg">
                Browse More Courses
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Need help? Contact our support team at{" "}
            <a href="mailto:support@coursecraft.com" className="text-primary hover:underline">
              support@coursecraft.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;


