import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import { utilities, WinstonModule } from 'nest-winston';

const filterOnly = (level: string) => {
    return winston.format((info) => {
        return info.level === level ? info : false;
    })();
};

const dailyOption = (level: string) => {
    return {
        level,
        datePattern: 'YYYY-MM-DD',
        dirname: `./logs/${level}`,
        filename: `%DATE%.${level}.log`,
        maxFiles: 30,
        zippedArchive: true,
        format: winston.format.combine(
            filterOnly(level),
            winston.format.timestamp(),
            utilities.format.nestLike(process.env.NODE_ENV, { colors: false, prettyPrint: true })
        )
    };
};

export const winstonLogger = WinstonModule.createLogger({
    transports: [
        new winston.transports.Console({
            // Console 에 표시 할 로그 레벨 설정 (참고 - /node_modules/winston/index.d.ts)
            level: process.env.NODE_ENV === 'production' ? 'http' : 'debug',
            format: winston.format.combine(
                winston.format.timestamp(),
                utilities.format.nestLike('콘솔 내용' /* process.env.NODE_ENV */, { colors: true, prettyPrint: true })
            )
        }),
        // warn 로그 레벨 - 일별 파일 저장
        new winstonDaily(dailyOption('warn')),
        // error 로그 레벨 - 일별 파일 저장
        new winstonDaily(dailyOption('error'))
    ]
});
