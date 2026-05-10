import { IFileDTO } from './nk-file.model';
import { IChannelDTO } from './nk-channel.model';
import { Status } from 'app/entities/enumerations/status.model';
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
  visible?: boolean;
  content?: string | null;
  status?: keyof typeof Status | null;
  channel?: IChannel | null;
  postReply?: IPost | null;
  files?: IFile[];
  comments?: IComment[];
}

export interface IPostDTO {
  id?: number;
  content?: string;
  at?: Date;
  lastUpdate?: Date;
  visible?: boolean;
  status?: Status;
  channel?: IChannelDTO;
  files?: IFileDTO[];
  reactions?: IReactionSummaryDTO;
  commentCount?: number;
  postReply?: IPostDTO;
}

interface ActiveChannel {
  id?: number;
	name?: String;
	identifier?: String;
	avatar?: String;
	banner?: String;
	description?: String;
	postCount?: number;
}

export interface ITrending {
  topActiveChannels?: ActiveChannel[];
  trendingPosts?: IPostDTO[];
  mostEngagedPosts?: IPostDTO[];
}
