import { Global, Module } from '@nestjs/common';
import { SlackService } from './slack.service';

@Global()
@Module({
    imports: [],
    providers: [SlackService],
    exports: [SlackService]
})
export class SlackModule {}
