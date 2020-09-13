import { Sequelize } from 'sequelize';

import { Subject, initSubject } from './Subject';
import { Theme, initTheme } from './Theme';
import { Question, initQuestion } from './Question';
import { Answer, initAnswer } from './Answer';
import { Exam, initExam } from './Exam';
import { User, initUser } from './User';
import { Specialty, initSpecialty } from './Specialty';
import { Student, initStudent } from './Student';
import { Teacher, initTeacher } from './Teacher';

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
initUser(sequelize);
initSpecialty(sequelize);
initStudent(sequelize);
initTeacher(sequelize);

// create associations
Subject.hasMany(Theme, { foreignKey: 'subjectId', as: 'themes' });
Theme.belongsTo(Subject, { foreignKey: 'subjectId' });

Question.hasMany(Answer, { foreignKey: 'questionId', as: 'answers' });
Answer.belongsTo(Question, { foreignKey: 'questionId' });

Theme.hasMany(Question, { foreignKey: 'themeId', as: 'questions' })
Question.belongsTo(Theme, { foreignKey: 'themeId' });

Exam.belongsToMany(Question, { through: 'exam_questions', as: 'questions' });
Question.belongsToMany(Exam, { through: 'exam_questions' });

User.hasOne(Student, { foreignKey: 'userId' });
Student.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Specialty.hasMany(Student, { foreignKey: 'studiesIn', as: 'students' });
Student.belongsTo(Specialty, { foreignKey: 'studiesIn', as: 'specialty' });

User.hasOne(Teacher, { foreignKey: 'userId' });
Teacher.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export {
    sequelize,
    Subject,
    Theme,
    Question,
    Answer,
    Exam,
    User,
    Specialty,
    Student,
    Teacher,
}