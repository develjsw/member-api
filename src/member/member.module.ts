import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './servicies/member.service';
import { MemberRepository } from './repositories/member.repository';
import { MemberAuthService } from './servicies/member-auth.service';
import { MemberAuthRepository } from './repositories/member-auth.repository';

@Module({
    imports: [],
    controllers: [MemberController],
    providers: [MemberService, MemberRepository, MemberAuthService, MemberAuthRepository],
    exports: []
})
export class MemberModule {}
