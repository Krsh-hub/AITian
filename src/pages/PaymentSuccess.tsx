import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { enrollmentService } from '@/services/enrollmentService';
import { Course } from '@/types/course';

export default function PaymentSuccess() {
  const { id: courseId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [enrollmentData, setEnrollmentData] = useState<any>(null);

  const { toast } = useToast();
  const { user } = useAuth();

  const paymentId = searchParams.get('razorpay_payment_id');
  const orderId = searchParams.get('razorpay_order_id');

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
      fetchEnrollmentDetails();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      // Fetch course details from your data source
      // This would typically come from your courses data
      const courseData = {
        id: courseId,
        title: "Course Title", // Replace with actual course data
        description: "Course description",
        image: "/placeholder.jpg"
      };
      setCourse(courseData as Course);
    } catch (error) {
      console.error('Error fetching course details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEnrollmentDetails = async () => {
    if (!user || !orderId) return;

    try {
      const transaction = await enrollmentService.getPaymentTransactionByOrderId(orderId);
      if (transaction) {
        setEnrollmentData(transaction);
      }
    } catch (error) {
      console.error('Error fetching enrollment details:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <Card className="mb-6">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-muted-foreground text-lg">
                Thank you for your purchase. You have been successfully enrolled in the course.
              </p>
            </CardContent>
          </Card>

          {/* Course Details */}
          {course && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{course.title}</h3>
                    <p className="text-muted-foreground">{course.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment ID:</span>
                    <span className="font-mono text-sm">{paymentId}</span>
                  </div>
                )}
                {orderId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID:</span>
                    <span className="font-mono text-sm">{orderId}</span>
                  </div>
                )}
                {enrollmentData && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-semibold">₹{enrollmentData.amount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="text-green-600 font-semibold">Completed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Access Your Course</h4>
                    <p className="text-muted-foreground">
                      You can now access all course materials and start learning immediately.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Lifetime Access</h4>
                    <p className="text-muted-foreground">
                      You have lifetime access to this course and all future updates.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to={`/course/${courseId}`} className="flex-1">
              <Button className="w-full" size="lg">
                <BookOpen className="mr-2 h-4 w-4" />
                Go to Course
              </Button>
            </Link>
            <Link to="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full" size="lg">
                <ArrowRight className="mr-2 h-4 w-4" />
                My Dashboard
              </Button>
            </Link>
          </div>

          {/* Support Information */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Need help? Contact our support team at{' '}
              <a href="mailto:support@coursecraft.com" className="text-primary hover:underline">
                support@coursecraft.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


