import { Connection } from 'mysql';
import { pool } from './index';

import { Course } from '../models/Course';

interface CoursesRowDataPacket {
  id: number;
  name: string;
}

function buildCourse(dataPacket: CoursesRowDataPacket): Course {
  return {
    id: String(dataPacket.id),
    name: dataPacket.name,
  };
}

function getAllCourses(): Promise<Course[]> {
  return new Promise<Course[]>((resolve, reject) => {
    pool.getConnection((connectionError: Error, connection: Connection) => {
      if (connectionError) {
        reject(connectionError);
        return;
      }

      const sql = 'select * from courses';

      connection.query(sql, (queryError: Error, results: CoursesRowDataPacket[]) => {
        if (queryError) {
          reject(queryError);
          return;
        }

        const courses = results.map((result) => buildCourse(result));

        resolve(courses);
      });
    });
  });
}

export default {
  getAllCourses,
};
