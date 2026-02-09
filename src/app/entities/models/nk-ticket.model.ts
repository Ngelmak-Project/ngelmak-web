import { IChannel } from 'app/entities/models/nk-channel.model';
import { IComment } from 'app/entities/models/nk-comment.model';
import { IPost } from 'app/entities/models/nk-post.model';
import dayjs from 'dayjs/esm';
import { TicketType } from '../enumerations/ticket-type.model';

export interface ITicket {
  id: number;
  object?: string | null;
  type?: keyof typeof TicketType | null;
  at?: dayjs.Dayjs | null;
  closed?: boolean | null;
  content?: string | null;
  postRelated?: Pick<IPost, 'id'> | null;
  commentRelated?: Pick<IComment, 'id'> | null;
  channelRelated?: Pick<IChannel, 'id'> | null;
  issuedby?: Pick<IChannel, 'id'> | null;
}
