import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService, CreateCourseData, UpdateCourseData } from '@/lib/course-service';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (filters: string) => [...courseKeys.lists(), { filters }] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
  featured: () => [...courseKeys.all, 'featured'] as const,
};

// Get all courses
export const useCourses = () => {
  return useQuery({
    queryKey: courseKeys.lists(),
    queryFn: courseService.getAllCourses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get featured courses
export const useFeaturedCourses = () => {
  return useQuery({
    queryKey: courseKeys.featured(),
    queryFn: courseService.getFeaturedCourses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get course by ID
export const useCourse = (id: string) => {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => courseService.getCourseById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Search courses
export const useSearchCourses = (query: string) => {
  return useQuery({
    queryKey: courseKeys.list(`search:${query}`),
    queryFn: () => courseService.searchCourses(query),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get courses by category
export const useCoursesByCategory = (category: string) => {
  return useQuery({
    queryKey: courseKeys.list(`category:${category}`),
    queryFn: () => courseService.getCoursesByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get courses by level
export const useCoursesByLevel = (level: string) => {
  return useQuery({
    queryKey: courseKeys.list(`level:${level}`),
    queryFn: () => courseService.getCoursesByLevel(level),
    enabled: !!level,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create course mutation (admin only)
export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: courseService.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: courseKeys.featured() });
      toast({
        title: 'Success',
        description: 'Course created successfully!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Update course mutation (admin only)
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: courseService.updateCourse,
    onSuccess: (updatedCourse) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: courseKeys.featured() });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(updatedCourse.id) });
      toast({
        title: 'Success',
        description: 'Course updated successfully!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Delete course mutation (admin only)
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: courseService.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: courseKeys.featured() });
      toast({
        title: 'Success',
        description: 'Course deleted successfully!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
