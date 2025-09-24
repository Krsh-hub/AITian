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
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourseNew from "./pages/AdminCourseNew";
import AdminCourseEdit from "./pages/AdminCourseEdit";
import AdminCourseResources from "./pages/AdminCourseResources";
import AdminTest from "./pages/AdminTest";
import TestAuth from "./pages/TestAuth";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";
import Tests from "./pages/Tests";
import CourseTest from "./pages/CourseTest";
import AdminTests from "./pages/AdminTests";
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";
import PublicOnly from "./components/PublicOnly";
import CourseResources from "./pages/CourseResources";
import About from "./pages/About";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/tests" element={<Tests />} />
              <Route path="/tests/:id" element={<CourseTest />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/course/:id/success" element={<PaymentSuccess />} />
              <Route
                path="/course/:id/resources"
                element={<RequireAuth><CourseResources /></RequireAuth>}
              />

              <Route path="/signin" element={<PublicOnly><SignIn /></PublicOnly>} />
              <Route path="/signup" element={<PublicOnly><SignUp /></PublicOnly>} />
              <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
              <Route path="/admin/tests" element={<RequireAdmin><AdminTests /></RequireAdmin>} />
              <Route
                path="/admin/courses/:id/resources"
                element={<RequireAdmin><AdminCourseResources /></RequireAdmin>}
              />
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
  </QueryClientProvider>
);

export default App;
