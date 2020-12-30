import bcrypt from 'bcryptjs';

import specialtiesData from './specialties.json';
import rolesData from './roles.json';
import usersData from './users.json';
import modulesData from './modules.json';
import questionsData from './questions.json';

import { DBInterface } from "../types/DBInterface";

export const populateDatabase = async (db: DBInterface) => {
    // add specialties
    const specialties = await db.Specialty.bulkCreate(specialtiesData);

    // add roles
    const roles = await db.Role.bulkCreate(rolesData);

    // add users, students and teachers
    for (let ud of usersData) {
        const role = roles.find(r => r.name === ud.role);
        if (role === undefined) {
            throw new Error(`Role ${ud.role} doesn't exist, please add it to example data first.`);
        }

        const hash = bcrypt.hashSync(ud.password, 10);
        const user = await db.User.create({
            email: ud.email,
            passwordHash: hash,
            roleId: role.id,
        });

        if (ud.role === 'student') {
            const specialty = specialties.find(s => s.name === ud.specialty);
            if (specialty === undefined) {
                throw new Error(`Specialty ${ud.specialty} doesn't exist, please add it to example data first.`);
            }

            const student = await db.Student.create({
                userId: user.id,
                studiesIn: specialty?.id,
            });
        }
    }

    // add modules
    const modules = await db.Module.bulkCreate(modulesData, {
        include: [db.Module.associations.themes],
    });

    // add questions
    const questions = await db.Question.bulkCreate(questionsData.map(qd => {
        const module = modules.find(m => m.name === qd.module);
        if (module === undefined) {
            throw new Error(`Module ${qd.module} not found. Please add it to example data first`);
        }

        if (module.themes === undefined) {
            throw new Error('You also need to fetch themes to insert questions');
        }
        const theme = module.themes.find(t => t.name === qd.theme);
        if (theme === undefined) {
            throw new Error(`Theme ${qd.theme} not found. Please add it to example data first`);
        }

        return {
            text: qd.text,
            points: qd.points,
            answers: qd.answers,
            themeId: theme.id,
        }
    }));

    // that's all folks
}