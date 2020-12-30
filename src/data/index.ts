import bcrypt from 'bcryptjs';

import specialtiesData from './specialties.json';
import rolesData from './roles.json';
import usersData from './users.json';
import modulesData from './modules.json';
import questionsData from './questions.json';

import { DBInterface } from "../types/DBInterface";

export const populateDatabase = async (db: DBInterface) => {
    const specialties = await db.Specialty.bulkCreate(specialtiesData);
    const roles = await db.Role.bulkCreate(rolesData);

    const users = await db.User.bulkCreate(usersData.map((ud) => {
        const role = roles.find(r => r.name === ud.role);
        if (role === undefined) {
            throw new Error(`Role ${ud.role} doesn't exist, please add it to example data first.`);
        }

        const hash = bcrypt.hashSync(ud.password, 10);

        return {
            email: ud.email,
            passwordHash: hash,
            roleId: role.id,
        };
    }));

    const modules = await db.Module.bulkCreate(modulesData, {
        include: [db.Module.associations.themes],
    });

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
}