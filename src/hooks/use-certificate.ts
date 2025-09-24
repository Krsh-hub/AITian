import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import { isCourseCompleted, getCourseCertificate } from '@/services/certificateService';

export function useCourseCompletion(courseId: string) {
  const { user } = useAuth();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkCompletion = async () => {
      if (!user || !courseId) {
        setIsLoading(false);
        return;
      }

      try {
        const completed = await isCourseCompleted(courseId);
        setIsCompleted(completed);
      } catch (err) {
        console.error('Error checking course completion:', err);
        setError(err instanceof Error ? err.message : 'Failed to check completion status');
      } finally {
        setIsLoading(false);
      }
    };

    checkCompletion();
  }, [user, courseId]);

  return { isCompleted, isLoading, error };
}

export function useCertificate(courseId: string) {
  const { user } = useAuth();
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkCertificate = async () => {
      if (!user || !courseId) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await getCourseCertificate(courseId);
        if (result.success && result.pdfUrl) {
          setCertificateUrl(result.pdfUrl);
        }
      } catch (err) {
        console.error('Error checking certificate:', err);
        setError(err instanceof Error ? err.message : 'Failed to check certificate');
      } finally {
        setIsLoading(false);
      }
    };

    checkCertificate();
  }, [user, courseId]);

  return { certificateUrl, isLoading, error };
}
