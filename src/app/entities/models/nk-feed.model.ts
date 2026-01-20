import { IAccount } from 'app/entities/models/nk-account.model';
import { IPost, IPostDTO } from './nk-post.model';

export interface IFeed {
  id?: number | null;
  post?: IPost;
  feedOwner?: IAccount;
}

export interface IFeedDTO {
  id?: number | null;
  post?: IPostDTO;
}
