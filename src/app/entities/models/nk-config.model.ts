import dayjs from 'dayjs/esm';
import { Accessibility } from 'app/entities/enumerations/accessibility.model';
import { Visibility } from 'app/entities/enumerations/visibility.model';

export interface IConfig {
  id: number | null;
  lastUpdate?: dayjs.Dayjs | null;
  defaultAccessibility?: keyof typeof Accessibility | null;
  defaultVisibility?: keyof typeof Visibility | null;
}
