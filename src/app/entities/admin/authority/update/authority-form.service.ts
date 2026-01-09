import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAuthority } from '../authority.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { name: unknown }> = Partial<Omit<T, 'name'>> & { name: T['name'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAuthority for edit and IAuthorityFormGroupInput for create.
 */
type AuthorityFormGroupInput = IAuthority | PartialWithRequiredKeyOf<IAuthority>;

type AuthorityFormDefaults = Pick<IAuthority, 'name'>;

type AuthorityFormGroupContent = {
  name: FormControl<IAuthority['name'] | IAuthority['name']>;
};

export type AuthorityFormGroup = FormGroup<AuthorityFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AuthorityFormService {
  createAuthorityFormGroup(authority: AuthorityFormGroupInput = { name: null }): AuthorityFormGroup {
    const authorityRawValue = {
      ...this.getFormDefaults(),
      ...authority,
    };
    return new FormGroup<AuthorityFormGroupContent>({
      name: new FormControl(
        { value: authorityRawValue.name, disabled: authorityRawValue.name !== null },
        {
          nonNullable: true,
          validators: [Validators.required, Validators.maxLength(50)],
        },
      ),
    });
  }

  getAuthority(form: AuthorityFormGroup): IAuthority {
    return form.getRawValue() as IAuthority;
  }

  resetForm(form: AuthorityFormGroup, authority: AuthorityFormGroupInput): void {
    const authorityRawValue = { ...this.getFormDefaults(), ...authority };
    form.reset(
      {
        ...authorityRawValue,
        name: { value: authorityRawValue.name, disabled: authorityRawValue.name !== null },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AuthorityFormDefaults {
    return {
      name: null,
    };
  }
}
