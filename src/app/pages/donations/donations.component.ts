import { Component, inject, OnInit, signal } from '@angular/core';
import { Field, form, maxLength, min, required } from '@angular/forms/signals';
import SharedModule from 'app/shared/shared.module';
import { DonationService, IDonation, IDonationStats } from './donations.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  imports: [Field, SharedModule],
})
export class DonationsComponent implements OnInit {
  donationService = inject(DonationService);

  donationModel = signal<IDonation>({
    amount: 0,
    message: '',
    isAnonymous: false,
    name: '',
  });

  donationForm = form(this.donationModel, (p) => {
    required(p.amount, {
      message: 'ngelmakTranslation.pages.donations.form.amount.validation.required',
    });
    min(p.amount, 1, { message: 'ngelmakTranslation.pages.donations.form.amount.validation.min' });
    maxLength(p.message, 1000, {
      message: 'ngelmakTranslation.pages.donations.form.message.validation.maxLength',
    });
    maxLength(p.name, 255, {
      message: 'ngelmakTranslation.pages.donations.form.name.validation.maxLength',
    });
  });

  recentDonations = signal<IDonation[]>([]);
  donatonStats = signal<IDonationStats | null>(null);
  isSaving = signal(false);

  // Platform links - update with your actual URLs
  buyMeCoffeeLink = 'https://buymeacoffee.com/ngelmak';
  stripeLink = 'https://stripe.com/...';
  paypalLink = 'https://paypal.me/ngelmak';
  liberapayLink = 'https://liberapay.com/ngelmak';
  patreonLink = 'https://patreon.com/ngelmak';

  ngOnInit(): void {
    this.donationService.getStats().subscribe((stats) => this.donatonStats.set(stats.body));

    this.donationService
      .getRecentDonations()
      .subscribe((donations) => this.recentDonations.set(donations.body));
  }

  registerDonation(): void {
    this.isSaving.set(true);
    const donation: IDonation = this.donationModel();
    this.donationService
      .donate(donation)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: (response) => {
          const newDonation = response.body;
          if (newDonation) {
            this.recentDonations.update((donations) => [newDonation, ...donations]);
            this.donatonStats.update((stats) => {
              if (stats) {
                return {
                  ...stats,
                  totalAmount: (stats.totalAmount || 0) + newDonation.amount!,
                  count: (stats.count || 0) + 1,
                  averageAmount:
                    ((stats.totalAmount || 0) + newDonation.amount!) / ((stats.count || 0) + 1),
                  lastDonationAmount: newDonation.amount,
                };
              }
              return stats;
            });
            this.donationForm().reset({ amount: 0, message: '', isAnonymous: false, name: '' });
          }
        },
        error: () => {
          // Handle error (e.g., show notification)
        },
      });
  }
}
