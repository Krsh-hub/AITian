import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: 'student' | 'instructor' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  full_name?: string;
  avatar_url?: string;
  bio?: string;
}

export const userService = {
  // Get current user profile
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }

    return data;
  },

  // Update user profile
  async updateProfile(profileData: UpdateProfileData): Promise<UserProfile> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .update(profileData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }

    return data;
  },

  // Check if user is admin
  async isAdmin(): Promise<boolean> {
    const profile = await this.getCurrentUserProfile();
    return profile?.role === 'admin';
  },

  // Get all users (admin only)
  async getAllUsers(): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }

    return data;
  },

  // Update user role (admin only)
  async updateUserRole(userId: string, role: 'student' | 'instructor' | 'admin'): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user role:', error);
      throw new Error('Failed to update user role');
    }

    return data;
  },

  // Get user enrollments
  async getUserEnrollments(): Promise<any[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('course_enrollments')
      .select(`
        *,
        courses (
          id,
          title,
          image_url,
          duration,
          level
        )
      `)
      .eq('user_id', user.id)
      .order('enrolled_at', { ascending: false });

    if (error) {
      console.error('Error fetching enrollments:', error);
      throw new Error('Failed to fetch enrollments');
    }

    return data;
  },

  // Enroll in a course
  async enrollInCourse(courseId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('course_enrollments')
      .insert({
        user_id: user.id,
        course_id: courseId
      });

    if (error) {
      console.error('Error enrolling in course:', error);
      throw new Error('Failed to enroll in course');
    }
  },

  // Update course progress
  async updateCourseProgress(courseId: string, progress: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('course_enrollments')
      .update({ progress })
      .eq('user_id', user.id)
      .eq('course_id', courseId);

    if (error) {
      console.error('Error updating course progress:', error);
      throw new Error('Failed to update course progress');
    }
  },

  // Mark course as completed
  async completeCourse(courseId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('course_enrollments')
      .update({ progress: 100, completed: true })
      .eq('user_id', user.id)
      .eq('course_id', courseId);

    if (error) {
      console.error('Error completing course:', error);
      throw new Error('Failed to complete course');
    }
  },

  // Check if user passed test for course to allow certification
  async hasPassedCourseTest(courseId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    // find latest test for course
    const { data: tests } = await supabase
      .from('tests')
      .select('id')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false })
      .limit(1);
    const testId = tests?.[0]?.id;
    if (!testId) return false;
    const { data: res } = await supabase
      .from('test_results')
      .select('passed')
      .eq('test_id', testId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    return !!res?.passed;
  }
};
