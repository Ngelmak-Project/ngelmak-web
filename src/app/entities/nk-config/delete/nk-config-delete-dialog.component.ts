import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
;

import SharedModule from 'app/shared/shared.module';

import { IConfig } from 'app/entities/models/nk-config.model';
import { ConfigService } from '../service/nk-config.service';

@Component({
  standalone: true,
  templateUrl: './nk-config-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ConfigDeleteDialogComponent {
  config?: IConfig;
  protected configService: ConfigService = inject(ConfigService);

  cancel(): void {
    // this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.configService.delete(id).subscribe(() => {

    });
  }
}
