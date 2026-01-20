import { IAccount } from './nk-account.model';
import { IPost } from './nk-post.model';

export interface IReaction {
  id?: number;
  post?: IPost;
  account?: IAccount;
  emoji?: string;
}

export interface IReactionSummaryDTO {
  counts?: Map<string, number>;
  reactedByCurrentUser?: string;
  reactionId?: number;
}
