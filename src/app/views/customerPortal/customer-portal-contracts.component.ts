import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CustomerPortalContract, CustomerPortalWorkspaceService } from './customer-portal-workspace.service';

export const workspaceStyles = `.portal-workspace{max-width:1180px;margin:0 auto;padding:1.5rem}.heading{display:flex;justify-content:space-between;gap:1rem;align-items:flex-start;margin-bottom:1.25rem}.heading h1{margin:.15rem 0 .35rem}.heading p{margin:0;color:var(--text-color-secondary)}.heading>a{font-weight:700;color:#1d6f8c;text-decoration:none}.eyebrow{text-transform:uppercase;font-size:.75rem;font-weight:700;letter-spacing:.08em;color:#1d6f8c}.table-card{overflow:auto;border:1px solid var(--surface-border);border-radius:.75rem;background:var(--surface-card)}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:1rem;border-bottom:1px solid var(--surface-border);vertical-align:top}th{font-size:.78rem;text-transform:uppercase;letter-spacing:.05em;color:var(--text-color-secondary)}tbody tr:last-child td{border-bottom:0}small{color:var(--text-color-secondary)}a{color:#1d6f8c;font-weight:700}.status{display:inline-block;padding:.25rem .55rem;border-radius:1rem;background:#e7f5fb;color:#165a72;font-size:.8rem;font-weight:700}.state{padding:1.25rem;color:var(--text-color-secondary)}.error{padding:1rem;border-radius:.5rem;background:#fff1f2;color:#b42318}@media(max-width:640px){.portal-workspace{padding:1rem}.heading{flex-direction:column}th,td{padding:.7rem}}`;

@Component({
    selector: 'app-customer-portal-contracts',
    standalone: true,
    imports: [CommonModule, RouterLink, DatePipe],
    template: `
    <section class="portal-workspace">
      <div class="heading"><div><p class="eyebrow">Customer Portal</p><h1>Contracts</h1><p>Your active and historical lease agreements.</p></div><a routerLink="/customer-portal/dashboard">Dashboard</a></div>
      <p *ngIf="loading" class="state">Loading contracts…</p><p *ngIf="error" class="error">{{ error }}</p>
      <div class="table-card" *ngIf="!loading && !error"><table *ngIf="contracts.length; else empty"><thead><tr><th>Contract</th><th>Status</th><th>Lease period</th><th>Assets</th><th></th></tr></thead><tbody><tr *ngFor="let contract of contracts"><td><strong>{{ contract.ContractNo }}</strong><br><small>{{ contract.ContractTitle || 'Lease agreement' }}</small></td><td><span class="status">{{ contract.Status }}</span></td><td>{{ contract.CommencementDate | date:'mediumDate' }}<span *ngIf="contract.MaturityDate"> – {{ contract.MaturityDate | date:'mediumDate' }}</span></td><td>{{ contract.AssetCount }}</td><td><a [routerLink]="['/customer-portal/contracts', contract.ContractId]">View</a></td></tr></tbody></table><ng-template #empty><p class="state">No lease contracts are currently available for your party.</p></ng-template></div>
    </section>`,
    styles: [workspaceStyles]
})
export class CustomerPortalContractsComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef); contracts: CustomerPortalContract[] = []; loading = true; error = '';
    constructor(private readonly workspace: CustomerPortalWorkspaceService) {}
    ngOnInit(): void { this.workspace.contracts().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: value => this.contracts = value || [], error: () => { this.error = 'Contracts could not be loaded.'; this.loading = false; }, complete: () => this.loading = false }); }
}

