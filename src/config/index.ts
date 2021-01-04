export const development: Config = {
    environment: 'development',
    clientPath: '../website/build',

    sequelize: {
        connectionString: 'sqlite::memory:'
    },
    express: {
        port: 8000,
        sessionSecret: 'ALAJHDLICUHVOSDIUGHSOIDUHRLAKDJBNV',
    },
};

export const production: Config = {
    environment: 'production',
    clientPath: '../website/build',

    sequelize: {
        connectionString: 'sqlite::memory:'
    },
    express: {
        port: 8000,
        sessionSecret: 'ALAJHDLICUHVOSDIUGHSOIDUHRLAKDJBNV',
    },
};

export const setupConfiguration = (): Config => {
    const knownEnvs = ['development', 'production'];
    const env = process.env.NODE_ENV || 'development';

    if (!knownEnvs.includes(env)) {
        throw new Error(`${env} is not a known environment.`);
    }

    let config: Config;

    switch (env) {
        case 'development':
            config = development;
            break;
        case 'production':
            throw new Error(`${env} is not fully prepared.. DB missing`);
            config = production;
            break;
        default:
            throw new Error(`${env} got through known environments check`);
    }

    return config;
}