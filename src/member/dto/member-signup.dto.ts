import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class MemberSignupDto {
    @IsNotEmpty()
    @IsString()
    memberName: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/, {
        message:
            'password format is incorrect (최소8자리 ~ 최대16자리, 적어도 하나의 소문자(a-z)가 포함, 적어도 하나의 대문자(A-Z)가 포함, 적어도 하나의 숫자(0-9)가 포함, 적어도 하나의 특수문자(@,$,!,%,*,?,&)가 포함)'
    })
    password: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsIn(['Y', 'N'])
    isSocialLogin: string;

    @IsNotEmpty()
    @IsNumber()
    @IsIn([1, 2, 3])
    status: number;
}
