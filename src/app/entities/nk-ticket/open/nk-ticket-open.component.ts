import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ITicket } from 'app/entities/models/nk-ticket.model';
import { fadeInUp400ms } from 'app/shared/animations/fade-in-up.animation';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { TicketService } from '../nk-ticket.service';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-ticket-open',
  templateUrl: './nk-ticket-open.component.html',
  animations: [fadeInUp400ms],
  imports: [CommonModule, RouterModule, FormatMediumDatetimePipe],
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
