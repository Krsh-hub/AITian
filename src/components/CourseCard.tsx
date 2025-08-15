import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, Clock, TrendingUp } from "lucide-react";
import { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:bg-card-hover border-0 shadow-medium">
      <CardHeader className="p-0 relative">
        <div className="relative overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {course.featured && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center text-white text-sm">
              <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
              <span className="mr-3">{course.rating}</span>
              <Users className="h-4 w-4 mr-1" />
              <span>{course.studentsEnrolled.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {course.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {course.level}
            </Badge>
          </div>
          
          <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
            {course.title}
          </h3>
          
          <p className="text-muted-foreground text-sm line-clamp-2">
            {course.shortDescription}
          </p>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>{course.duration}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-accent">₹{course.price.toLocaleString()}</span>
            {course.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">₹{course.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Link to={`/course/${course.id}`} className="w-full">
          <Button className="w-full bg-primary hover:bg-primary-hover transition-colors">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;