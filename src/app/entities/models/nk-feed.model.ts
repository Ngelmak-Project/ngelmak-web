import { IAccount } from 'app/entities/models/nk-account.model';
import { IPost } from './nk-post.model';

export interface IFeed {
  id?: number | null;
  post?:  IPost;
  feedOwner?:  IAccount;
}
