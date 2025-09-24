export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  price: number;
  originalPrice?: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  instructor: {
    name: string;
    bio: string;
    image: string;
    experience: string;
  };
  syllabus: {
    module: string;
    topics: string[];
  }[];
  perks: string[];
  studentsEnrolled: number;
  rating: number;
  featured: boolean;
  whatsappGroupLink?: string;
  resources?: {
    title: string;
    downloadLink: string;
  }[];
}



export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  targetAudience: string;
  duration: string;
  priceRange: string;
  image: string;
}