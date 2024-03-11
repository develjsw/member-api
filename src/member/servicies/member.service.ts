import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MemberRepository } from '../repositories/member.repository';
import { MemberSignupDto } from '../dto/member-signup.dto';
import { MemberEntity } from '../entities/member.entity';
import { hashBcrypt } from '../../util';
import { MemberLoginDto } from '../dto/member-login.dto';

@Injectable()
export class MemberService {
    private readonly saltOrRounds: number = 10;

    constructor(private readonly memberRepository: MemberRepository) {}

    async memberSignup(memberSignupDto: MemberSignupDto): Promise<MemberEntity> {
        const duplicateEmail = await this.memberRepository.findByEmail(memberSignupDto.email);
        if (duplicateEmail.length) {
            throw new BadRequestException('is a duplicate email');
        }

        memberSignupDto.password = await hashBcrypt(memberSignupDto.password, this.saltOrRounds);

        try {
            return await this.memberRepository.memberSignup(memberSignupDto);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async memberLogin(memberLoginDto: MemberLoginDto): Promise<any> {
        const memberInfo = await this.memberRepository.memberLogin(memberLoginDto);

        if (!memberInfo) {
            throw new BadRequestException('there is no matching member information');
        }

        // 비밀번호 검증
        if (memberInfo.password !== (await hashBcrypt(memberLoginDto.password, this.saltOrRounds))) {
            throw new BadRequestException('invalid password');
        }

        // TODO : Redis에 로그인 성공한 회원정보 저장 (password는 delete로 제거)
    }
}
