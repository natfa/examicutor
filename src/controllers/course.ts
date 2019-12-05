import { Course } from '../models/Course';

import coursesDB from '../db/courses';

async function getAllCourses(): Promise<Course[]> {
  return coursesDB.getAllCourses();
}

export default {
  getAllCourses,
};
