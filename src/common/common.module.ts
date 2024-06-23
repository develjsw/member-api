import { Global, Module } from '@nestjs/common';
import { BcryptService } from './bcrypt/bcrypt.service';
import { ResponseService } from './response/response.service';
import { SlackService } from './webhook/slack/slack.service';

@Global()
@Module({
    imports: [],
    exports: [SlackService],
    providers: [BcryptService, ResponseService, SlackService]
})
export class CommonModule {}
