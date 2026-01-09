import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IMembership } from 'app/entities/models/nk-membership.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMembership for edit and IMembershipFormGroupInput for create.
 */
type MembershipFormGroupInput = IMembership | PartialWithRequiredKeyOf<IMembership>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IMembership | IMembership> = Omit<T, 'at'> & {
  at?: string | null;
};

type MembershipFormRawValue = FormValueOf<IMembership>;

type IMembershipFormRawValue = FormValueOf<IMembership>;

type MembershipFormDefaults = Pick<IMembership, 'id' | 'at' | 'activateNotification'>;

type MembershipFormGroupContent = {
  id: FormControl<MembershipFormRawValue['id'] | IMembership['id']>;
  at: FormControl<MembershipFormRawValue['at']>;
  activateNotification: FormControl<MembershipFormRawValue['activateNotification']>;
  account: FormControl<MembershipFormRawValue['account']>;
  subscriber: FormControl<MembershipFormRawValue['subscriber']>;
};

export type MembershipFormGroup = FormGroup<MembershipFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MembershipFormService {
  createMembershipFormGroup(membership: MembershipFormGroupInput = { id: null }): MembershipFormGroup {
    const membershipRawValue = this.convertMembershipToMembershipRawValue({
      ...this.getFormDefaults(),
      ...membership,
    });
    return new FormGroup<MembershipFormGroupContent>({
      id: new FormControl(
        { value: membershipRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      at: new FormControl(membershipRawValue.at),
      activateNotification: new FormControl(membershipRawValue.activateNotification),
      account: new FormControl(membershipRawValue.account, {
        validators: [Validators.required],
      }),
      subscriber: new FormControl(membershipRawValue.subscriber, {
        validators: [Validators.required],
      }),
    });
  }

  getMembership(form: MembershipFormGroup): IMembership | IMembership {
    return this.convertMembershipRawValueToMembership(form.getRawValue() as MembershipFormRawValue | IMembershipFormRawValue);
  }

  resetForm(form: MembershipFormGroup, membership: MembershipFormGroupInput): void {
    const membershipRawValue = this.convertMembershipToMembershipRawValue({ ...this.getFormDefaults(), ...membership });
    form.reset(
      {
        ...membershipRawValue,
        id: { value: membershipRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): MembershipFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      at: currentTime,
      activateNotification: false,
    };
  }

  private convertMembershipRawValueToMembership(
    rawMembership: MembershipFormRawValue | IMembershipFormRawValue,
  ): IMembership | IMembership {
    return {
      ...rawMembership,
      at: dayjs(rawMembership.at, DATE_TIME_FORMAT),
    };
  }

  private convertMembershipToMembershipRawValue(
    membership: IMembership | (Partial<IMembership> & MembershipFormDefaults),
  ): MembershipFormRawValue | PartialWithRequiredKeyOf<IMembershipFormRawValue> {
    return {
      ...membership,
      at: membership.at ? membership.at.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
