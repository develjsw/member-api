import { Injectable } from '@nestjs/common';
import { MemberAuthRepository } from '../repositories/member-auth.repository';

@Injectable()
export class MemberAuthService {
    constructor(private readonly memberAuthRepository: MemberAuthRepository) {}
}
