import { FindOptionsSelect } from 'typeorm';
import { UserEntity } from './user.entity';

export const USER_PROFILE_SELECT: FindOptionsSelect<UserEntity> = {
  id: true,
  username: true,
  email: true,
  isPrivate: true,
  posts: {
    id: true,
    title: true,
    description: true
  }
};
