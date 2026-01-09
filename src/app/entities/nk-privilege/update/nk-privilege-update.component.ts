import { HttpResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import SharedModule from 'app/shared/shared.module';

import { Accessibility } from 'app/entities/enumerations/accessibility.model';
import { Visibility } from 'app/entities/enumerations/visibility.model';
import { IPrivilege } from 'app/entities/models/nk-privilege.model';
import { PrivilegeService } from '../service/nk-privilege.service';

@Component({
  standalone: true,
  selector: 'app-privilege-update',
  templateUrl: './nk-privilege-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PrivilegeUpdateComponent implements OnInit {
  isSaving = false;
  privilege: IPrivilege | null = null;
  accessibilityValues = Object.keys(Accessibility);
  visibilityValues = Object.keys(Visibility);

  protected privilegeService = inject(PrivilegeService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ privilege }) => {
      this.privilege = privilege;
      if (privilege) {
        this.updateForm(privilege);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    // const privilege = this.privilegeFormService.getPrivilege(this.editForm);
    // if (privilege.id !== null) {
    //   this.subscribeToSaveResponse(this.privilegeService.update(privilege));
    // } else {
    //   this.subscribeToSaveResponse(this.privilegeService.create(privilege));
    // }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPrivilege>>): void {
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

  protected updateForm(privilege: IPrivilege): void {
    this.privilege = privilege;
    // this.privilegeFormService.resetForm(this.editForm, privilege);
  }
}
