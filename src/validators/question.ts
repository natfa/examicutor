import { Request, Response, NextFunction } from 'express';

interface ValidatorReturnValue {
  isValid: boolean;
  value: any;
}


export const validatePOST = (req: Request, res: Response, next: NextFunction) => {
  let errors = {};
  const { text, incorrectAnswers, correctAnswers, points } = req.body;

  if (text === undefined){
    errors = Object.assign({}, errors, { text: `Required` });
  } else {
    const { isValid, value } = validateText(text);
    if (!isValid)
      errors = Object.assign({}, errors, value);
  }

  if (incorrectAnswers === undefined) {
    errors = Object.assign({}, errors, { incorrectAnswers: `Required` });
  } else {
    const { isValid, value } = validateAnswers(incorrectAnswers);
    if (!isValid)
      errors = Object.assign({}, errors, value);
  }

  if (correctAnswers === undefined) {
    errors = Object.assign({}, errors, { correctAnswers: `Required` });
  } else {
    const { isValid, value } = validateAnswers(correctAnswers);
    if (!isValid)
      errors = Object.assign({}, errors, value);
  }

  if (points === undefined) {
    errors = Object.assign({}, errors, { points: `Required` });
  } else {
    const { isValid, value } = validatePoints(points);
    if (!isValid)
      errors = Object.assign({}, errors, value);
  }

  if (Object.keys(errors).length > 0)
    return res.status(400).send(errors);
  return next();
}

export const validatePUT = (req: Request, res: Response, next: NextFunction) => {
  let errors = {};
  const { text, incorrectAnswers, correctAnswers, points } = req.body;

  if (text !== undefined) {
    const { isValid, value } = validateText(text);
    if (!isValid)
      errors = Object.assign({}, errors, value);
  }

  if (incorrectAnswers !== undefined) {
    const { isValid, value } = validateAnswers(incorrectAnswers);
    if (!isValid)
      errors = Object.assign({}, errors, value);
  }

  if (correctAnswers !== undefined) {
    const { isValid, value } = validateAnswers(correctAnswers);
    if (!isValid)
      errors = Object.assign({}, errors, value);
  }

  if (points !== undefined) {
    const { isValid, value } = validatePoints(points);
    if (!isValid)
      errors = Object.assign({}, errors, value);
  }

  if (Object.keys(errors).length > 0)
    return res.status(400).send(errors);
  return next();
}

const validateText = (text: any): ValidatorReturnValue => {
  let errors = {}

  if (typeof(text) !== 'string')
    errors = Object.assign({}, errors, {
      text: `Must be string`,
    });
  else if (text.length > 150)
    errors = Object.assign({}, errors, {
      text: `Max length: 150`,
    });
  else if (text.length === 0)
    errors = Object.assign({}, errors, {
      text: `Can't be empty`,
    });

  let rv: ValidatorReturnValue;

  if (Object.keys(errors).length > 0)
    rv = {
      isValid: false,
      value: errors,
    }
  else
    rv = {
      isValid: true,
      value: text,
    }

  return rv;
}

const validateAnswers = (answers: any): ValidatorReturnValue => {
  let errors = {};

  if (!Array.isArray(answers))
    errors = Object.assign({}, errors, {
      answers: `Must be array`,
    });
  else if (answers.length === 0)
    errors = Object.assign({}, errors, {
      answers: `At least 1 correct and 1 incorrect answers are required`,
    });
  else {
    for (let i = 0, len = answers.length; i < len; i++) {
      // save the error and break the loop, no need to check all values if one is incorrect
      if (typeof(answers[i]) !== 'string') {
        errors = Object.assign({}, errors, {
          answers: `All answers must be string`,
        });
        break;
      }
      else if (answers[i].length === 0) {
        errors = Object.assign({}, errors, {
          answers: `Empty answers aren't allowed`,
        });
        break;
      }
    }
  }

  let rv: ValidatorReturnValue;

  if (Object.keys(errors).length > 0)
    rv = {
      isValid: false,
      value: errors,
    };
  else
    rv = {
      isValid: true,
      value: answers,
    }

  return rv;
}

const validatePoints = (points: any): ValidatorReturnValue => {
  let errors = {};

  if (typeof(points) !== 'number')
    errors = Object.assign({}, errors, {
      points: `Must be a number`,
    });


  let rv: ValidatorReturnValue;
  if (Object.keys(errors).length > 0)
    rv = {
      isValid: false,
      value: errors,
    }
  else
    rv = {
      isValid: true,
      value: points,
    }

  return rv;
}
