import { AttachmentType } from 'app/entities/enumerations/attachment-type.model';

export interface IFile {
  id?: number;
  filename?: string;
  size?: number;
  duration?: number;
  url?: string;
  data?: any;
  type?: string | AttachmentType;
  deletedAt?: Date;
  cover?: IFile;
}
