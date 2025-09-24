import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { supabase } from '@/integrations/supabase/client';

export interface CertificateData {
  studentName: string;
  courseName: string;
  issueDate: string;
  certificateId: string;
}

export interface CertificateGenerationResult {
  success: boolean;
  pdfUrl?: string;
  error?: string;
}

/**
 * Generates a certificate PDF with the provided data
 * @param data - Certificate data to inject into the template
 * @returns Promise<CertificateGenerationResult>
 */
export async function generateCertificate(data: CertificateData): Promise<CertificateGenerationResult> {
  try {
    // Load the certificate template
    const templateResponse = await fetch('/certificate_template.pdf');
    if (!templateResponse.ok) {
      throw new Error('Failed to load certificate template');
    }
    
    const templateBytes = await templateResponse.arrayBuffer();
    const pdfDoc = await PDFDocument.load(templateBytes);
    
    // Get the first page
    const pages = pdfDoc.getPages();
    const page = pages[0];
    const { width, height } = page.getSize();
    
    // Get fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Clear existing content and add new content
    page.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: height,
      color: rgb(1, 1, 1), // White background
    });
    
    // Title
    page.drawText('CERTIFICATE OF COMPLETION', {
      x: 50,
      y: height - 100,
      size: 24,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    
    // Subtitle
    page.drawText('This is to certify that', {
      x: 50,
      y: height - 150,
      size: 16,
      font: font,
      color: rgb(0, 0, 0),
    });
    
    // Student name
    page.drawText(data.studentName, {
      x: 50,
      y: height - 200,
      size: 20,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    
    // Course completion text
    page.drawText('has successfully completed the course', {
      x: 50,
      y: height - 240,
      size: 16,
      font: font,
      color: rgb(0, 0, 0),
    });
    
    // Course name
    page.drawText(data.courseName, {
      x: 50,
      y: height - 280,
      size: 18,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    
    // Issue date
    page.drawText(`Issued on: ${data.issueDate}`, {
      x: 50,
      y: height - 330,
      size: 14,
      font: font,
      color: rgb(0, 0, 0),
    });
    
    // Certificate ID
    page.drawText(`Certificate ID: ${data.certificateId}`, {
      x: 50,
      y: height - 360,
      size: 12,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    // Add a decorative border
    page.drawRectangle({
      x: 30,
      y: 30,
      width: width - 60,
      height: height - 60,
      borderColor: rgb(0, 0, 0),
      borderWidth: 2,
    });
    
    // Generate the PDF bytes
    const pdfBytes = await pdfDoc.save();
    
    // Upload to Supabase Storage
    const fileName = `certificate_${data.certificateId}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(fileName, pdfBytes, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      throw new Error(`Failed to upload certificate: ${uploadError.message}`);
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('certificates')
      .getPublicUrl(fileName);
    
    return {
      success: true,
      pdfUrl: urlData.publicUrl
    };
    
  } catch (error) {
    console.error('Certificate generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Creates a certificate record in the database
 * @param userId - User ID
 * @param courseId - Course ID
 * @param pdfUrl - URL of the generated PDF
 * @returns Promise<boolean>
 */
export async function saveCertificateRecord(
  userId: string,
  courseId: string,
  pdfUrl: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('certificates')
      .insert({
        user_id: userId,
        course_id: courseId,
        pdf_url: pdfUrl
      });
    
    if (error) {
      console.error('Failed to save certificate record:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving certificate record:', error);
    return false;
  }
}

/**
 * Gets certificate for a user and course
 * @param userId - User ID
 * @param courseId - Course ID
 * @returns Promise<string | null> - PDF URL or null if not found
 */
export async function getCertificate(userId: string, courseId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('pdf_url')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return data.pdf_url;
  } catch (error) {
    console.error('Error fetching certificate:', error);
    return null;
  }
}

/**
 * Gets all certificates for a user
 * @param userId - User ID
 * @returns Promise<Array<{courseId: string, pdfUrl: string, issuedOn: string}>>
 */
export async function getUserCertificates(userId: string) {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('course_id, pdf_url, issued_on')
      .eq('user_id', userId)
      .order('issued_on', { ascending: false });
    
    if (error) {
      console.error('Error fetching user certificates:', error);
      return [];
    }
    
    return data.map(cert => ({
      courseId: cert.course_id,
      pdfUrl: cert.pdf_url,
      issuedOn: cert.issued_on
    }));
  } catch (error) {
    console.error('Error fetching user certificates:', error);
    return [];
  }
}
