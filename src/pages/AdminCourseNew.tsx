import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminCourseForm, AdminCourseFormValues } from "@/components/AdminCourseForm";
import { useAuth } from "@/hooks/use-auth";
import { userService } from "@/lib/user-service";
import { useCreateCourse } from "@/hooks/use-courses";
import { useToast } from "@/hooks/use-toast";

const AdminCourseNew = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createCourse = useCreateCourse();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: AdminCourseFormValues) => {
    try {
      setSubmitting(true);
      const isAdmin = await userService.isAdmin();
      if (!isAdmin) {
        toast({ title: "Access denied", description: "You must be an admin to create courses.", variant: "destructive" });
        navigate("/dashboard");
        return;
      }
      await createCourse.mutateAsync(values);
      navigate("/admin");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>New Course</CardTitle>
          <CardDescription>Create a new course</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminCourseForm mode="create" onSubmit={handleSubmit} submitting={submitting} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCourseNew;


