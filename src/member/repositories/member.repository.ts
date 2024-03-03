import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { MemberEntity } from '../entities/member.entity';

@Injectable()
export class MemberRepository {
    private memberRepository: Repository<MemberEntity>;

    constructor(protected readonly dataSource: DataSource) {
        this.memberRepository = this.dataSource.getRepository(MemberEntity);
    }
}
