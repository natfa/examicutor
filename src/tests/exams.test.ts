/*
 * I am so sorry for whoever has to deal with this test, it is so badly written. That actually stands true for all tests written at this time...
 * Please don't be too mad :D
 * I wish you all the best of luck
 */
import dayjs from 'dayjs';
import supertest from 'supertest';

import { pool } from '../db';
import app from '../app';
import testData from './data';

// data types
import { Exam } from '../models/Exam';
import { Subject } from '../models/Subject';
import { Theme } from '../models/Theme';
import { Specialty } from '../models/Specialty';

let cookie = '';

beforeAll(async () => {
  const res = await supertest(app)
    .post('/api/auth')
    .set('Content-Type', 'application/json')
    .send({
      email: testData.email,
      password: testData.password,
    });

    expect(res.status).toBe(200);
    cookie = res.header['set-cookie'][0].split(';')[0];
});

/*
 * Although there is still something hanging after all tests have completed
 * which I haven't quite been able to figure out, this is still nessesary,
 * because the pool is never closed (since graceful shutdown is handled by the index.ts file)
 */
afterAll(async (done) => {
  pool.end((err) => {
    if (err) {
      done(err);
    }

    done();
  });
});


describe('POST /api/exam', () => {
  it('should create an exam', async () => {
    const request = supertest(app);

    const questions = [
      {
        text: '1 + 1',
        points: 2,
        subjectName: 'Math',
        themeName: 'Algebra',
        correctAnswers: ['2'],
        incorrectAnswers: ['11', '22', '33'],
      },
      {
        text: '10 + 10',
        points: 2,
        subjectName: 'Math',
        themeName: 'Algebra',
        correctAnswers: ['20'],
        incorrectAnswers: ['1010', '1100', '33'],
      },
      {
        text: 'What is the figure?',
        points: 2,
        subjectName: 'Math',
        themeName: 'Geometry',
        correctAnswers: ['triangle'],
        incorrectAnswers: ['circle', 'square', 'line'],
      },
      {
        text: 'What is the figure?',
        points: 2,
        subjectName: 'Math',
        themeName: 'Geometry',
        correctAnswers: ['another triangle'],
        incorrectAnswers: ['circle', 'square', 'line'],
      },
    ];

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      const response = await request
        .post('/api/question')
        .set('Cookie', cookie)
        .field('text', question.text)
        .field('points', question.points)
        .field('subjectName', question.subjectName)
        .field('themeName', question.themeName)
        .field('correctAnswers[]', question.correctAnswers)
        .field('incorrectAnswers[]', question.incorrectAnswers);

        expect(response.status).toBe(200);
    }

    // get subject
    const subjectsResponse = await request
      .get('/api/subject/')
      .set('Cookie', cookie)
      .send();
    expect(subjectsResponse.status).toBe(200);
    const subjects = subjectsResponse.body;
    const mathSubject = subjects.find((s: Subject) => s.name = 'Math');


    // get themes
    const themesResponse = await request
      .get(`/api/theme/${mathSubject.id}`)
      .set('Cookie', cookie)
      .send();
    expect(themesResponse.status).toBe(200);
    const themes = themesResponse.body;
    const algebraTheme = themes.find((t: Theme) => t.name = 'Algebra');
    const geometryTheme = themes.find((t: Theme) => t.name = 'Geometry');

    // specialties
    const specialtiesResponse = await request
      .get('/api/specialty/')
      .send();

    expect(specialtiesResponse.status).toBe(200);
    const specialties = specialtiesResponse.body;

    const computerScienceSpecialty = specialties.find((s: Specialty) => s.name = 'Computer Science');

    // actual exam creation
    const examCreationResponse = await request
      .post('/api/exam')
      .set('Cookie', cookie)
      .set('Content-Type', 'application/json')
      .send({
        name: 'Some exam name',
        startDate: dayjs().add(1, 'hour'),
        endDate: dayjs().add(2, 'hour'),
        timeToSolve: { hours: 1, minutes: 0 },
        filters: [{
          subject: { ...mathSubject },
          themeFilters: [
            {
              theme: { ...algebraTheme },
              1: 0, 2: 2, 3: 0, 4: 0, 5: 0,
            },
            {
              theme: { ...geometryTheme },
              1: 0, 2: 2, 3: 0, 4: 0, 5: 0,
            },
          ],
        }],
        boundaries: [{
          specialty: { ...computerScienceSpecialty },
          3: 2, 4: 4, 5: 6, 6: 8,
        }],
      });

    expect(examCreationResponse.status).toBe(200);
    const { examId } = examCreationResponse.body;

    const examResponse = await request
      .get(`/api/exam/${examId}`)
      .set('Cookie', cookie)
      .send();

    expect(examResponse.status).toBe(200);

    const exam: Exam = examResponse.body;

    expect(exam).toHaveProperty('id');
    expect(exam).toHaveProperty('name');
    expect(exam.questions).toBeInstanceOf(Array);

    expect(exam.name).toBe('Some exam name');
    //expect(exam.questions.length).toBe(questions.length);
  });
});
