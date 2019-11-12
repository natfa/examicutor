import express, { Request, Response, NextFunction } from 'express';

import { isAuthenticated } from '../middleware/isAuthenticated';
import shuffle from '../utils/shuffle';

import questiondb from '../db/questions';

import ExamCreationFilter from '../models/ExamCreationFilter';
import QuestionBase from '../models/QuestionBase';

const pointValues = [1, 2, 3, 4, 5];

const createNewExam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {
    name,
    startDate,
    endDate,
    timeToSolve,
    filters,
    boundaries,
  } = req.body;

  // get all questions for each theme filter
  let promises: Promise<QuestionBase[]>[] = [];
  filters.forEach((filter: ExamCreationFilter) => {
    filter.themeFilters.forEach((themeFilter) => {
      if (themeFilter.theme.id === null || themeFilter.theme.id === undefined) return;

      promises = [...promises, questiondb.getManyByThemeId(themeFilter.theme.id)];
    });
  });

  const allQuestions: QuestionBase[] = (await Promise.all(promises)).flat();

  // compile questions for exam
  let questions: QuestionBase[] = [];
  for (let i = 0; i < filters.length; i += 1) {
    const filter = filters[i];
    for (let j = 0; j < filter.themeFilters.length; j += 1) {
      const themeFilter = filter.themeFilters[j];
      const themeQuestions = allQuestions
        .filter((q) => q.theme.id === themeFilter.theme.id);

      let questionsToGoIn: QuestionBase[] = [];

      for (let k = 0; k < pointValues.length; k += 1) {
        const pointValue = pointValues[k];
        if (themeFilter[pointValue] !== 0) {
          const pointValueQuestions = themeQuestions.filter((q) => q.points === pointValue);
          if (themeFilter[pointValue] > pointValueQuestions.length) {
            res.status(400).json({
              error: 'Not enough questions inserted for the specified requirements to be fullfiled',
            });
            return;
          }

          const shuffledQuestions = shuffle(pointValueQuestions);
          questionsToGoIn = [...questionsToGoIn, ...shuffledQuestions.slice(0, themeFilter[pointValue])];
        }
      }

      questions = [...questions, ...questionsToGoIn];
    }
  }

  if (req.session === undefined) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const exam = {
    name,
    startDate,
    endDate,
    timeToSolve,
    questions,
    creator: req.session.account.id,
  };

  res.status(200).json(exam);
};

const router = express.Router();

router.use(isAuthenticated);

router.post('/', createNewExam);

export default router;
