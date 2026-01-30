import { IFileDTO } from './nk-file.model';
import { IAccountDTO } from './nk-account.model';
import { Status } from 'app/entities/enumerations/status.model';
import { Visibility } from 'app/entities/enumerations/visibility.model';
import { IAccount } from 'app/entities/models/nk-account.model';
import { IComment } from 'app/entities/models/nk-comment.model';
import { IFile } from 'app/entities/models/nk-file.model';
import { IReactionSummaryDTO } from './nk-reaction.model';

export interface IPost {
  id?: number | null;
  keywords?: string | null;
  at?: Date | null;
  commentCount?: number;
  lastUpdate?: Date | null;
  visibility?: keyof typeof Visibility | null;
  content?: string | null;
  status?: keyof typeof Status | null;
  account?: IAccount | null;
  files?: IFile[];
  comments?: IComment[];
}

export interface IPostDTO {
  id?: number;
  content?: String;
  at?: Date;
  lastUpdate?: Date;
  visibility?: Visibility;
  status?: Status;
  account?: IAccountDTO;
  files?: IFileDTO[];
  reactions?: IReactionSummaryDTO;
  commentCount?: number;
  replyToId?: number;
}
