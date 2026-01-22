import { IAccount, IAccountDTO } from 'app/entities/models/nk-account.model';
import { IFile, IFileDTO } from './nk-file.model';
import { IPost, IPostDTO } from './nk-post.model';
import { IReactionSummaryDTO } from './nk-reaction.model';

export interface IComment {
  id: number | null;
  at?: Date | null;
  replyCount?: number;
  lastUpdate?: Date | null;
  content?: string | null;
  post?: IPost | null;
  file?: IFile | null;
  account?: IAccount | null;
  replyTo?: IComment | null;
  comments?: IComment[];
}

export interface ICommentDTO {
  id?: number;
  at?: Date;
  replyCount?: number;
  content?: String;
  post?: IPostDTO;
  file?: IFileDTO;
  account?: IAccountDTO;
  replyTo?: ICommentDTO;
  reactions?: IReactionSummaryDTO;
}

