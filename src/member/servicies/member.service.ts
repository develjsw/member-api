import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MemberRepository } from '../repositories/member.repository';
import { MemberEntity } from '../entities/member.entity';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ApiService, TApiResponse } from '../../api/api.service';
import { TMessageResponse } from '../../common/response/response.service';
import { plainToInstance } from 'class-transformer';
import { MemberSignupDto } from '../dto/member-signup.dto';
import { MemberLoginDto } from '../dto/member-login.dto';
import { MemberLogoutDto } from '../dto/member-logout.dto';
import { MemberModifyDto } from '../dto/member-modify.dto';
import { BcryptService } from '../../common/bcrypt/bcrypt.service';
import { SlackService } from '../../common/webhook/slack/slack.service';

@Injectable()
export class MemberService {
    private readonly saltOrRounds: number = 10;
    private readonly redisApi: string;

    constructor(
        private readonly memberRepository: MemberRepository,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly apiService: ApiService,
        private readonly bcryptService: BcryptService,
        private readonly slackService: SlackService
    ) {
        this.redisApi = this.configService.get('apis.in.redis.address');
    }

    async memberSignup(memberSignupDto: MemberSignupDto): Promise<MemberEntity> {
        const duplicateEmail: { email: string } | null = await this.memberRepository.findEmail(memberSignupDto.email);
        if (duplicateEmail) {
            throw new BadRequestException('is a duplicate email');
        }

        memberSignupDto.password = await this.bcryptService.hashBcrypt(memberSignupDto.password, this.saltOrRounds);

        try {
            return await this.memberRepository.memberSignup(memberSignupDto);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async memberLogin(memberLoginDto: MemberLoginDto): Promise<MemberEntity> {
        const memberInfo: MemberEntity | null = await this.memberRepository.findMember(memberLoginDto.memberId);
        if (!memberInfo) {
            throw new BadRequestException('there is no matching member information');
        }

        // 비밀번호 검증
        if (!(await this.bcryptService.compareHashBcrypt(memberLoginDto.password, memberInfo.password))) {
            throw new BadRequestException('invalid password');
        }

        const memberEntityInstance = plainToInstance(MemberEntity, memberInfo);

        // 회원 정보 Redis 저장
        try {
            await this.apiService
                .init()
                .callApi(this.redisApi.concat(this.configService.get('apis.in.redis.url.v1.set')), 'POST', {
                    key: `in-member-api:member-id:${memberInfo.memberId}:info`,
                    value: memberEntityInstance,
                    expire: 1000 * 60 * 60 * 3 // 3시간
                });

            //delete memberInfo.password;
            return memberEntityInstance;
        } catch (error) {
            await this.slackService.sendCustomMessage(
                '[ MemberLogin Error ]',
                JSON.stringify({ target: '회원 ID', memberId: memberLoginDto.memberId }),
                '#FF0000'
            );
            throw new InternalServerErrorException('login failed');
        }
    }

    async memberLogout(memberLogoutDto: MemberLogoutDto): Promise<TMessageResponse> {
        let redisMemberInfo; // Redis에 존재하는 회원 정보
        try {
            redisMemberInfo = await this.apiService
                .init()
                .callApi(
                    this.redisApi.concat(
                        this.configService
                            .get('apis.in.redis.url.v1.get')
                            .replace(':key', `in-member-api:member-id:${memberLogoutDto.memberId}:info`)
                    ),
                    'GET'
                );
        } catch (error) {
            throw new InternalServerErrorException('not logged in');
        }

        if (!Object.keys(redisMemberInfo.data))
            throw new BadRequestException("we couldn't find matching member information");

        try {
            // Redis 회원 정보 삭제 (=로그아웃)
            await this.apiService
                .init()
                .callApi(
                    this.redisApi.concat(
                        this.configService
                            .get('apis.in.redis.url.v1.del')
                            .replace(':key', `in-member-api:member-id:${memberLogoutDto.memberId}:info`)
                    ),
                    'DELETE'
                );

            // TODO : 임시 반환 형식 - 공통 모듈 생성 후 적용 예정
            return {
                message: 'Success'
            };
        } catch (error) {
            throw new InternalServerErrorException('logout failed');
        }
    }

    async memberDetail(memberId: number): Promise<MemberEntity> {
        // Redis에 데이터 존재하는 경우 해당 데이터 반환
        const redisMemberInfo: MemberEntity | null = await this.apiService
            .init()
            .callApi(
                this.redisApi.concat(
                    this.configService
                        .get('apis.in.redis.url.v1.get')
                        .replace(':key', `in-member-api:member-id:${memberId}:info`)
                ),
                'GET'
            )
            .then((res: TApiResponse): MemberEntity => {
                return plainToInstance(MemberEntity, res.data);
            })
            .catch(() => {
                return null;
            });

        if (redisMemberInfo && Object.keys(redisMemberInfo).length) return redisMemberInfo;

        // 없는 경우 DB 조회
        return await this.memberRepository.findMember(memberId);
    }

    async memberModify(memberId: number, memberModifyDto: MemberModifyDto): Promise<TMessageResponse> {
        const memberInfo: MemberEntity | null = await this.memberRepository.findMember(memberId);
        if (!memberInfo) {
            throw new BadRequestException('memberId does not exist');
        }

        if (memberModifyDto.hasOwnProperty('password')) {
            memberModifyDto.password = await this.bcryptService.hashBcrypt(memberModifyDto.password, this.saltOrRounds);
        }

        // 업데이트 될 회원 정보
        const newMemberInfo = { ...memberInfo, ...memberModifyDto };
        const memberEntityInstance = plainToInstance(MemberEntity, newMemberInfo);

        try {
            await this.apiService
                .init()
                .callApi(this.redisApi.concat(this.configService.get('apis.in.redis.url.v1.set')), 'POST', {
                    key: `in-member-api:member-id:${newMemberInfo.memberId}:info`,
                    value: memberEntityInstance,
                    expire: 1000 * 60 * 60 * 3 // 3시간
                });
        } catch (error) {
            await this.slackService.sendCustomMessage(
                '[ MemberModify Error (Redis Update Fail) ]',
                JSON.stringify({ target: '회원 ID', memberId: memberId }),
                '#FF0000'
            );
            throw new InternalServerErrorException('problem occurred while updating redis member information');
        }

        try {
            return (await this.memberRepository.updateMember(memberId, plainToInstance(MemberEntity, memberModifyDto)))
                .affected
                ? { message: 'Success' }
                : { message: 'Fail' };
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async memberWithdraw(memberId: number): Promise<TMessageResponse> {
        // TODO : Redis 데이터 업데이트 OR 삭제 처리
        try {
            return (
                await this.memberRepository.updateMember(
                    memberId,
                    plainToInstance(MemberEntity, { withdrawDate: new Date() })
                )
            ).affected
                ? { message: 'Success' }
                : { message: 'Fail' };
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
