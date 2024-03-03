import * as fs from 'fs';
import * as path from 'path';

// TODO : secret 위치 변경 필요
const MYSQL_HOST = path.resolve('./secret/development/mysql-host');
const MYSQL_USER_NAME = path.resolve('./secret/development/mysql-username');
const MYSQL_PASSWORD = path.resolve('./secret/development/mysql-password');

export default () => ({
    port: parseInt(process.env.PORT, 10) || 8001,

    database: {
        mysql: {
            type: 'mysql',
            host: fs.readFileSync(MYSQL_HOST).toString(),
            port: 3306,
            username: fs.readFileSync(MYSQL_USER_NAME).toString(),
            password: fs.readFileSync(MYSQL_PASSWORD).toString(),
            database: 'msa',
            entities: ['dist/!**!/entities/!*.entity{.ts,.js}'],
            synchronize: false,
            logging: 'all'
        }
    }
});
