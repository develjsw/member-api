import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './servicies/member.service';
import { MemberRepository } from './repositories/member.repository';
import { MemberAuthService } from './servicies/member-auth.service';
import { MemberAuthRepository } from './repositories/member-auth.repository';
import { HttpModule } from '@nestjs/axios';
import { ApiService } from '../api/api.service';

@Module({
    imports: [
        HttpModule
        // HttpModule.registerAsync({
        //     useFactory: () => ({
        //         timeout: 5000, // ms
        //         maxRedirects: 3
        //     })
        // })
    ],
    controllers: [MemberController],
    providers: [MemberService, MemberRepository, MemberAuthService, MemberAuthRepository, ApiService],
    exports: []
})
export class MemberModule {}
