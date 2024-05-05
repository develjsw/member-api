import * as bcrypt from 'bcrypt';

export class BcryptService {
    async hashBcrypt(target: string, saltOrRounds: string | number): Promise<string> {
        return await bcrypt.hash(target, saltOrRounds);
    }

    async compareHashBcrypt(plainPassword: string, hashPassword: string): Promise<any> {
        return await bcrypt.compare(plainPassword, hashPassword);
    }
}
