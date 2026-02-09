import { IChannel } from './nk-channel.model';
import { IComment } from './nk-comment.model';

export interface ICommentReaction {
  id?: number;
  comment?: IComment;
  channel?: IChannel;
  emoji?: string;
}
