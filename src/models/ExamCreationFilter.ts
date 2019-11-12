import Subject from './Subject';
import ThemeFilter from './ThemeFilter';

interface ExamCreationFilter {
  subject: Subject;
  themeFilters: Array<ThemeFilter>;
}

export default ExamCreationFilter;
