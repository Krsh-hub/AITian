import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
<<<<<<< HEAD
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourseNew from "./pages/AdminCourseNew";
import AdminCourseEdit from "./pages/AdminCourseEdit";
import AdminCourseResources from "./pages/AdminCourseResources";
import AdminTest from "./pages/AdminTest";
import TestAuth from "./pages/TestAuth";
=======
import PaymentSuccess from "./pages/PaymentSuccess";
>>>>>>> origin/my-feature-branch
import NotFound from "./pages/NotFound";
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";
import PublicOnly from "./components/PublicOnly";
import CourseResources from "./pages/CourseResources";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
<<<<<<< HEAD
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/course/:id/resources" element={<RequireAuth><CourseResources /></RequireAuth>} />
              <Route path="/signin" element={<PublicOnly><SignIn /></PublicOnly>} />
              <Route path="/signup" element={<PublicOnly><SignUp /></PublicOnly>} />
              <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
              <Route path="/admin/courses/:id/resources" element={<RequireAdmin><AdminCourseResources /></RequireAdmin>} />
              <Route path="/admin/courses/new" element={<AdminCourseNew />} />
              <Route path="/admin/courses/edit/:id" element={<AdminCourseEdit />} />
              <Route path="/admin-test" element={<AdminTest />} />
              <Route path="/test-auth" element={<TestAuth />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
=======
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/course/:id/success" element={<PaymentSuccess />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
>>>>>>> origin/my-feature-branch
  </QueryClientProvider>
);

export default App;
