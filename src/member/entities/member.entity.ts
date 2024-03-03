import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tb_member')
export class MemberEntity {
    @PrimaryGeneratedColumn({
        name: 'member_id'
    })
    memberId: number;

    @Column('varchar', {
        name: 'member_name'
    })
    memberName: string;

    @Column('varchar', {
        name: 'password'
    })
    password: string;

    @Column('varchar', {
        name: 'email'
    })
    email: string;

    @Column('varchar', {
        name: 'is_social_login'
    })
    isSocialLogin: string;

    @Column('tinyint', {
        name: 'status'
    })
    status: number;

    @Column('datetime', {
        name: 'join_date'
    })
    joinDate: Date;

    @Column('datetime', {
        name: 'withdraw_date'
    })
    withdrawDate: Date;

    @Column('datetime', {
        name: 'update_date'
    })
    updateDate: Date;

    @Column('datetime', {
        name: 'del_date'
    })
    delDate: Date;
}
