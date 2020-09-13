import { Sequelize } from 'sequelize';

import { Subject, initSubject } from './Subject';
import { Theme, initTheme } from './Theme';
import { Question, initQuestion } from './Question';
import { Answer, initAnswer } from './Answer';
import { Exam, initExam } from './Exam';

import config from '../config/default';

const { db } = config;

//const sequelize = new Sequelize(`mysql://${db.user}:${db.password}@${db.host}/${db.database}`);
const sequelize = new Sequelize('sqlite::memory:');

// init models
initSubject(sequelize);
initTheme(sequelize);
initQuestion(sequelize);
initAnswer(sequelize);
initExam(sequelize);

// create associations
Subject.hasMany(Theme, {
    foreignKey: 'subjectId',
    as: 'themes',
});
Theme.belongsTo(Subject, { foreignKey: 'subjectId' });

Question.hasMany(Answer, {
    foreignKey: 'questionId',
    as: 'answers',
});
Answer.belongsTo(Question, { foreignKey: 'questionId' });

Theme.hasMany(Question, {
    foreignKey: 'themeId',
    as: 'questions',
})
Question.belongsTo(Theme, { foreignKey: 'themeId' });

Exam.belongsToMany(Question, { through: 'exam_questions', as: 'questions' });
Question.belongsToMany(Exam, { through: 'exam_questions' });

export {
    sequelize,
    Subject,
    Theme,
    Question,
    Answer,
    Exam,
}