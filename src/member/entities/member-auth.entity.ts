import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tb_member_auth')
export class MemberAuthEntity {
    @PrimaryGeneratedColumn({
        name: 'member_auth_id'
    })
    memberAuthId: number;

    @PrimaryColumn('int', {
        name: 'member_id'
    })
    memberId: number;

    @Column('varchar', {
        name: 'verification_code'
    })
    verificationCode: string;

    @Column('datetime', {
        name: 'verification_expiry'
    })
    verificationExpiry: Date;

    @Column('varchar', {
        name: 'is_verified'
    })
    isVerified: string;
}
