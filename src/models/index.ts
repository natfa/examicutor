import { Sequelize } from 'sequelize';

import { Subject, initSubject } from './Subject';
import { Theme, initTheme } from './Theme';

import config from '../config/default';

const { db } = config;

const sequelize = new Sequelize(`mysql://${db.user}:${db.password}@${db.host}/${db.database}`);

// init models
initSubject(sequelize);
initTheme(sequelize);

// create associations
Subject.hasMany(Theme, {
    foreignKey: 'subjectId',
    as: 'themes',
});
Theme.belongsTo(Subject, {
    foreignKey: 'subjectId',
    as: 'themes',
});

export {
    sequelize,
    Subject,
    Theme,
}