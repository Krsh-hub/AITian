import { Link } from "react-router-dom";
import { useCourses } from "@/hooks/use-courses";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Tests = () => {
  const { data: courses, isLoading } = useCourses();

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Course Tests</h1>
          <p className="text-muted-foreground">Choose a course to take its test</p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map((i) => (
              <Card key={i} className="border-0 shadow-soft animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded w-2/3 mb-3" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses?.map((course) => (
              <Card key={course.id} className="border-0 shadow-soft">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">Category: {course.category} • Level: {course.level}</p>
                  <Link to={`/tests/${course.id}`}>
                    <Button className="bg-primary hover:bg-primary-hover">Start Test</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tests;


