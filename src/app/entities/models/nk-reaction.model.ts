import { IChannel } from './nk-channel.model';
import { IPost } from './nk-post.model';

export interface IReaction {
  id?: number;
  post?: IPost;
  channel?: IChannel;
  emoji?: string;
}

export interface IReactionSummaryDTO {
  counts?: Map<string, number>;
  reactedByCurrentUser?: string;
  reactionId?: number;
}
