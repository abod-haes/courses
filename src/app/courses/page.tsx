import { CoursesLibrary } from "@/features/courses/components/courses-library.component";
import { getCourses, getCoursesPageCopy } from "@/features/courses/courses.data";

export default function Page() {
  return <CoursesLibrary copy={getCoursesPageCopy("en")} courses={getCourses("en")} />;
}
