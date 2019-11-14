import dayjs from 'dayjs';
import query from './index';

import { QuestionBase } from '../models/QuestionBase';
import { Exam } from '../models/Exam';
import { OkPacket } from './OkPacket';

function saveOne(exam: Exam): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const timeToSolve = dayjs()
      .hour(exam.timeToSolve.hours)
      .minute(exam.timeToSolve.minutes)
      .second(0)
      .millisecond(0);

    query({
      sql: `insert into exams
      (name, startdate, enddate, timetosolve, creatorid) values
      (?, ?, ?, ?, ?)`,
      values: [
        exam.name,
        // we must use std Date objects so that the mysql lib can parse correctly
        new Date(exam.startDate.toString()),
        new Date(exam.endDate.toString()),
        new Date(timeToSolve.toString()),
        1,
      ],
    }).then((result: OkPacket) => {
      const examId = result.insertId;

      const examQuestionsInserts = exam.questions.map((question: QuestionBase) => {
        const promise = query({
          sql: `insert into exam_questions
          (examid, questionid) values
          (?, ?)`,
          values: [examId, question.id],
        });

        return promise;
      });

      Promise.all(examQuestionsInserts).then(() => resolve(String(examId)));
    }).catch((err) => {
      reject(err);
    });
  });
}

export default {
  saveOne,
};
