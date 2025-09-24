import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2, CheckCircle } from 'lucide-react';
import { generateCourseCertificate, getCourseCertificate } from '@/services/certificateService';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface CertificateButtonProps {
  courseId: string;
  courseName: string;
  isCompleted: boolean;
  className?: string;
}

export default function CertificateButton({ 
  courseId, 
  courseName, 
  isCompleted, 
  className = '' 
}: CertificateButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);

  const handleCertificateAction = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to download your certificate.",
        variant: "destructive",
      });
      return;
    }

    if (!isCompleted) {
      toast({
        title: "Course Not Completed",
        description: "Please complete the course and pass the test to unlock your certificate.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // First, check if certificate already exists
      const existingCert = await getCourseCertificate(courseId);
      
      if (existingCert.success && existingCert.pdfUrl) {
        // Certificate exists, open it
        window.open(existingCert.pdfUrl, '_blank');
        setCertificateUrl(existingCert.pdfUrl);
        toast({
          title: "Certificate Opened",
          description: "Your certificate has been opened in a new tab.",
        });
      } else {
        // Generate new certificate
        const result = await generateCourseCertificate({
          userId: user.id,
          courseId,
          studentName: user.user_metadata?.full_name || user.email || 'Student',
          courseName,
        });

        if (result.success && result.pdfUrl) {
          // Open the generated certificate
          window.open(result.pdfUrl, '_blank');
          setCertificateUrl(result.pdfUrl);
          toast({
            title: "Certificate Generated",
            description: "Your certificate has been generated and opened in a new tab.",
          });
        } else {
          toast({
            title: "Certificate Generation Failed",
            description: result.error || "Failed to generate certificate. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Certificate error:', error);
      toast({
        title: "Error",
        description: "An error occurred while processing your certificate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      className={`w-full ${className}`}
      onClick={handleCertificateAction}
      disabled={!isCompleted || isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : certificateUrl ? (
        <>
          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
          View Certificate
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          {isCompleted ? 'Download Certificate' : 'Certificate Locked'}
        </>
      )}
    </Button>
  );
}
