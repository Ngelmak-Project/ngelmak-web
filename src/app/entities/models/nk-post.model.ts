import { IFileDTO } from './nk-file.model';
import { IChannelDTO } from './nk-channel.model';
import { Status } from 'app/entities/enumerations/status.model';
import { Visibility } from 'app/entities/enumerations/visibility.model';
import { IChannel } from 'app/entities/models/nk-channel.model';
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
  channel?: IChannel | null;
  files?: IFile[];
  comments?: IComment[];
}

export interface IPostDTO {
  id?: number;
  content?: string;
  at?: Date;
  lastUpdate?: Date;
  visibility?: Visibility;
  status?: Status;
  channel?: IChannelDTO;
  files?: IFileDTO[];
  reactions?: IReactionSummaryDTO;
  commentCount?: number;
  replyToId?: number;
}
