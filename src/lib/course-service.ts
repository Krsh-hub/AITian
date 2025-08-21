import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/types/course';

export interface DatabaseCourse {
  id: string;
  title: string;
  description: string;
  short_description: string;
  image_url: string;
  price: number;
  original_price: number | null;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  instructor_name: string;
  instructor_bio: string | null;
  instructor_image_url: string | null;
  instructor_experience: string | null;
  syllabus: any;
  perks: string[];
  students_enrolled: number;
  rating: number;
  featured: boolean;
  whatsapp_group_link: string | null;
  resources: any;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  is_active: boolean;
}

export interface CreateCourseData {
  title: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  syllabus: { module: string; topics: string[] }[];
  perks: string[];
  whatsappGroupLink?: string;
  resources?: { title: string; downloadLink: string }[];
  featured?: boolean;
}

export interface UpdateCourseData extends Partial<CreateCourseData> {
  id: string;
}

// Transform database course to frontend course format
const transformCourse = (dbCourse: DatabaseCourse): Course => ({
  id: dbCourse.id,
  title: dbCourse.title,
  description: dbCourse.description,
  shortDescription: dbCourse.short_description,
  image: dbCourse.image_url,
  price: dbCourse.price,
  originalPrice: dbCourse.original_price || undefined,
  duration: dbCourse.duration,
  level: dbCourse.level,
  category: dbCourse.category,
  instructor: {
    name: dbCourse.instructor_name,
    bio: dbCourse.instructor_bio || '',
    image: dbCourse.instructor_image_url || '',
    experience: dbCourse.instructor_experience || ''
  },
  syllabus: dbCourse.syllabus || [],
  perks: dbCourse.perks || [],
  studentsEnrolled: dbCourse.students_enrolled,
  rating: dbCourse.rating,
  featured: dbCourse.featured,
  whatsappGroupLink: dbCourse.whatsapp_group_link || undefined,
  resources: dbCourse.resources || []
});

// Transform frontend course to database format
const transformToDatabase = (course: CreateCourseData) => ({
  title: course.title,
  description: course.description,
  short_description: course.shortDescription,
  image_url: course.imageUrl,
  price: course.price,
  original_price: course.originalPrice || null,
  duration: course.duration,
  level: course.level,
  category: course.category,
  // Provide safe defaults for instructor fields to keep UI simple
  instructor_name: 'Course Team',
  instructor_bio: null,
  instructor_image_url: null,
  instructor_experience: null,
  syllabus: course.syllabus,
  perks: course.perks,
  whatsapp_group_link: course.whatsappGroupLink || null,
  resources: course.resources || null,
  featured: course.featured || false
});

export const courseService = {
  // Get all courses
  async getAllCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses:', error);
      throw new Error('Failed to fetch courses');
    }

    return data.map(transformCourse);
  },

  // Get featured courses
  async getFeaturedCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_active', true)
      .eq('featured', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching featured courses:', error);
      throw new Error('Failed to fetch featured courses');
    }

    return data.map(transformCourse);
  },

  // Get course by ID
  async getCourseById(id: string): Promise<Course | null> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching course:', error);
      throw new Error('Failed to fetch course');
    }

    return data ? transformCourse(data) : null;
  },

  // Create new course (admin only)
  async createCourse(courseData: CreateCourseData): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .insert(transformToDatabase(courseData))
      .select()
      .single();

    if (error) {
      console.error('Error creating course:', error);
      throw new Error('Failed to create course');
    }

    return transformCourse(data);
  },

  // Update course (admin only)
  async updateCourse(courseData: UpdateCourseData): Promise<Course> {
    const { id, ...updateData } = courseData;
    
    // Transform the update data
    const transformedData: any = {};
    if (updateData.title) transformedData.title = updateData.title;
    if (updateData.description) transformedData.description = updateData.description;
    if (updateData.shortDescription) transformedData.short_description = updateData.shortDescription;
    if (updateData.imageUrl) transformedData.image_url = updateData.imageUrl;
    if (updateData.price !== undefined) transformedData.price = updateData.price;
    if (updateData.originalPrice !== undefined) transformedData.original_price = updateData.originalPrice;
    if (updateData.duration) transformedData.duration = updateData.duration;
    if (updateData.level) transformedData.level = updateData.level;
    if (updateData.category) transformedData.category = updateData.category;
    // Instructor fields are managed with defaults
    if (updateData.syllabus) transformedData.syllabus = updateData.syllabus;
    if (updateData.perks) transformedData.perks = updateData.perks;
    if (updateData.whatsappGroupLink !== undefined) transformedData.whatsapp_group_link = updateData.whatsappGroupLink;
    if (updateData.resources !== undefined) transformedData.resources = updateData.resources;
    if (updateData.featured !== undefined) transformedData.featured = updateData.featured;

    const { data, error } = await supabase
      .from('courses')
      .update(transformedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating course:', error);
      throw new Error('Failed to update course');
    }

    return transformCourse(data);
  },

  // Delete course (admin only)
  async deleteCourse(id: string): Promise<void> {
    const { error } = await supabase
      .from('courses')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting course:', error);
      throw new Error('Failed to delete course');
    }
  },

  // Search courses
  async searchCourses(query: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_active', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching courses:', error);
      throw new Error('Failed to search courses');
    }

    return data.map(transformCourse);
  },

  // Get courses by category
  async getCoursesByCategory(category: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_active', true)
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses by category:', error);
      throw new Error('Failed to fetch courses by category');
    }

    return data.map(transformCourse);
  },

  // Get courses by level
  async getCoursesByLevel(level: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_active', true)
      .eq('level', level)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses by level:', error);
      throw new Error('Failed to fetch courses by level');
    }

    return data.map(transformCourse);
  }
};
