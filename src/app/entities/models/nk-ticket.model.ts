import { IChannel } from 'app/entities/models/nk-channel.model';
import { IComment } from 'app/entities/models/nk-comment.model';
import { IPost } from 'app/entities/models/nk-post.model';
import { IFile } from './nk-file.model';

export interface ITicket {
  id: number;
  issuedAt?: Date | null;
  resolved?: boolean | null; // Indicates whether the ticket has been closed/resolved.
  description?: string | null; // Detailed description or explanation of the issue.
  evidence?: IFile | null; // Optional file containing evidence (e.g., an image).
  post?: IPost | null; // Post associated with the ticket, if applicable.
  comment?: IComment | null; // Comment associated with the ticket, if applicable.
  channel?: IChannel | null; // Channel associated with the ticket, if applicable.
  issuedBy?: number | null; // ID of the user who issued the ticket.
  handledBy?: number | null; // ID of the user who handle the ticket.
  assignedTo?: number | null; // ID of the user responsible for handling the ticket.
}
