import { CommonEntity } from "src/common/common.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";


export enum FollowStatus {
    FOLLOWING = 'following',
    UNFOLLOWED = 'unfollowed',
    WAITING='waiting'
}

@Entity()
export class FollowEntity extends CommonEntity{
    @ManyToOne(()=>UserEntity, user=>user.followers,{onDelete:'CASCADE'})
    followerUser: UserEntity;

    @ManyToOne(()=>UserEntity, user=>user.followeds,{onDelete:'CASCADE'})
    followedUser: UserEntity;

    @Column({default:FollowStatus.UNFOLLOWED})
    status: FollowStatus;
}