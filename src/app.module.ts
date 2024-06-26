import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import localConfig from './config/local/local.config';
import developmentConfig from './config/development/development.config';
import productionConfig from './config/production/production.config';
import localConfigApi from './config/local/api.local.config';
import developmentConfigApi from './config/development/api.development.config';
import productionConfigApi from './config/production/api.production.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberModule } from './member/member.module';
import { LoggerMiddleware } from './logger/logger.middleware';

let config;
let apiConfig;
switch (process.env.NODE_ENV) {
    case 'production':
        config = productionConfig;
        apiConfig = productionConfigApi;
        break;
    case 'development':
        config = developmentConfig;
        apiConfig = developmentConfigApi;
        break;
    default:
        config = localConfig;
        apiConfig = localConfigApi;
        break;
}

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            load: [config, apiConfig]
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => configService.get('config-info.database.mysql'),
            inject: [ConfigService]
        }),
        MemberModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
