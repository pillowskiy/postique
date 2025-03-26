import { IncomingEntity } from '../../common/entity';

export type IncomingUser = IncomingEntity<IUser, {}>;

export interface IUser {
  id: string;
  email: string;
  username: string;
  avatarPath: string;
}
