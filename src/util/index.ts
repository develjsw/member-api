import * as bcrypt from 'bcrypt';

export async function hashBcrypt(target: string, saltOrRounds: string | number): Promise<string> {
    return await bcrypt.hash(target, saltOrRounds);
}

export async function compareHashBcrypt(plainPassword: string, hashPassword: string): Promise<any> {
    return await bcrypt.compare(plainPassword, hashPassword);
}