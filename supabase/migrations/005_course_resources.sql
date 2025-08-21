-- Create table to track course resources stored in Supabase Storage
CREATE TABLE IF NOT EXISTS public.course_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_path TEXT NOT NULL, -- storage path within the bucket
    file_type TEXT NOT NULL CHECK (file_type IN ('video','pdf','other')),
    position INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.course_resources ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage resources
CREATE POLICY "Admins can manage course resources" ON public.course_resources
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            WHERE up.id = auth.uid() AND up.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            WHERE up.id = auth.uid() AND up.role = 'admin'
        )
    );

-- Allow enrolled students (and admins) to read resources for their courses
CREATE POLICY "Enrolled users can read course resources" ON public.course_resources
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            WHERE up.id = auth.uid() AND up.role = 'admin'
        )
        OR EXISTS (
            SELECT 1 FROM public.course_enrollments ce
            WHERE ce.user_id = auth.uid() AND ce.course_id = course_resources.course_id
        )
    );

-- Create a private bucket for course resources if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'course-resources') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('course-resources', 'course-resources', false);
  END IF;
END $$;

-- Storage RLS policies for the bucket "course-resources"
-- Enforce naming convention: course/<course_id>/<resource_id>/<filename>

-- Allow admins full access in bucket
CREATE POLICY "Admins full access to course-resources bucket" ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'course-resources' AND EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  )
  WITH CHECK (
    bucket_id = 'course-resources' AND EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

-- Allow enrolled users to read objects for their enrolled course
CREATE POLICY "Enrolled users can read course resource objects" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'course-resources' AND (
      EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'
      )
      OR (
        -- Path format: course/<course_id>/...
        position('/' IN name) > 0
        AND split_part(name, '/', 1) = 'course'
        AND EXISTS (
          SELECT 1 FROM public.course_enrollments ce
          WHERE ce.user_id = auth.uid() AND ce.course_id = (split_part(name, '/', 2))::uuid
        )
      )
    )
  );

-- Best effort: restrict INSERT/UPDATE/DELETE to admins (covered above), no separate rules for others

-- Helpful index for lookup
CREATE INDEX IF NOT EXISTS idx_course_resources_course_id ON public.course_resources(course_id);
CREATE INDEX IF NOT EXISTS idx_course_resources_position ON public.course_resources(course_id, position);


