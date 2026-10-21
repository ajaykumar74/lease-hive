import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CustomerPortalSupportTicket, CustomerPortalWorkspaceService } from './customer-portal-workspace.service';
import { workspaceStyles } from './customer-portal-contracts.component';

@Component({
    selector: 'app-customer-portal-support',
    standalone: true,
    imports: [CommonModule, RouterLink, DatePipe],
    template: `
    <section class="portal-workspace">
      <div class="heading">
        <div>
          <p class="eyebrow">Customer Portal</p>
          <h1>Support Tickets</h1>
          <p>Track requests and replies from the Leasora support team.</p>
        </div>
        <a class="primary-action" routerLink="/customer-portal/support/create">Create Ticket</a>
      </div>

      <p *ngIf="loading" class="state">Loading support tickets…</p>
      <p *ngIf="error" class="error">{{ error }}</p>

      <div class="table-card" *ngIf="!loading && !error">
        <div class="ticket-tabs" role="tablist" aria-label="Support ticket status">
          <button type="button" role="tab" [attr.aria-selected]="activeTab === 'active'" [class.selected]="activeTab === 'active'" (click)="activeTab = 'active'">
            Active <span>{{ activeTickets.length }}</span>
          </button>
          <button type="button" role="tab" [attr.aria-selected]="activeTab === 'completed'" [class.selected]="activeTab === 'completed'" (click)="activeTab = 'completed'">
            Completed <span>{{ completedTickets.length }}</span>
          </button>
        </div>

        <table *ngIf="visibleTickets.length; else emptyState">
          <thead><tr><th>Ticket ID</th><th>Party</th><th>Subject</th><th>Category</th><th>Status</th><th>Last activity</th></tr></thead>
          <tbody>
            <tr *ngFor="let ticket of visibleTickets">
              <td><a [routerLink]="['/customer-portal/support', ticket.Id]">{{ ticket.TicketId }}</a></td>
              <td>{{ ticket.PartyName }}</td>
              <td>{{ ticket.Subject }}</td>
              <td>{{ ticket.CategoryCode }}</td>
              <td><span class="status">{{ formatStatus(ticket.StatusCode) }}</span></td>
              <td>{{ ticket.LastActivityAtUtc | date:'medium' }}</td>
            </tr>
          </tbody>
        </table>
        <ng-template #emptyState>
          <p class="state">{{ activeTab === 'active' ? 'You have no active support tickets.' : 'You have no completed support tickets.' }}</p>
        </ng-template>
      </div>
    </section>
    `,
    styles: [workspaceStyles, `
      .primary-action{display:inline-flex;align-items:center;justify-content:center;padding:.7rem 1rem;border-radius:.45rem;background:#1d6f8c;color:#fff;text-decoration:none;font-weight:700;white-space:nowrap}
      .ticket-tabs{display:flex;gap:.25rem;padding:.75rem .75rem 0;border-bottom:1px solid var(--surface-border)}
      .ticket-tabs button{border:0;border-bottom:2px solid transparent;background:transparent;padding:.65rem .85rem;color:var(--text-color-secondary);font-weight:700;cursor:pointer}
      .ticket-tabs button.selected{border-bottom-color:#1d6f8c;color:#1d6f8c}
      .ticket-tabs span{margin-left:.3rem;padding:.1rem .45rem;border-radius:1rem;background:var(--surface-ground);font-size:.75rem}
      @media(max-width:640px){.primary-action{width:100%}.ticket-tabs{overflow:auto}table{min-width:760px}}
    `]
})
export class CustomerPortalSupportComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    tickets: CustomerPortalSupportTicket[] = [];
    activeTab: 'active' | 'completed' = 'active';
    loading = true;
    error = '';

    constructor(private readonly workspace: CustomerPortalWorkspaceService) {}

    ngOnInit(): void {
        this.workspace.supportTickets().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: tickets => this.tickets = tickets || [],
            error: () => {
                this.error = 'Support tickets could not be loaded.';
                this.loading = false;
            },
            complete: () => this.loading = false
        });
    }

    get activeTickets(): CustomerPortalSupportTicket[] {
        return this.tickets.filter(ticket => !this.isCompleted(ticket));
    }

    get completedTickets(): CustomerPortalSupportTicket[] {
        return this.tickets.filter(ticket => this.isCompleted(ticket));
    }

    get visibleTickets(): CustomerPortalSupportTicket[] {
        return this.activeTab === 'active' ? this.activeTickets : this.completedTickets;
    }

    formatStatus(status: string): string {
        return (status || '').replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, character => character.toUpperCase());
    }

    private isCompleted(ticket: CustomerPortalSupportTicket): boolean {
        return ['RESOLVED', 'CLOSED', 'CANCELLED'].includes((ticket.StatusCode || '').trim().toUpperCase());
    }
}
