import { CommonEntity } from 'src/common/common.entity';
import { Column, Entity } from 'typeorm';

export enum Role {
    ADMIN = 'admin',
    USER = 'user',
}

@Entity()
export class UserEntity extends CommonEntity {
    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({type: 'enum', enum: Role, default: Role.USER, array: true})
    role: Role[];
}
