import { IChannel } from 'app/entities/models/nk-channel.model';
import { IPost, IPostDTO } from './nk-post.model';

export interface IFeed {
  id?: number | null;
  post?: IPost;
  feedOwner?: IChannel;
}

export interface IFeedDTO {
  id?: number | null;
  post?: IPostDTO;
}
