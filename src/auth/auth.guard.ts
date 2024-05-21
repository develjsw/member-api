import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor() {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token: string = this.extractBearerToken(request);

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            // TODO : token 유효성 체크 - JWT API 통신을 통해 값 전달
            // const payload = await this.jwtService.verifyAsync(token, {
            //     secret: jwtConstants.secret
            // });
            // request['user'] = payload;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    // token 형식 체크
    private extractBearerToken(request: Request): string {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : '';
    }
}
