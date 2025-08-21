import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminCourseForm, AdminCourseFormValues } from "@/components/AdminCourseForm";
import { useAuth } from "@/hooks/use-auth";
import { userService } from "@/lib/user-service";
import { useCourse, useUpdateCourse } from "@/hooks/use-courses";
import { useToast } from "@/hooks/use-toast";

const AdminCourseEdit = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: course, isLoading } = useCourse(id || "");
  const updateCourse = useUpdateCourse();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const isAdmin = await userService.isAdmin();
      if (!isAdmin) {
        toast({ title: "Access denied", description: "You must be an admin to edit courses.", variant: "destructive" });
        navigate("/dashboard");
      }
    })();
  }, [navigate, toast]);

  const initialValues = useMemo<Partial<AdminCourseFormValues>>(() => {
    if (!course) return {};
    return {
      title: course.title,
      description: course.description,
      shortDescription: course.shortDescription,
      imageUrl: course.image,
      price: course.price,
      originalPrice: course.originalPrice,
      duration: course.duration,
      level: course.level,
      category: course.category,
      syllabus: course.syllabus,
      perks: course.perks,
      whatsappGroupLink: course.whatsappGroupLink,
      resources: course.resources,
      featured: course.featured,
    };
  }, [course]);

  const handleSubmit = async (values: AdminCourseFormValues) => {
    if (!id) return;
    try {
      setSubmitting(true);
      await updateCourse.mutateAsync({ id, ...values });
      navigate("/admin");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;
  if (isLoading) return null;
  if (!course) {
    return (
      <div className="max-w-2xl mx-auto p-4">Course not found</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Course</CardTitle>
          <CardDescription>Update course details</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminCourseForm initialValues={initialValues} mode="edit" onSubmit={handleSubmit} submitting={submitting} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCourseEdit;


