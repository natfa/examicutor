import { Request, Response, NextFunction } from 'express';

import { db } from '../../models';

async function getQuestions(_: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const questions = await db.Question.findAll();
    res.status(200).json(questions);
  } catch (err) {
    next(err);
  }
}


async function getQuestionById(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.params;

  try {
    const question = await db.Question.findByPk(id);

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
    moduleName,
    themeName,
  } = req.body;

  const [module] = await db.Module.findOrCreate({ where: { name: moduleName }});
  const [theme] = await db.Theme.findOrCreate({ where: { name: themeName, moduleId: module.id }});

  const question = await db.Question.create({
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
    moduleName,
    themeName,
  } = req.body;

  let question = await db.Question.findByPk(id);

  if (question === null) {
    res.status(404).send('Not found').end();
    return;
  }

  const [module] = await db.Module.findOrCreate({ where: { name: moduleName }});
  const [theme] = await db.Theme.findOrCreate({ where: { name: themeName, moduleId: module.id }});

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
    const deleted = await db.Question.destroy({ where: { id: id }});

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
