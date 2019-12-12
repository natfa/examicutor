import studentDB from '../db/students';

async function getStudentId(accountId: string): Promise<string|null> {
  const studentId = await studentDB.getStudentId(accountId);

  return studentId;
}

export default {
  getStudentId,
};
