import { Sequelize } from 'sequelize/types';

import { Answer } from '../models/Answer';
import { Exam } from '../models/Exam';
import { ExamParameter } from '../models/ExamParameter';
import { Module } from '../models/Module';
import { Question } from '../models/Question';
import { Role } from '../models/Role';
import { Solution } from '../models/Solution';
import { SolutionAnswer } from '../models/SolutionAnswer';
import { Specialty } from '../models/Specialty';
import { Student } from '../models/Student';
import { Teacher } from '../models/Teacher';
import { Theme } from '../models/Theme';
import { User } from '../models/User';

interface DBInterface {
    sequelize: Sequelize;

    Answer: typeof Answer;
    Exam: typeof Exam;
    ExamParameter: typeof ExamParameter;
    Module: typeof Module;
    Question: typeof Question;
    Role: typeof Role;
    Solution: typeof Solution;
    SolutionAnswer: typeof SolutionAnswer;
    Specialty: typeof Specialty;
    Student: typeof Student;
    Teacher: typeof Teacher;
    Theme: typeof Theme;
    User: typeof User;
}