import { Status } from 'app/entities/enumerations/status.model';
import { IChannel } from 'app/entities/models/nk-channel.model';
import { ITicket } from 'app/entities/models/nk-ticket.model';
import dayjs from 'dayjs/esm';

export interface IReview {
  id: number;
  at?: dayjs.Dayjs | null;
  status?: keyof typeof Status | null;
  timeout?: number | null;
  channel?: Pick<IChannel, 'id'> | null;
  ticket?: Pick<ITicket, 'id'> | null;
  replyto?: Pick<IReview, 'id'> | null;
}
