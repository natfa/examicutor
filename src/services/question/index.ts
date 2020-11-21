import { Request, Response, NextFunction } from 'express';

import { Subject } from '../../models/Subject';
import { Theme } from '../../models/Theme';
import { Question } from '../../models/Question';

async function getQuestions(_: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const questions = await Question.findAll();
    res.status(200).json(questions);
  } catch (err) {
    next(err);
  }
}


async function getQuestionById(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;

  try {
    const question = await Question.findByPk(id);

    if (question === null) {
      res.status(404).end();
      return;
    }
    res.status(200).json(question);
  } catch (err) {
    next(err);
  }
};

async function createQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
  const {
    text,
    points,
    answers,
    subjectName,
    themeName,
  } = req.body;

  const [subject] = await Subject.findOrCreate({ where: { name: subjectName }});
  const [theme] = await Theme.findOrCreate({ where: { name: themeName, subjectId: subject.id }});

  const question = await Question.create({
    text: text,
    points: points,
    answers: answers,
    themeId: theme.id,
  });

  res.status(200).json(question.toJSON());
};

async function updateQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
  const {
    id,
    text,
    points,
    answers,
    subjectName,
    themeName,
  } = req.body;

  let question = await Question.findByPk(id);

  if (question === null) {
    res.status(404).send('Not found').end();
    return;
  }

  const [subject] = await Subject.findOrCreate({ where: { name: subjectName }});
  const [theme] = await Theme.findOrCreate({ where: { name: themeName, subjectId: subject.id }});

  question = await question.update({
    text: text,
    points: points,
    answers: answers,
    themeId: theme.id,
  });

  res.status(200).json(question.toJSON()).end();
};

async function deleteQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;
  try {
    const deleted = await Question.destroy({ where: { id: id }});

    if (deleted === 0) {
      res.status(404).end();
      return;
    }

    if (deleted > 1) {
      res.status(500).end();
      console.log('Deleted more than one instance when deleting by ID');
      return;
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export default {
  getQuestions,
  getQuestionById,

  createQuestion,
  updateQuestion,

  deleteQuestion,
};
