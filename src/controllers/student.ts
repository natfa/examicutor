import studentdb from '../db/students';

import { Student } from '../models/Student';

async function getStudentById(id: string): Promise<Student|null> {
  const student = await studentdb.getStudentById(id);

  return student;
}

async function getStudentByAccountId(accountId: string): Promise<Student|null> {
  const student = await studentdb.getStudentByAccountId(accountId);

  return student;
}

export default {
  getStudentById,
  getStudentByAccountId,
};
