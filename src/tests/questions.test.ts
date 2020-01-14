import { Question } from '../models/Question';
import supertest from 'supertest';
import app from '../app';

let cookie = '';
const email = 'federlizer@gmail.com';
const password = '@lokinSkywalker&5101';

const actualQuestion = {
  text: 'What testing library is being used for this project?',
  points: 3,
  subjectName: 'Programming',
  themeName: 'Testing',
  correctAnswers: ['Jest', 'Supertest'],
  incorrectAnswers: [
    'Mocha',
    'Chai',
    'Jester',
  ],
}

beforeAll(async () => {
  const res = await supertest(app)
    .post('/api/auth')
    .send({ email, password });

  expect(res.status).toBe(200);
  cookie = res.header['set-cookie'][0].split(';')[0];
});

describe('POST /api/question', () => {
  it('shouldn\'t create a question when text.length <= 2', async () => {
    const localQuestion = actualQuestion;

    const response = await supertest(app)
      .post('/api/question')
      .set('Cookie', cookie)
      .field('text', 'ab')
      .field('points', localQuestion.points)
      .field('subjectName', localQuestion.subjectName)
      .field('themeName', localQuestion.themeName)
      .field('correctAnswers', localQuestion.correctAnswers)
      .field('incorrectAnswers', localQuestion.incorrectAnswers)

    expect(response.status).toBe(400);
  });

  it('shouldn\'t create a question when text.length > 500', async () => {
    const localQuestion = actualQuestion;

    const response = await supertest(app)
      .post('/api/question')
      .set('Cookie', cookie)
      .field('text', 'a'.repeat(501))
      .field('points', localQuestion.points)
      .field('subjectName', localQuestion.subjectName)
      .field('themeName', localQuestion.themeName)
      .field('correctAnswers', localQuestion.correctAnswers)
      .field('incorrectAnswers', localQuestion.incorrectAnswers)

    expect(response.status).toBe(400);
  });

  it('shouldn\'t create a question when points < 1', async () => {
    const localQuestion = actualQuestion;

    const response = await supertest(app)
      .post('/api/question')
      .set('Cookie', cookie)
      .field('text', localQuestion.text)
      .field('points', 0)
      .field('subjectName', localQuestion.subjectName)
      .field('themeName', localQuestion.themeName)
      .field('correctAnswers', localQuestion.correctAnswers)
      .field('incorrectAnswers', localQuestion.incorrectAnswers)

    expect(response.status).toBe(400);
  });

  it('shouldn\'t create a question when points > 5', async () => {
    const localQuestion = actualQuestion;

    const response = await supertest(app)
      .post('/api/question')
      .set('Cookie', cookie)
      .field('text', localQuestion.text)
      .field('points', 6)
      .field('subjectName', localQuestion.subjectName)
      .field('themeName', localQuestion.themeName)
      .field('correctAnswers', localQuestion.correctAnswers)
      .field('incorrectAnswers', localQuestion.incorrectAnswers)

    expect(response.status).toBe(400);
  });

  it('shouldn\'t create a question when points isn\'t a number', async () => {
    const localQuestion = actualQuestion;

    const response = await supertest(app)
      .post('/api/question')
      .set('Cookie', cookie)
      .field('text', localQuestion.text)
      .field('points', 'im not a number')
      .field('subjectName', localQuestion.subjectName)
      .field('themeName', localQuestion.themeName)
      .field('correctAnswers', localQuestion.correctAnswers)
      .field('incorrectAnswers', localQuestion.incorrectAnswers)

    expect(response.status).toBe(400);
  });

  it('shouldn\'t create a question when subjectName.length === 0', async () => {
    const localQuestion = actualQuestion;

    const response = await supertest(app)
      .post('/api/question')
      .set('Cookie', cookie)
      .field('text', localQuestion.text)
      .field('points', localQuestion.points)
      .field('subjectName', '')
      .field('themeName', localQuestion.themeName)
      .field('correctAnswers', localQuestion.correctAnswers)
      .field('incorrectAnswers', localQuestion.incorrectAnswers)

    expect(response.status).toBe(400);
  });

  it('shouldn\'t create a question when themeName.length === 0', async () => {
    const localQuestion = actualQuestion;

    const response = await supertest(app)
      .post('/api/question')
      .set('Cookie', cookie)
      .field('text', localQuestion.text)
      .field('points', localQuestion.points)
      .field('subjectName', localQuestion.subjectName)
      .field('themeName', '')
      .field('correctAnswers', localQuestion.correctAnswers)
      .field('incorrectAnswers', localQuestion.incorrectAnswers)

    expect(response.status).toBe(400);
  });

  it('shouldn\'t create a question when correctAnswers ins\'t an array', async () => {
    const localQuestion = actualQuestion;

    const response = await supertest(app)
      .post('/api/question')
      .set('Cookie', cookie)
      .field('text', localQuestion.text)
      .field('points', localQuestion.points)
      .field('subjectName', localQuestion.subjectName)
      .field('themeName', localQuestion.themeName)
      .field('correctAnswers', 'one correct answer')
      .field('incorrectAnswers', localQuestion.incorrectAnswers)

    expect(response.status).toBe(400);
  });

  it('shouldn\'t create a question when correctAnswers.length === 0', async () => {
    const localQuestion = actualQuestion;

    const response = await supertest(app)
      .post('/api/question')
      .set('Cookie', cookie)
      .field('text', localQuestion.text)
      .field('points', localQuestion.points)
      .field('subjectName', localQuestion.subjectName)
      .field('themeName', localQuestion.themeName)
      .field('correctAnswers', [])
      .field('incorrectAnswers', localQuestion.incorrectAnswers)

    expect(response.status).toBe(400);
  });

  it('shouldn\'t create a question when correctAnswers\' elements.length === 0', async () => {
    const localQuestion = actualQuestion;

    const response = await supertest(app)
      .post('/api/question')
      .set('Cookie', cookie)
      .field('text', localQuestion.text)
      .field('points', localQuestion.points)
      .field('subjectName', localQuestion.subjectName)
      .field('themeName', localQuestion.themeName)
      .field('correctAnswers', [''])
      .field('incorrectAnswers', localQuestion.incorrectAnswers)

    expect(response.status).toBe(400);
  });

  it('shouldn\'t create a question when incorrectAnswers ins\'t an array', async () => {
    const localQuestion = actualQuestion;

    const response = await supertest(app)
      .post('/api/question')
      .set('Cookie', cookie)
      .field('text', localQuestion.text)
      .field('points', localQuestion.points)
      .field('subjectName', localQuestion.subjectName)
      .field('themeName', localQuestion.themeName)
      .field('correctAnswers', localQuestion.correctAnswers)
      .field('incorrectAnswers', 'im not an array')

    expect(response.status).toBe(400);
  });

  it('shouldn\'t create a question when incorrectAnswers.length < 0', async () => {
    const localQuestion = actualQuestion;

    const response = await supertest(app)
      .post('/api/question')
      .set('Cookie', cookie)
      .field('text', localQuestion.text)
      .field('points', localQuestion.points)
      .field('subjectName', localQuestion.subjectName)
      .field('themeName', localQuestion.themeName)
      .field('correctAnswers', localQuestion.correctAnswers)
      .field('incorrectAnswers', [])

    expect(response.status).toBe(400);
  });

  it('shouldn\'t create a question when incorrectAnswers\' elements.length === 0', async () => {
    const localQuestion = actualQuestion;

    const response = await supertest(app)
      .post('/api/question')
      .set('Cookie', cookie)
      .field('text', localQuestion.text)
      .field('points', localQuestion.points)
      .field('subjectName', localQuestion.subjectName)
      .field('themeName', localQuestion.themeName)
      .field('correctAnswers', localQuestion.correctAnswers)
      .field('incorrectAnswers', [''])

    expect(response.status).toBe(400);
  });

  it('should create a question when all inputs are correct', async () => {
    const questionData = actualQuestion;

    let response = await supertest(app)
      .post('/api/question')
      .set('Cookie', cookie)
      .field('text', questionData.text)
      .field('points', questionData.points)
      .field('subjectName', questionData.subjectName)
      .field('themeName', questionData.themeName)
      .field('correctAnswers', questionData.correctAnswers)
      .field('incorrectAnswers', questionData.incorrectAnswers)

    // did the request succeed?
    expect(response.status).toBe(200);

    // check the actual question that was supposedly inserted
    const { questionId } = response.body;
    response = await supertest(app)
      .get(`/api/question/${questionId}`)
      .set('Cookie', cookie)
      .send()

    expect(response.status).toBe(200);

    const question: Question = response.body;
    const correctAnswers = question.answers.filter((answer) => answer.correct);
    const incorrectAnswers = question.answers.filter((answer) => !answer.correct);

    expect(question.text).toBe(actualQuestion.text);
    expect(question.points).toBe(actualQuestion.points);
    expect(question.subject.name).toBe(actualQuestion.subjectName);

    expect(question.theme.name).toBe(actualQuestion.themeName);
    expect(question.theme.subject.name).toBe(actualQuestion.subjectName);

    actualQuestion.correctAnswers.forEach((answer) => {
      const isInsideAnswersArray = correctAnswers.find((a) => a.text === answer);
      expect(isInsideAnswersArray).toBeTruthy();
    });

    actualQuestion.incorrectAnswers.forEach((answer) => {
      const isInsideAnswersArray = incorrectAnswers.find((a) => a.text === answer);
      expect(isInsideAnswersArray).toBeTruthy();
    });
  });
});
