import { Body, Controller, Delete, Get, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { MemberService } from './servicies/member.service';
import { MemberAuthService } from './servicies/member-auth.service';
import { MemberSignupDto } from './dto/member-signup.dto';
import { MemberEntity } from './entities/member.entity';
import { MemberLoginDto } from './dto/member-login.dto';
import { MemberLogoutDto } from './dto/member-logout.dto';

@Controller('api/v1/members')
export class MemberController {
    constructor(
        private readonly memberService: MemberService,
        private readonly memberAuthService: MemberAuthService
    ) {}

    // TODO : 회원 상세 정보 조회 (only DB? Redis+DB?)
    // TODO : 회원 정보 수정 (only DB? Redis+DB?)
    // TODO : 회원 탈퇴 (only DB? Redis+DB?)

    /**
     * 회원 가입
     * @param memberSignupDto
     */
    @Post('signup')
    @UsePipes(ValidationPipe)
    async signup(@Body() memberSignupDto: MemberSignupDto): Promise<MemberEntity> {
        return await this.memberService.memberSignup(memberSignupDto);
    }

    /**
     * 로그인
     * @param memberLoginDto
     */
    @Post('login')
    @UsePipes(ValidationPipe)
    async login(@Body() memberLoginDto: MemberLoginDto) {
        return await this.memberService.memberLogin(memberLoginDto);
    }

    /**
     * 로그아웃
     * @param memberLogoutDto
     */
    @Post('logout')
    @UsePipes(ValidationPipe)
    async logout(@Body() memberLogoutDto: MemberLogoutDto) {
        return await this.memberService.memberLogout(memberLogoutDto);
    }

    @Get(':memberId')
    async detail() {}

    @Put(':memberId')
    async modify() {}

    @Delete(':memberId')
    async withdraw() {}
}
