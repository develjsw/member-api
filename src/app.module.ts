import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configDevelopment from './config/config.development';
import configProduction from './config/config.production';
import { TypeOrmModule } from '@nestjs/typeorm';

let config = configDevelopment;
if (process.env.NODE_ENV === 'production') {
    config = configProduction;
}

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            load: [config]
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) =>
                configService.get('database.mysql'),
            inject: [ConfigService]
        })
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
