import { IsNotEmpty, IsNumber } from 'class-validator';

export class MemberLogoutDto {
    @IsNotEmpty()
    @IsNumber()
    memberId: number;
}
