import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('api/v1/members')
export class MemberController {
    constructor() {}

    // TODO : 회원가입
    // TODO : 로그인 (Redis 활용 - 어디까지 활용할 것인가?)
    // TODO : 로그아웃 (Redis 활용)
    // TODO : 회원 상세 정보 조회 (only DB? Redis+DB?)
    // TODO : 회원 정보 수정 (only DB? Redis+DB?)
    // TODO : 회원 탈퇴 (only DB? Redis+DB?)

    // 회원가입
    @Post('signup')
    async signup() {}

    @Post('login')
    async login() {}

    @Post('logout')
    async logout() {}

    @Get(':memberId')
    async detail() {}

    @Put(':memberId')
    async modify() {}

    @Delete(':memberId')
    async withdraw() {}
}
