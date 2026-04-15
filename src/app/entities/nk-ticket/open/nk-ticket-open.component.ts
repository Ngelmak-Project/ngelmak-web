import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ITicket } from 'app/entities/models/nk-ticket.model';
import { fadeInUp400ms } from 'app/shared/animations/fade-in-up.animation';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import SharedModule from 'app/shared/shared.module';
import { TicketService } from '../nk-ticket.service';

@Component({
  standalone: true,
  selector: 'app-ticket-open',
  templateUrl: './nk-ticket-open.component.html',
  animations: [fadeInUp400ms],
  imports: [CommonModule, RouterModule, FormatMediumDatetimePipe, SharedModule],
})
export class TicketOpenComponent implements OnInit {
  ticket = input.required<ITicket>();
  onclose = output<void>();

  ticketService = inject(TicketService);

  ticketSig = signal<ITicket>(null);
  isSaving = signal(false);

  constructor() {
    effect(() => {
      if (this.ticket()) {
        this.ticketService.find(this.ticket().id).subscribe(({ body }) => this.ticketSig.set(body));
      }
    });
  }

  ngOnInit(): void {}
}
