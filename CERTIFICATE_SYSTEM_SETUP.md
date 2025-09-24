# Certificate System Setup Guide

This guide will help you set up the certificate system for your ed-tech platform. The system allows students to download certificates after completing courses and passing tests.

## 🚀 Features

- **Dynamic Certificate Generation**: Creates PDF certificates with student name, course name, issue date, and unique certificate ID
- **Database Integration**: Stores certificate records in Supabase with proper RLS policies
- **Storage Management**: Uploads generated PDFs to Supabase Storage
- **Frontend Integration**: Download buttons in course details and certificate management in dashboard
- **Course Completion Tracking**: Only allows certificate generation for completed courses

## 📋 Prerequisites

1. **Supabase Project**: Ensure your Supabase project is set up and running
2. **Node.js**: Version 16 or higher
3. **Package Manager**: npm, yarn, or bun

## 🛠️ Installation Steps

### 1. Install Dependencies

```bash
npm install pdf-lib
# or
yarn add pdf-lib
# or
bun add pdf-lib
```

### 2. Database Setup

Run the following migrations in your Supabase project:

```sql
-- Run migration 008_certificates.sql
-- Run migration 009_certificates_storage.sql
```

Or apply them through the Supabase dashboard:
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the contents of `supabase/migrations/008_certificates.sql`
4. Run the contents of `supabase/migrations/009_certificates_storage.sql`

### 3. Storage Bucket Setup

The storage bucket will be created automatically by the migration, but you can verify it exists:

1. Go to Storage in your Supabase dashboard
2. Ensure the `certificates` bucket exists and is public
3. Verify the storage policies are applied correctly

### 4. Certificate Template

Replace the placeholder certificate template:

1. **Current**: `public/certificate_template.pdf` (placeholder)
2. **Replace with**: Your Canva-designed certificate template
3. **Requirements**: 
   - Must be a valid PDF
   - Should have space for dynamic content injection
   - Recommended size: A4 (8.5" x 11")

### 5. Environment Variables

Ensure your Supabase environment variables are properly configured in your `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📁 File Structure

The certificate system adds the following files:

```
src/
├── lib/
│   └── certificate.ts              # Core certificate generation logic
├── services/
│   └── certificateService.ts       # API service functions
├── components/
│   └── CertificateButton.tsx       # Reusable certificate download button
├── hooks/
│   └── use-certificate.ts          # React hooks for certificate state
└── pages/
    ├── CourseDetail.tsx            # Updated with certificate button
    └── Dashboard.tsx               # Updated with certificates section

supabase/migrations/
├── 008_certificates.sql            # Certificates table and policies
└── 009_certificates_storage.sql    # Storage bucket and policies

public/
└── certificate_template.pdf        # Certificate template (replace with your design)
```

## 🔧 Configuration

### Certificate Template Customization

The certificate generation utility (`src/lib/certificate.ts`) injects the following data:

- **Student Name**: From user profile or email
- **Course Name**: From course data
- **Issue Date**: Current date in readable format
- **Certificate ID**: Unique UUID

To customize the template layout, modify the positioning and styling in the `generateCertificate` function.

### Database Schema

The `certificates` table structure:

```sql
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  issued_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  pdf_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);
```

## 🎯 Usage

### For Students

1. **Complete a Course**: Finish all course content and pass the test
2. **Download Certificate**: Click the "Download Certificate" button in course details
3. **View Certificates**: Access all certificates from the dashboard

### For Developers

#### Generate Certificate Programmatically

```typescript
import { generateCourseCertificate } from '@/services/certificateService';

const result = await generateCourseCertificate({
  userId: 'user-id',
  courseId: 'course-id',
  studentName: 'John Doe',
  courseName: 'React Fundamentals'
});

if (result.success) {
  console.log('Certificate URL:', result.pdfUrl);
}
```

#### Check Course Completion

```typescript
import { isCourseCompleted } from '@/services/certificateService';

const completed = await isCourseCompleted('course-id');
```

#### Get User Certificates

```typescript
import { getAllUserCertificates } from '@/services/certificateService';

const certificates = await getAllUserCertificates();
```

## 🔒 Security Features

- **Row Level Security (RLS)**: Users can only access their own certificates
- **Admin Access**: Admins can view all certificates
- **Authentication Required**: Certificate generation requires user authentication
- **Course Completion Check**: Only completed courses can generate certificates
- **Unique Certificates**: One certificate per user per course

## 🐛 Troubleshooting

### Common Issues

1. **Certificate Generation Fails**
   - Check if the certificate template PDF is valid
   - Verify Supabase Storage bucket exists and is public
   - Ensure user has completed the course

2. **Storage Upload Errors**
   - Verify storage policies are correctly applied
   - Check if the user is authenticated
   - Ensure the certificates bucket exists

3. **PDF Not Opening**
   - Check if the PDF URL is accessible
   - Verify the file was uploaded successfully
   - Check browser console for CORS errors

### Debug Steps

1. Check browser console for errors
2. Verify Supabase logs for database/storage errors
3. Test certificate generation with a simple course
4. Verify all environment variables are set correctly

## 🚀 Testing

### Manual Testing

1. **Complete a Course**:
   - Enroll in a course
   - Mark it as completed (or pass the test)
   - Try to generate a certificate

2. **Certificate Generation**:
   - Click the certificate button
   - Verify PDF opens in new tab
   - Check certificate content is correct

3. **Dashboard Integration**:
   - View certificates in dashboard
   - Test download functionality
   - Verify certificate count updates

### Automated Testing

You can add unit tests for the certificate functions:

```typescript
// Example test
import { generateCertificate } from '@/lib/certificate';

test('generates certificate with correct data', async () => {
  const data = {
    studentName: 'Test User',
    courseName: 'Test Course',
    issueDate: 'January 1, 2024',
    certificateId: 'test-id'
  };
  
  const result = await generateCertificate(data);
  expect(result.success).toBe(true);
  expect(result.pdfUrl).toBeDefined();
});
```

## 📈 Future Enhancements

- **Certificate Templates**: Multiple template options
- **Digital Signatures**: Add digital signatures to certificates
- **Certificate Verification**: Public verification system
- **Email Integration**: Send certificates via email
- **Batch Generation**: Generate multiple certificates at once
- **Custom Branding**: Institution-specific certificate designs

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the Supabase logs
3. Verify all migrations are applied correctly
4. Ensure the certificate template is valid

## 🎉 Conclusion

The certificate system is now fully integrated into your ed-tech platform! Students can earn and download certificates for completed courses, and you have a robust system for managing certificate generation and storage.

Remember to replace the placeholder certificate template with your Canva-designed template for the best results.
