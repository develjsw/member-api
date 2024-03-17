import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configDevelopment from './config/development/config.development';
import configProduction from './config/production/config.production';
import configApiDevelopment from './config/development/config.api.development';
import configApiProduction from './config/production/config.api.production';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberModule } from './member/member.module';

let config;
let apiConfig;
if (process.env.NODE_ENV === 'production') {
    config = configProduction;
    apiConfig = configApiProduction;
} else {
    config = configDevelopment;
    apiConfig = configApiDevelopment;
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
            useFactory: (configService: ConfigService) => configService.get('database.mysql'),
            inject: [ConfigService]
        }),
        MemberModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
