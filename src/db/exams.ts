import query from './index';

import { QuestionBase } from '../models/QuestionBase';
import { Exam } from '../models/Exam';
import { OkPacket } from './OkPacket';

function saveOne(exam: Exam): Promise<Exam> {
  return new Promise<Exam>((resolve, reject) => {
    // convert our Time object to a MySQL compatible Date object
    const timeToSolve = new Date(Date.now());
    // reset seconds and mseconds, otherwise when inserting
    // mysql will round up/down (minutes might increase by 1)
    timeToSolve.setHours(exam.timeToSolve.hours, exam.timeToSolve.minutes, 0, 0);

    query({
      sql: `insert into exams
      (name, startdate, enddate, timetosolve, creatorid) values
      (?, ?, ?, ?, ?)`,
      values: [
        exam.name,
        exam.startDate,
        exam.endDate,
        timeToSolve,
        1,
      ],
    }).then((result: OkPacket) => {
      const newExam: Exam = {
        id: String(result.insertId),
        name: exam.name,
        startDate: exam.startDate,
        endDate: exam.endDate,
        timeToSolve: exam.timeToSolve,
        creator: exam.creator,
        questions: exam.questions,
      };

      const examQuestionsInserts = newExam.questions.map((question: QuestionBase) => {
        const promise = query({
          sql: `insert into exam_questions
          (examid, questionid) values
          (?, ?)`,
          values: [newExam.id, question.id],
        });

        return promise;
      });

      Promise.all(examQuestionsInserts).then(() => resolve(newExam));
    }).catch((err) => {
      reject(err);
    });
  });
}

export default {
  saveOne,
};
