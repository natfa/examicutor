interface Config {
    environment: string;
    clientPath: string;

    sequelize: SequelizeConfig;
    express: ExpressConfig;
}