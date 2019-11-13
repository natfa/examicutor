import { Subject } from './Subject';
import { ThemeFilter } from './ThemeFilter';

export interface ExamCreationFilter {
  subject: Subject;
  themeFilters: ThemeFilter[];
}
