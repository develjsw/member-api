import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MemberRepository } from '../repositories/member.repository';
import { MemberSignupDto } from '../dto/member-signup.dto';
import { MemberEntity } from '../entities/member.entity';
import { hashBcrypt } from '../../util';

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
}