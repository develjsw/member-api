import { ConnectionOptions } from 'typeorm';

const mysqlDataBase: ConnectionOptions = {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_SCHEMA,
    entities: ['dist/**/entities/*.entity{.ts,.js}'],
    synchronize: false,
    logging: 'all'
};

export default () => ({
    port: parseInt(process.env.PORT, 10) || 8001,

    database: {
        mysql: mysqlDataBase
    }
});
