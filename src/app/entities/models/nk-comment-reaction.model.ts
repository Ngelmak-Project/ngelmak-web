import { IAccount } from './nk-account.model';
import { IComment } from './nk-comment.model';

export interface ICommentReaction {
  id?: number;
  comment?: IComment;
  account?: IAccount;
  emoji?: string;
}
