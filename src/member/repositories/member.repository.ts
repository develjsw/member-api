import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { MemberEntity } from '../entities/member.entity';
import { MemberSignupDto } from '../dto/member-signup.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MemberRepository {
    private memberRepository: Repository<MemberEntity>;

    constructor(protected readonly dataSource: DataSource) {
        this.memberRepository = this.dataSource.getRepository(MemberEntity);
    }

    async findByEmail(email: string): Promise<Array<MemberEntity | []>> {
        return await this.memberRepository.findBy({
            email
        });
    }

    async memberSignup(memberSignupDto: MemberSignupDto): Promise<MemberEntity> {
        /*
            plainToInstance 사용 이유
            1. 명시적으로 MemberEntity instance 임을 나타내기 위함 → 반환타입 명시를 위해
            (plainToInstance, plainToClass 를 통해 리터럴 객체를 클래스 인스턴스 객체로 변환)
            2. entity 에서 exclude 로 password 필드 제외시켜두고 toPlainOnly 만 허용 → 저장을 위해
        */
        const memberEntityClass = plainToInstance(MemberEntity, memberSignupDto);
        memberEntityClass.joinDate = new Date();
        return await this.memberRepository.save(memberEntityClass);
    }

    async findByMemberId(memberId: number): Promise<MemberEntity | null> {
        return await this.memberRepository.findOne({
            where: {
                memberId: memberId
            }
        });
    }
}
