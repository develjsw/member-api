import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

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

    // (entity 에서의 exclude 이므로 리터럴 객체에서의 제외를 의미하지는 않는다.)
    // dto 에서 exclude 를 한 것이 아니므로 dto 에서는 값을 가져올 수 있다.
    // dto 객체를 MemberEntity 로 converting 하게되면 (plainToInstance, plainToClass 를 사용하여) 보여지지 않는 게 맞지만
    // toPlainOnly: true 옵션을 통해 허용해 두었으므로 사용이 가능하다.
    @Exclude({
        toPlainOnly: true
    })
    @Column('varchar', {
        name: 'password'
    })
    password: string;

    @Column('varchar', {
        name: 'email'
    })
    email: string;

    @Column('char', {
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
