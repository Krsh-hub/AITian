import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { userService } from "@/lib/user-service";
import { courseService } from "@/lib/course-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const AdminTest = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Test 1: Get current user profile
      const profile = await userService.getCurrentUserProfile();
      setUserProfile(profile);
      console.log("User profile:", profile);

      // Test 2: Check if admin
      const isAdmin = await userService.isAdmin();
      console.log("Is admin:", isAdmin);

      // Test 3: Get all users (admin only)
      if (isAdmin) {
        const users = await userService.getAllUsers();
        setAllUsers(users);
        console.log("All users:", users);
      }

      // Test 4: Get all courses
      const courses = await courseService.getAllCourses();
      setAllCourses(courses);
      console.log("All courses:", courses);

    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: `Failed to load data: ${error}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testUpdateUserRole = async () => {
    if (allUsers.length === 0) {
      toast({
        title: "No users",
        description: "No users found to test with",
        variant: "destructive",
      });
      return;
    }

    const testUser = allUsers[0];
    try {
      await userService.updateUserRole(testUser.id, 'student');
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      loadData(); // Reload data
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        title: "Error",
        description: `Failed to update user role: ${error}`,
        variant: "destructive",
      });
    }
  };

  const testDeleteCourse = async () => {
    if (allCourses.length === 0) {
      toast({
        title: "No courses",
        description: "No courses found to test with",
        variant: "destructive",
      });
      return;
    }

    const testCourse = allCourses[0];
    try {
      await courseService.deleteCourse(testCourse.id);
      toast({
        title: "Success",
        description: "Course deleted successfully",
      });
      loadData(); // Reload data
    } catch (error) {
      console.error("Error deleting course:", error);
      toast({
        title: "Error",
        description: `Failed to delete course: ${error}`,
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center">Please sign in to test admin functions</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin Function Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={loadData} disabled={loading}>
                {loading ? "Loading..." : "Load Data"}
              </Button>
              <Button onClick={testUpdateUserRole} variant="outline">
                Test Update User Role
              </Button>
              <Button onClick={testDeleteCourse} variant="outline">
                Test Delete Course
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                    {JSON.stringify(userProfile, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">All Users ({allUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(allUsers, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">All Courses ({allCourses.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(allCourses, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminTest;
