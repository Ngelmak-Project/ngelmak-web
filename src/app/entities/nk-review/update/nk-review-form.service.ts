import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IReview } from 'app/entities/models/nk-review.model';
import dayjs from 'dayjs/esm';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IReview for edit and IReviewFormGroupInput for create.
 */
type ReviewFormGroupInput = IReview | PartialWithRequiredKeyOf<IReview>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IReview | IReview> = Omit<T, 'at'> & {
  at?: string | null;
};

type ReviewFormRawValue = FormValueOf<IReview>;

type IReviewFormRawValue = FormValueOf<IReview>;

type ReviewFormDefaults = Pick<IReview, 'id' | 'at'>;

type ReviewFormGroupContent = {
  id: FormControl<ReviewFormRawValue['id'] | IReview['id']>;
  at: FormControl<ReviewFormRawValue['at']>;
  status: FormControl<ReviewFormRawValue['status']>;
  timeout: FormControl<ReviewFormRawValue['timeout']>;
  account: FormControl<ReviewFormRawValue['account']>;
  ticket: FormControl<ReviewFormRawValue['ticket']>;
  replyto: FormControl<ReviewFormRawValue['replyto']>;
};

export type ReviewFormGroup = FormGroup<ReviewFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ReviewFormService {
  createReviewFormGroup(review: ReviewFormGroupInput = { id: null }): ReviewFormGroup {
    const reviewRawValue = this.convertReviewToReviewRawValue({
      ...this.getFormDefaults(),
      ...review,
    });
    return new FormGroup<ReviewFormGroupContent>({
      id: new FormControl(
        { value: reviewRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      at: new FormControl(reviewRawValue.at, {
        validators: [Validators.required],
      }),
      status: new FormControl(reviewRawValue.status, {
        validators: [Validators.required],
      }),
      timeout: new FormControl(reviewRawValue.timeout, {
        validators: [Validators.required],
      }),
      account: new FormControl(reviewRawValue.account, {
        validators: [Validators.required],
      }),
      ticket: new FormControl(reviewRawValue.ticket),
      replyto: new FormControl(reviewRawValue.replyto),
    });
  }

  getReview(form: ReviewFormGroup): IReview | IReview {
    return this.convertReviewRawValueToReview(form.getRawValue() as ReviewFormRawValue | IReviewFormRawValue);
  }

  resetForm(form: ReviewFormGroup, review: ReviewFormGroupInput): void {
    const reviewRawValue = this.convertReviewToReviewRawValue({ ...this.getFormDefaults(), ...review });
    form.reset(
      {
        ...reviewRawValue,
        id: { value: reviewRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ReviewFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      at: currentTime,
    };
  }

  private convertReviewRawValueToReview(rawReview: ReviewFormRawValue | IReviewFormRawValue): IReview | IReview {
    return {
      ...rawReview,
      at: dayjs(rawReview.at, DATE_TIME_FORMAT),
    };
  }

  private convertReviewToReviewRawValue(
    review: IReview | (Partial<IReview> & ReviewFormDefaults),
  ): ReviewFormRawValue | PartialWithRequiredKeyOf<IReviewFormRawValue> {
    return {
      ...review,
      at: review.at ? review.at.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
