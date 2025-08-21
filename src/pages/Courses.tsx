import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { useCourses, useSearchCourses, useCoursesByCategory, useCoursesByLevel } from "@/hooks/use-courses";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const { data: allCourses, isLoading } = useCourses();
  const { data: searchResults } = useSearchCourses(searchTerm);
  const { data: categoryResults } = useCoursesByCategory(selectedCategory !== "all" ? selectedCategory : "");
  const { data: levelResults } = useCoursesByLevel(selectedLevel !== "all" ? selectedLevel : "");

  // Get unique categories and levels from all courses
  const categories = ["all", ...Array.from(new Set(allCourses?.map(course => course.category) || []))];
  const levels = ["all", "Beginner", "Intermediate", "Advanced"];

  // Determine which data to show based on filters
  let filteredCourses = allCourses || [];
  
  if (searchTerm && searchResults) {
    filteredCourses = searchResults;
  } else if (selectedCategory !== "all" && categoryResults) {
    filteredCourses = categoryResults;
  } else if (selectedLevel !== "all" && levelResults) {
    filteredCourses = levelResults;
  }

  // Apply additional filters if needed
  if (searchTerm && selectedCategory !== "all") {
    filteredCourses = filteredCourses.filter(course => course.category === selectedCategory);
  }
  if (searchTerm && selectedLevel !== "all") {
    filteredCourses = filteredCourses.filter(course => course.level === selectedLevel);
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            All Courses
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive collection of courses designed to advance your career in technology
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl p-6 shadow-soft mb-12">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-input"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level === "all" ? "All Levels" : level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center text-sm text-muted-foreground">
              <Filter className="h-4 w-4 mr-2" />
              Showing {filteredCourses.length} of {(allCourses?.length ?? 0)} courses
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedLevel("all");
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Course Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-64 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">No courses found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or browse all available courses
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedLevel("all");
                }}
                className="bg-primary hover:bg-primary-hover"
              >
                View All Courses
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;