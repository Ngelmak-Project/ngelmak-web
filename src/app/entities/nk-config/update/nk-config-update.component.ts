import { HttpResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import SharedModule from 'app/shared/shared.module';

import { Accessibility } from 'app/entities/enumerations/accessibility.model';
import { Visibility } from 'app/entities/enumerations/visibility.model';
import { IConfig } from 'app/entities/models/nk-config.model';
import { ConfigService } from '../service/nk-config.service';

@Component({
  standalone: true,
  selector: 'app-config-update',
  templateUrl: './nk-config-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ConfigUpdateComponent implements OnInit {
  isSaving = false;
  config: IConfig | null = null;
  accessibilityValues = Object.keys(Accessibility);
  visibilityValues = Object.keys(Visibility);

  protected configService = inject(ConfigService);
  protected activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ config }) => {
      this.config = config;
      if (config) {
        this.updateForm(config);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    // const config = this.configFormService.getConfig(this.editForm);
    // if (config.id !== null) {
    //   this.subscribeToSaveResponse(this.configService.update(config));
    // } else {
    //   this.subscribeToSaveResponse(this.configService.create(config));
    // }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConfig>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(config: IConfig): void {
    this.config = config;
    // this.configFormService.resetForm(this.editForm, config);
  }
}
