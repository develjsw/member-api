import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MemberRepository } from '../repositories/member.repository';
import { MemberSignupDto } from '../dto/member-signup.dto';
import { MemberEntity } from '../entities/member.entity';
import { hashBcrypt, compareHashBcrypt } from '../../util';
import { MemberLoginDto } from '../dto/member-login.dto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ApiService } from '../../api/api.service';

@Injectable()
export class MemberService {
    private readonly saltOrRounds: number = 10;
    private readonly redisApi: string;

    constructor(
        private readonly memberRepository: MemberRepository,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly apiService: ApiService
    ) {
        this.redisApi = this.configService.get('apis.in.redis.address');
    }

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

    async memberLogin(memberLoginDto: MemberLoginDto): Promise<MemberLoginDto> {
        const memberInfo = await this.memberRepository.memberLogin(memberLoginDto);

        if (!memberInfo) {
            throw new BadRequestException('there is no matching member information');
        }

        // 비밀번호 검증
        if (!(await compareHashBcrypt(memberLoginDto.password, memberInfo.password))) {
            throw new BadRequestException('invalid password');
        }

        // 회원 정보 Redis 저장
        try {
            await this.apiService
                .init()
                .postApi(this.redisApi.concat(this.configService.get('apis.in.redis.endpoint.v1.set')), {
                    key: `in-member-api:member-id:${memberInfo.memberId}:info`,
                    value: {
                        memberId: memberInfo.memberId,
                        memberName: memberInfo.memberName,
                        email: memberInfo.email,
                        isSocialLogin: memberInfo.isSocialLogin
                    },
                    expire: 1000 * 60 * 60 * 3 // 3시간
                });

            delete memberInfo.password;
            return memberInfo;
        } catch (error) {
            // TODO : file log 적재 필요
            console.log(error.response.data);
            throw new InternalServerErrorException();
        }
    }
}
