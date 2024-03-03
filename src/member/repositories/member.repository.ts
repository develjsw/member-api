import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { MemberEntity } from '../entities/member.entity';
import { MemberSignupDto } from '../dto/member-signup.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class MemberRepository {
    private memberRepository: Repository<MemberEntity>;

    constructor(protected readonly dataSource: DataSource) {
        this.memberRepository = this.dataSource.getRepository(MemberEntity);
    }

    async memberSignup(memberSignupDto: MemberSignupDto): Promise<MemberEntity> {
        // 명시적으로 MemberEntity class 임을 나타내기 위해 plainToClass 사용
        const memberEntityClass = plainToClass(MemberEntity, memberSignupDto);
        return await this.memberRepository.save(memberEntityClass);
    }
}
