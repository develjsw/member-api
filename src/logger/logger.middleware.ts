import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { winstonLogger } from './winston.config';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor() {}

    use(req: Request, res: Response, next: NextFunction) {
        const { ip, method, originalUrl } = req;
        const userAgent = req.get('user-agent');

        res.on('finish', () => {
            const { statusCode } = res;

            if (statusCode >= 400 && statusCode < 500) {
                winstonLogger.warn(`${ip} ${method} ${originalUrl} ${userAgent} status(${statusCode})`);
            } else if (statusCode >= 500) {
                winstonLogger.error(`${ip} ${method} ${originalUrl} ${userAgent} status(${statusCode})`);
            } else {
                winstonLogger.log(`${ip} ${method} ${originalUrl} ${userAgent} status(${statusCode})`);
            }
        });

        next();
    }
}
