import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './servicies/member.service';
import { MemberRepository } from './repositories/member.repository';
import { MemberAuthService } from './servicies/member-auth.service';
import { MemberAuthRepository } from './repositories/member-auth.repository';
import { HttpModule } from '@nestjs/axios';
import { ApiService } from '../api/api.service';
import { CommonModule } from '../common/common.module';
import { BcryptService } from '../common/bcrypt/bcrypt.service';
import { SlackService } from '../common/webhook/slack/slack.service';

@Module({
    imports: [
        HttpModule,
        // HttpModule.registerAsync({
        //     useFactory: () => ({
        //         timeout: 5000, // ms
        //         maxRedirects: 3
        //     })
        // })
        CommonModule
    ],
    controllers: [MemberController],
    providers: [
        MemberService,
        MemberRepository,
        MemberAuthService,
        MemberAuthRepository,
        ApiService,
        BcryptService,
        SlackService
    ],
    exports: []
})
export class MemberModule {}
