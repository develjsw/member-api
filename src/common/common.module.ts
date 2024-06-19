import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt/bcrypt.service';
import { ResponseService } from './response/response.service';
import { SlackModule } from './webhook/slack/slack.module';

@Module({
    imports: [],
    exports: [],
    providers: [BcryptService, ResponseService, SlackModule]
})
export class CommonModule {}
