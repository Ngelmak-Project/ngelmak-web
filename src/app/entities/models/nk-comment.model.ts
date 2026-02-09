import { IChannel, IChannelDTO } from 'app/entities/models/nk-channel.model';
import { IFile, IFileDTO } from './nk-file.model';
import { IPost, IPostDTO } from './nk-post.model';
import { IReactionSummaryDTO } from './nk-reaction.model';

export interface IComment {
  id?: number | null;
  at?: Date | null;
  replyCount?: number;
  lastUpdate?: Date | null;
  content?: string | null;
  post?: IPost | null;
  file?: IFile | null;
  channel?: IChannel | null;
  replyTo?: IComment | null;
  comments?: IComment[];
}

export interface ICommentDTO {
  id?: number;
  at?: Date;
  replyCount?: number;
  content?: string;
  post?: IPostDTO;
  file?: IFileDTO;
  channel?: IChannelDTO;
  replyTo?: ICommentDTO;
  reactions?: IReactionSummaryDTO;
}

