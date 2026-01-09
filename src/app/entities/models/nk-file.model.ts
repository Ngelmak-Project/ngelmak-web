import { IPost } from 'app/entities/models/nk-post.model';

export interface IFile {
  id?: number;
  position?: number;
  type?: string;
  textContent?: string;
  caption?: string | null;
  filename?: string;
  duration?: number;
  url?: string | null;
  posterUrl?: string | null;
  size?: number | null;
  dirty?: boolean;
  blob?: Blob;
  posterBlob?: Blob;
}
