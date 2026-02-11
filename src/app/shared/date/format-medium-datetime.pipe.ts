import { Pipe, PipeTransform } from '@angular/core';

import dayjs from 'dayjs/esm';

@Pipe({
  standalone: true,
  name: 'formatMediumDatetime',
})
export default class FormatMediumDatetimePipe implements PipeTransform {
  transform(date: Date | dayjs.Dayjs | null | undefined): string {
    return date ? dayjs(date).format('D MMM YYYY HH:mm') : '';
  }
}
