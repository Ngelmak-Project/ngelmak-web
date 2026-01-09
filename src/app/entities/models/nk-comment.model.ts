import { Opinion } from 'app/entities/enumerations/opinion.model';
import { IAccount } from 'app/entities/models/nk-account.model';
import { IPost } from 'app/entities/models/nk-post.model';

export interface IComment {
  id: number | null;
  opinion?: keyof typeof Opinion | null;
  at?: Date | null;
  lastUpdate?: Date | null;
  content?: string | null;
  url?: string | null;
  post?: IPost | null;
  replayto?: IComment | null;
  account?: IAccount | null;
}
