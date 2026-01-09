import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IConfig } from 'app/entities/models/nk-config.model';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import SharedModule from 'app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'app-config-detail',
  templateUrl: './nk-config-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class ConfigDetailComponent {
  config = input<IConfig | null>(null);

  previousState(): void {
    window.history.back();
  }
}
