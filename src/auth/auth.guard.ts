import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiService } from '../api/api.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly configService: ConfigService,
        private readonly apiService: ApiService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token: string = this.extractBearerToken(request);

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const jwtDetailEndpoint = this.configService
                .get('apis.in.jwt.address')
                .concat(this.configService.get('apis.in.jwt.url.v1.detail'))
                .concat('/' + token);

            // token 유효성 체크
            await this.apiService.init().callApi(jwtDetailEndpoint, 'GET');
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
