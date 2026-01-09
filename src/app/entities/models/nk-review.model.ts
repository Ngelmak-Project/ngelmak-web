import { Status } from 'app/entities/enumerations/status.model';
import { IAccount } from 'app/entities/models/nk-account.model';
import { ITicket } from 'app/entities/models/nk-ticket.model';
import dayjs from 'dayjs/esm';

export interface IReview {
  id: number;
  at?: dayjs.Dayjs | null;
  status?: keyof typeof Status | null;
  timeout?: number | null;
  account?: Pick<IAccount, 'id'> | null;
  ticket?: Pick<ITicket, 'id'> | null;
  replyto?: Pick<IReview, 'id'> | null;
}
