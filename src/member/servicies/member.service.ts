import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MemberRepository } from '../repositories/member.repository';
import { MemberSignupDto } from '../dto/member-signup.dto';
import { MemberEntity } from '../entities/member.entity';
import { hashBcrypt, compareHashBcrypt } from '../../util';
import { MemberLoginDto } from '../dto/member-login.dto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ApiService } from '../../api/api.service';
import { MemberLogoutDto } from '../dto/member-logout.dto';
import { plainToInstance } from 'class-transformer';

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
        const duplicateEmail = await this.memberRepository.findEmail(memberSignupDto.email);
        if (duplicateEmail) {
            throw new BadRequestException('is a duplicate email');
        }

        memberSignupDto.password = await hashBcrypt(memberSignupDto.password, this.saltOrRounds);

        try {
            return await this.memberRepository.memberSignup(memberSignupDto);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async memberLogin(memberLoginDto: MemberLoginDto): Promise<MemberEntity> {
        const memberInfo = await this.memberRepository.findMember(memberLoginDto.memberId);
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
                        isSocialLogin: memberInfo.isSocialLogin,
                        status: memberInfo.status,
                        joinDate: memberInfo.joinDate,
                        withdrawDate: memberInfo.withdrawDate,
                        updateDate: memberInfo.updateDate,
                        delDate: memberInfo.delDate
                    },
                    expire: 1000 * 60 * 60 * 3 // 3시간
                });

            //delete memberInfo.password;
            return memberInfo;
        } catch (error) {
            // TODO : file log 적재 필요
            console.log(error.response.data);
            throw new InternalServerErrorException();
        }
    }

    async memberLogout(memberLogoutDto: MemberLogoutDto): Promise<{ message: string }> {
        // Redis에 존재하는 회원 정보
        const redisMemberInfo = await this.apiService
            .init()
            .getApi(
                this.redisApi.concat(
                    this.configService
                        .get('apis.in.redis.endpoint.v1.get')
                        .replace(':key', `in-member-api:member-id:${memberLogoutDto.memberId}:info`)
                )
            )
            .then((res) => {
                return res.data;
            })
            .catch((error) => {
                throw new InternalServerErrorException(error);
            });

        if (!redisMemberInfo) {
            throw new BadRequestException("we couldn't find matching member information");
        }

        try {
            // Redis 회원 정보 삭제 (=로그아웃)
            await this.apiService
                .init()
                .deleteApi(
                    this.redisApi.concat(
                        this.configService
                            .get('apis.in.redis.endpoint.v1.del')
                            .replace(':key', `in-member-api:member-id:${memberLogoutDto.memberId}:info`)
                    )
                );

            // TODO : 임시 반환 형식 - 공통 모듈 생성 후 적용 예정
            return {
                message: 'Success'
            };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async memberDetail(memberId: number): Promise<MemberEntity> {
        // Redis에 데이터 존재하는 경우 해당 데이터 반환
        const redisMemberInfo: MemberEntity = await this.apiService
            .init()
            .getApi(
                this.redisApi.concat(
                    this.configService
                        .get('apis.in.redis.endpoint.v1.get')
                        .replace(':key', `in-member-api:member-id:${memberId}:info`)
                )
            )
            .then((res) => {
                return res.data;
            })
            .catch(() => {});

        if (redisMemberInfo) return plainToInstance(MemberEntity, redisMemberInfo);

        return await this.memberRepository.findMember(memberId);
    }
}
