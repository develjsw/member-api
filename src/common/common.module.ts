import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt/bcrypt.service';
import { ResponseService } from './response/response.service';

@Module({
    imports: [],
    exports: [],
    providers: [BcryptService, ResponseService]
})
export class CommonModule {}
