import { generateCertificate, saveCertificateRecord, getCertificate, getUserCertificates } from '@/lib/certificate';
import { supabase } from '@/integrations/supabase/client';

export interface CertificateRequest {
  userId: string;
  courseId: string;
  studentName: string;
  courseName: string;
}

export interface CertificateResponse {
  success: boolean;
  pdfUrl?: string;
  error?: string;
}

/**
 * Generates a certificate for a completed course
 * @param request - Certificate generation request
 * @returns Promise<CertificateResponse>
 */
export async function generateCourseCertificate(request: CertificateRequest): Promise<CertificateResponse> {
  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // Verify the user matches the request
    if (user.id !== request.userId) {
      return {
        success: false,
        error: 'Unauthorized: User ID mismatch'
      };
    }

    // Check if certificate already exists
    const existingCertificate = await getCertificate(request.userId, request.courseId);
    if (existingCertificate) {
      return {
        success: true,
        pdfUrl: existingCertificate
      };
    }

    // Generate certificate data
    const certificateData = {
      studentName: request.studentName,
      courseName: request.courseName,
      issueDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      certificateId: crypto.randomUUID()
    };

    // Generate the PDF
    const result = await generateCertificate(certificateData);
    if (!result.success || !result.pdfUrl) {
      return {
        success: false,
        error: result.error || 'Failed to generate certificate'
      };
    }

    // Save certificate record to database
    const saved = await saveCertificateRecord(
      request.userId,
      request.courseId,
      result.pdfUrl
    );

    if (!saved) {
      return {
        success: false,
        error: 'Failed to save certificate record'
      };
    }

    return {
      success: true,
      pdfUrl: result.pdfUrl
    };

  } catch (error) {
    console.error('Certificate generation service error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Gets a certificate for a specific course
 * @param courseId - Course ID
 * @returns Promise<CertificateResponse>
 */
export async function getCourseCertificate(courseId: string): Promise<CertificateResponse> {
  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    const pdfUrl = await getCertificate(user.id, courseId);
    if (!pdfUrl) {
      return {
        success: false,
        error: 'Certificate not found'
      };
    }

    return {
      success: true,
      pdfUrl
    };

  } catch (error) {
    console.error('Get certificate service error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Gets all certificates for the current user
 * @returns Promise<Array<{courseId: string, pdfUrl: string, issuedOn: string}>>
 */
export async function getAllUserCertificates() {
  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return [];
    }

    return await getUserCertificates(user.id);

  } catch (error) {
    console.error('Get user certificates service error:', error);
    return [];
  }
}

/**
 * Checks if a course is completed and eligible for certificate
 * @param courseId - Course ID
 * @returns Promise<boolean>
 */
export async function isCourseCompleted(courseId: string): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return false;
    }

    // Check enrollment and completion status
    const { data: enrollment, error } = await supabase
      .from('course_enrollments')
      .select('completed')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single();

    if (error || !enrollment) {
      return false;
    }

    return enrollment.completed;

  } catch (error) {
    console.error('Check course completion error:', error);
    return false;
  }
}
