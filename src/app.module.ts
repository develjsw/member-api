import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configLocal from './config/local/config.local';
import configDevelopment from './config/development/config.development';
import configProduction from './config/production/config.production';
import configApiLocal from './config/local/config.api.local';
import configApiDevelopment from './config/development/config.api.development';
import configApiProduction from './config/production/config.api.production';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberModule } from './member/member.module';

let config;
let apiConfig;
switch (process.env.NODE_ENV) {
    case 'production':
        config = configProduction;
        apiConfig = configApiProduction;
        break;
    case 'development':
        config = configDevelopment;
        apiConfig = configApiDevelopment;
        break;
    default:
        config = configLocal;
        apiConfig = configApiLocal;
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
export class AppModule {}
