# CourseCraft Setup Instructions

## Database Setup

### 1. Run Database Migrations

First, you need to set up the database tables. You can do this in two ways:

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/001_create_courses_table.sql`
4. Run the migration

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref hnihvpuoopnaprofufrp

# Run migrations
supabase db push
```

### 2. Seed the Database

After running the migrations, seed the database with initial data:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/seed.sql`
4. Run the seed script

## Getting Admin Access

### Method 1: Direct Database Update (Quick)

1. Sign up normally through the application
2. Go to your Supabase project dashboard
3. Navigate to the Table Editor
4. Find the `user_profiles` table
5. Find your user record (you can identify it by your email)
6. Update the `role` field from `student` to `admin`

### Method 2: Using SQL Query

1. Sign up normally through the application
2. Go to your Supabase project dashboard
3. Navigate to the SQL Editor
4. Run this query (replace `your-email@example.com` with your actual email):

```sql
UPDATE public.user_profiles 
SET role = 'admin' 
WHERE id = (
    SELECT id FROM auth.users 
    WHERE email = 'your-email@example.com'
);
```

## Features Implemented

### ✅ Authentication System
- User registration and login
- Email/password authentication
- Session management
- Protected routes

### ✅ Real Database Integration
- Supabase database with proper schema
- Row Level Security (RLS) policies
- Real-time data fetching with React Query
- Course management (CRUD operations)

### ✅ Admin Dashboard
- Course management (view, edit, delete)
- User management (view, update roles)
- Analytics dashboard
- Admin-only access control

### ✅ Course Management
- View all courses
- Search and filter courses
- Course details with full information
- Featured courses display

### ✅ User Management
- User profiles
- Role-based access control
- Course enrollments
- Progress tracking

## Database Schema

### Tables Created

1. **courses** - Stores all course information
2. **user_profiles** - Extended user information and roles
3. **course_enrollments** - Tracks user course enrollments

### Security Features

- Row Level Security (RLS) enabled on all tables
- Admin-only access for course management
- Users can only access their own data
- Proper authentication checks

## API Endpoints

The application uses Supabase's built-in API with the following operations:

### Courses
- `GET /courses` - Get all active courses
- `GET /courses?featured=true` - Get featured courses
- `GET /courses/:id` - Get specific course
- `POST /courses` - Create new course (admin only)
- `PUT /courses/:id` - Update course (admin only)
- `DELETE /courses/:id` - Delete course (admin only)

### Users
- `GET /user_profiles` - Get current user profile
- `PUT /user_profiles` - Update user profile
- `GET /user_profiles` - Get all users (admin only)
- `PUT /user_profiles/:id` - Update user role (admin only)

### Enrollments
- `GET /course_enrollments` - Get user enrollments
- `POST /course_enrollments` - Enroll in course
- `PUT /course_enrollments` - Update progress

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npx tsc --noEmit
```

## Environment Variables

Make sure your Supabase configuration is properly set up in `src/integrations/supabase/client.ts`:

```typescript
const SUPABASE_URL = "https://hnihvpuoopnaprofufrp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "your-anon-key";
```

## Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check if Supabase project is active
   - Verify API keys are correct
   - Ensure email confirmation is enabled in Supabase Auth settings

2. **Database errors**
   - Run migrations again
   - Check RLS policies
   - Verify table structure matches the schema

3. **Admin access not working**
   - Verify user role is set to 'admin' in database
   - Check if user profile was created properly
   - Clear browser cache and try again

### Getting Help

If you encounter any issues:

1. Check the browser console for errors
2. Verify Supabase project settings
3. Check the network tab for failed API calls
4. Ensure all dependencies are installed correctly

## Next Steps

After setting up the database and getting admin access, you can:

1. **Add more courses** through the admin dashboard
2. **Customize the UI** by modifying components
3. **Add more features** like:
   - Course reviews and ratings
   - Payment integration
   - Video content management
   - Advanced analytics
   - Email notifications

## Security Notes

- All database operations are protected by RLS policies
- Admin functions require proper authentication
- User data is isolated by user ID
- Sensitive operations are logged
- API keys should be kept secure

Remember to never commit sensitive information like API keys to version control!
