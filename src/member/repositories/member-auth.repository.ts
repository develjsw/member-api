import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { MemberAuthEntity } from '../entities/member-auth.entity';

@Injectable()
export class MemberAuthRepository {
    private memberAuthRepository: Repository<MemberAuthEntity>;

    constructor(protected readonly dataSource: DataSource) {
        this.memberAuthRepository = this.dataSource.getRepository(MemberAuthEntity);
    }
}
