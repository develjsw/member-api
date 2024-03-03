import { Injectable } from '@nestjs/common';
import { MemberRepository } from '../repositories/member.repository';

@Injectable()
export class MemberService {
    constructor(private readonly memberRepository: MemberRepository) {}
}
