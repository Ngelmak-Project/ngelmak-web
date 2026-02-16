import { IChannel } from 'app/entities/models/nk-channel.model';
import { IComment } from 'app/entities/models/nk-comment.model';
import { IPost } from 'app/entities/models/nk-post.model';
import { TicketType } from '../enumerations/ticket-type.model';
import { IFile } from './nk-file.model';

export interface ITicket {
  id: number;
  type?: TicketType | null;
  at?: Date | null;
  closed?: boolean | null; // Indicates whether the ticket has been closed/resolved.
  content?: string | null; // Detailed description or explanation of the issue.
  evidence?: IFile | null; // Optional file containing evidence (e.g., an image).
  issuedby?: number | null; // ID of the user who issued the ticket.
  post?: IPost | null; // Post associated with the ticket, if applicable.
  comment?: IComment | null; // Comment associated with the ticket, if applicable.
  channel?: IChannel | null; // Channel associated with the ticket, if applicable.
}
