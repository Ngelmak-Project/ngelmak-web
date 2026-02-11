import { Pipe } from '@angular/core';

@Pipe({ name: 'humanReadableFileSize' })
export default class HumanReadableFileSizePipe {
  transform(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const index = Math.floor(Math.log(bytes) / Math.log(k));
    const size = bytes / Math.pow(k, index);
    return `${size.toFixed(2)} ${sizes[index]}`;
  }
}
