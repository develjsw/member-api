import * as bcrypt from 'bcrypt';

export async function hashBcrypt(target: string, saltOrRounds: string | number): Promise<string> {
    return await bcrypt.hash(target, saltOrRounds);
}
