import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITicket } from 'app/entities/models/nk-ticket.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITicket for edit and ITicketFormGroupInput for create.
 */
type TicketFormGroupInput = ITicket | PartialWithRequiredKeyOf<ITicket>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITicket | ITicket> = Omit<T, 'at'> & {
  at?: string | null;
};

type TicketFormRawValue = FormValueOf<ITicket>;

type ITicketFormRawValue = FormValueOf<ITicket>;

type TicketFormDefaults = Pick<ITicket, 'id' | 'at' | 'closed'>;

type TicketFormGroupContent = {
  id: FormControl<TicketFormRawValue['id'] | ITicket['id']>;
  object: FormControl<TicketFormRawValue['object']>;
  type: FormControl<TicketFormRawValue['type']>;
  at: FormControl<TicketFormRawValue['at']>;
  closed: FormControl<TicketFormRawValue['closed']>;
  content: FormControl<TicketFormRawValue['content']>;
  postRelated: FormControl<TicketFormRawValue['postRelated']>;
  commentRelated: FormControl<TicketFormRawValue['commentRelated']>;
  accountRelated: FormControl<TicketFormRawValue['accountRelated']>;
  issuedby: FormControl<TicketFormRawValue['issuedby']>;
};

export type TicketFormGroup = FormGroup<TicketFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TicketFormService {
  createTicketFormGroup(ticket: TicketFormGroupInput = { id: null }): TicketFormGroup {
    const ticketRawValue = this.convertTicketToTicketRawValue({
      ...this.getFormDefaults(),
      ...ticket,
    });
    return new FormGroup<TicketFormGroupContent>({
      id: new FormControl(
        { value: ticketRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      object: new FormControl(ticketRawValue.object, {
        validators: [Validators.required, Validators.minLength(50), Validators.maxLength(200)],
      }),
      type: new FormControl(ticketRawValue.type, {
        validators: [Validators.required],
      }),
      at: new FormControl(ticketRawValue.at, {
        validators: [Validators.required],
      }),
      closed: new FormControl(ticketRawValue.closed),
      content: new FormControl(ticketRawValue.content),
      postRelated: new FormControl(ticketRawValue.postRelated),
      commentRelated: new FormControl(ticketRawValue.commentRelated),
      accountRelated: new FormControl(ticketRawValue.accountRelated),
      issuedby: new FormControl(ticketRawValue.issuedby, {
        validators: [Validators.required],
      }),
    });
  }

  getTicket(form: TicketFormGroup): ITicket | ITicket {
    return this.convertTicketRawValueToTicket(form.getRawValue() as TicketFormRawValue | ITicketFormRawValue);
  }

  resetForm(form: TicketFormGroup, ticket: TicketFormGroupInput): void {
    const ticketRawValue = this.convertTicketToTicketRawValue({ ...this.getFormDefaults(), ...ticket });
    form.reset(
      {
        ...ticketRawValue,
        id: { value: ticketRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TicketFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      at: currentTime,
      closed: false,
    };
  }

  private convertTicketRawValueToTicket(rawTicket: TicketFormRawValue | ITicketFormRawValue): ITicket | ITicket {
    return {
      ...rawTicket,
      at: dayjs(rawTicket.at, DATE_TIME_FORMAT),
    };
  }

  private convertTicketToTicketRawValue(
    ticket: ITicket | (Partial<ITicket> & TicketFormDefaults),
  ): TicketFormRawValue | PartialWithRequiredKeyOf<ITicketFormRawValue> {
    return {
      ...ticket,
      at: ticket.at ? ticket.at.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
