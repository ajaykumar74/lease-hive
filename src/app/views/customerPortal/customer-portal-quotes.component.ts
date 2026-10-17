import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { CustomerPortalQuote, CustomerPortalWorkspaceService } from './customer-portal-workspace.service';
import { workspaceStyles } from './customer-portal-contracts.component';

type QuoteTab = 'active' | 'history';
type QuoteDecision = 'ACCEPTED' | 'REJECTED';

@Component({
    selector: 'app-customer-portal-quotes',
    standalone: true,
    imports: [CommonModule, RouterLink, DatePipe, CurrencyPipe],
    template: `
        <section class="portal-workspace">
            <div class="heading">
                <div>
                    <p class="eyebrow">Customer Portal</p>
                    <h1>Quotations</h1>
                    <p>Review lease quotations issued to your party and record an authorised decision.</p>
                </div>
                <a routerLink="/customer-portal/dashboard">Dashboard</a>
            </div>

            <p *ngIf="loading" class="state">Loading quotations…</p>
            <p *ngIf="error" class="error">{{ error }}</p>
            <p *ngIf="notice" class="success">{{ notice }}</p>

            <div class="table-card" *ngIf="!loading && !error">
                <div class="quote-tabs" role="tablist" aria-label="Quotation status">
                    <button type="button" role="tab" [attr.aria-selected]="activeTab === 'active'" [class.selected]="activeTab === 'active'" (click)="activeTab = 'active'">
                        Active <span>{{ activeQuotes.length }}</span>
                    </button>
                    <button type="button" role="tab" [attr.aria-selected]="activeTab === 'history'" [class.selected]="activeTab === 'history'" (click)="activeTab = 'history'">
                        History <span>{{ historyQuotes.length }}</span>
                    </button>
                </div>

                <p *ngIf="activeTab === 'active' && !isAdministrator" class="admin-note">Only a customer portal administrator can accept or reject a quotation.</p>

                <table *ngIf="visibleQuotes.length; else emptyState">
                    <thead *ngIf="activeTab === 'active'">
                        <tr>
                            <th>Quotation</th>
                            <th>Issued</th>
                            <th>Valid until</th>
                            <th>Lease terms</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <thead *ngIf="activeTab === 'history'">
                        <tr>
                            <th>Quotation</th>
                            <th>Status</th>
                            <th>Decision / expiry</th>
                            <th>Lease terms</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let quote of visibleQuotes">
                            <td>
                                <strong>{{ quote.QuoteNumber }}</strong>
                                <br /><small *ngIf="quote.VersionNo">Version {{ quote.VersionNo }}</small>
                            </td>
                            <ng-container *ngIf="activeTab === 'active'; else historyRow">
                                <td>{{ quote.QuoteDate | date: 'mediumDate' }}</td>
                                <td>
                                    <strong>{{ quote.ValidUntil | date: 'mediumDate' }}</strong>
                                </td>
                                <td>
                                    {{ quote.RequestedTermMonths }} months<br /><small>{{ quote.BillingFrequency || 'Billing frequency not specified' }}</small>
                                </td>
                                <td>
                                    <strong>{{ quote.TotalAmount | currency: quote.CurrencyCode : 'symbol' : '1.2-2' }}</strong
                                    ><br /><small *ngIf="quote.SecurityDepositAmount">Deposit {{ quote.SecurityDepositAmount | currency: quote.CurrencyCode : 'symbol' : '1.2-2' }}</small>
                                </td>
                                <td class="quote-actions">
                                    <ng-container *ngIf="isAdministrator; else viewOnly">
                                        <button type="button" class="accept" (click)="startDecision(quote, 'ACCEPTED')">Accept</button>
                                        <button type="button" class="reject" (click)="startDecision(quote, 'REJECTED')">Reject</button>
                                    </ng-container>
                                    <ng-template #viewOnly><span class="text-muted">View only</span></ng-template>
                                </td>
                            </ng-container>
                            <ng-template #historyRow>
                                <td>
                                    <span class="status" [class.status-rejected]="quote.StatusCode === 'REJECTED'">{{ quote.StatusName }}</span>
                                </td>
                                <td>
                                    <span *ngIf="quote.DecisionDateTime">{{ quote.DecisionDateTime | date: 'medium' }}</span>
                                    <span *ngIf="!quote.DecisionDateTime && quote.StatusCode === 'EXPIRED'">Expired {{ quote.ValidUntil | date: 'mediumDate' }}</span>
                                    <span *ngIf="!quote.DecisionDateTime && quote.StatusCode !== 'EXPIRED'">—</span>
                                    <br /><small *ngIf="quote.DecisionRemarks">{{ quote.DecisionRemarks }}</small>
                                </td>
                                <td>
                                    {{ quote.RequestedTermMonths }} months<br /><small>{{ quote.BillingFrequency || 'Billing frequency not specified' }}</small>
                                </td>
                                <td>
                                    <strong>{{ quote.TotalAmount | currency: quote.CurrencyCode : 'symbol' : '1.2-2' }}</strong>
                                </td>
                            </ng-template>
                        </tr>
                    </tbody>
                </table>

                <ng-template #emptyState>
                    <p class="state">{{ activeTab === 'active' ? 'There are no issued quotations awaiting a decision.' : 'There are no historical quotations for your party.' }}</p>
                </ng-template>
            </div>

            <section *ngIf="selectedQuote" class="decision-panel" role="dialog" aria-modal="true" aria-labelledby="quote-decision-title">
                <div>
                    <p class="eyebrow">Customer decision</p>
                    <h2 id="quote-decision-title">{{ decisionCode === 'ACCEPTED' ? 'Accept' : 'Reject' }} {{ selectedQuote.QuoteNumber }}</h2>
                    <p *ngIf="decisionCode === 'ACCEPTED'">By confirming, you record your party’s acceptance of this quotation.</p>
                    <p *ngIf="decisionCode === 'REJECTED'">You can optionally tell the lease team why this quotation is being rejected.</p>
                </div>
                <label for="quote-decision-remarks">Remarks <span>(optional)</span></label>
                <textarea id="quote-decision-remarks" rows="3" maxlength="100" [value]="remarks" [disabled]="submitting" (input)="remarks = $any($event.target).value" placeholder="Add a short note for the lease team"></textarea>
                <small>{{ remarks.length }}/100</small>
                <p *ngIf="decisionError" class="error">{{ decisionError }}</p>
                <div class="decision-actions">
                    <button type="button" class="secondary" [disabled]="submitting" (click)="cancelDecision()">Cancel</button>
                    <button type="button" [class.accept]="decisionCode === 'ACCEPTED'" [class.reject]="decisionCode === 'REJECTED'" [disabled]="submitting" (click)="submitDecision()">
                        {{ submitting ? 'Saving…' : decisionCode === 'ACCEPTED' ? 'Confirm acceptance' : 'Confirm rejection' }}
                    </button>
                </div>
            </section>
        </section>
    `,
    styles: [
        workspaceStyles,
        `
            .quote-tabs {
                display: flex;
                gap: 0.25rem;
                padding: 0.75rem 0.75rem 0;
                border-bottom: 1px solid var(--surface-border);
            }
            .quote-tabs button {
                border: 0;
                border-bottom: 2px solid transparent;
                background: transparent;
                padding: 0.65rem 0.85rem;
                color: var(--text-color-secondary);
                font-weight: 700;
                cursor: pointer;
            }
            .quote-tabs button.selected {
                border-bottom-color: #1d6f8c;
                color: #1d6f8c;
            }
            .quote-tabs span {
                margin-left: 0.3rem;
                padding: 0.1rem 0.45rem;
                border-radius: 1rem;
                background: var(--surface-ground);
                font-size: 0.75rem;
            }
            .admin-note {
                margin: 1rem;
                padding: 0.75rem 1rem;
                border-left: 3px solid #1d6f8c;
                background: #f0f9fc;
                color: #165a72;
            }
            .quote-actions {
                display: flex;
                gap: 0.5rem;
                white-space: nowrap;
            }
            .quote-actions button,
            .decision-actions button {
                border: 0;
                border-radius: 0.4rem;
                padding: 0.55rem 0.75rem;
                font: inherit;
                font-weight: 700;
                cursor: pointer;
            }
            .accept {
                background: #197044;
                color: #fff;
            }
            .reject {
                background: #b42318;
                color: #fff;
            }
            .secondary {
                background: var(--surface-ground);
                color: var(--text-color);
            }
            button:disabled {
                cursor: not-allowed;
                opacity: 0.65;
            }
            .text-muted {
                color: var(--text-color-secondary);
            }
            .status-rejected {
                background: #fff1f2;
                color: #b42318;
            }
            .success {
                padding: 1rem;
                border-radius: 0.5rem;
                background: #ecfdf3;
                color: #067647;
            }
            .decision-panel {
                margin-top: 1.25rem;
                padding: 1.25rem;
                border: 1px solid #1d6f8c;
                border-radius: 0.75rem;
                background: var(--surface-card);
                box-shadow: 0 8px 20px rgb(0 0 0 / 0.08);
            }
            .decision-panel h2 {
                margin: 0.2rem 0 0.5rem;
            }
            .decision-panel p {
                margin: 0.3rem 0 1rem;
            }
            .decision-panel label {
                display: block;
                font-weight: 700;
                margin-top: 1rem;
            }
            .decision-panel label span,
            .decision-panel small {
                color: var(--text-color-secondary);
                font-weight: 400;
            }
            .decision-panel textarea {
                box-sizing: border-box;
                display: block;
                width: 100%;
                margin-top: 0.45rem;
                padding: 0.65rem;
                border: 1px solid var(--surface-border);
                border-radius: 0.4rem;
                font: inherit;
                resize: vertical;
            }
            .decision-actions {
                display: flex;
                justify-content: flex-end;
                gap: 0.65rem;
                margin-top: 1rem;
            }
            @media (max-width: 640px) {
                table {
                    min-width: 780px;
                }
                .quote-actions {
                    flex-direction: column;
                }
                .decision-actions {
                    flex-direction: column-reverse;
                }
                .decision-actions button {
                    width: 100%;
                }
            }
        `
    ]
})
export class CustomerPortalQuotesComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    quotes: CustomerPortalQuote[] = [];
    activeTab: QuoteTab = 'active';
    selectedQuote?: CustomerPortalQuote;
    decisionCode: QuoteDecision = 'ACCEPTED';
    remarks = '';
    loading = true;
    submitting = false;
    error = '';
    decisionError = '';
    notice = '';

    constructor(
        private readonly loggedInUserService: LoggedInUserService,
        private readonly workspace: CustomerPortalWorkspaceService
    ) {}

    ngOnInit(): void {
        this.loadQuotes();
    }

    get isAdministrator(): boolean {
        return this.loggedInUserService.isCustomerPortalAdmin;
    }

    get activeQuotes(): CustomerPortalQuote[] {
        return this.quotes.filter((quote) => quote.CanRespond);
    }

    get historyQuotes(): CustomerPortalQuote[] {
        return this.quotes.filter((quote) => !quote.CanRespond);
    }

    get visibleQuotes(): CustomerPortalQuote[] {
        return this.activeTab === 'active' ? this.activeQuotes : this.historyQuotes;
    }

    startDecision(quote: CustomerPortalQuote, decisionCode: QuoteDecision): void {
        if (!this.isAdministrator || !quote.CanRespond) {
            return;
        }

        this.selectedQuote = quote;
        this.decisionCode = decisionCode;
        this.remarks = '';
        this.decisionError = '';
    }

    cancelDecision(): void {
        if (this.submitting) {
            return;
        }

        this.selectedQuote = undefined;
        this.remarks = '';
        this.decisionError = '';
    }

    submitDecision(): void {
        if (!this.selectedQuote || this.submitting) {
            return;
        }

        this.submitting = true;
        this.decisionError = '';
        this.workspace
            .decideQuote(this.selectedQuote.QuoteId, this.decisionCode, this.remarks)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (result) => {
                    this.notice = `${result.StatusName || this.formatDecision(this.decisionCode)} recorded for ${this.selectedQuote?.QuoteNumber}.`;
                    this.activeTab = 'history';
                    this.selectedQuote = undefined;
                    this.remarks = '';
                    this.loadQuotes();
                },
                error: (error) => {
                    this.decisionError = this.errorMessage(error, 'The quotation decision could not be saved.');
                    this.submitting = false;
                }
            });
    }

    private loadQuotes(): void {
        this.loading = true;
        this.error = '';
        this.workspace
            .quotes()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (quotes) => (this.quotes = quotes || []),
                error: (error) => {
                    this.error = this.errorMessage(error, 'Quotations could not be loaded.');
                    this.loading = false;
                    this.submitting = false;
                },
                complete: () => {
                    this.loading = false;
                    this.submitting = false;
                }
            });
    }

    private formatDecision(decision: QuoteDecision): string {
        return decision === 'ACCEPTED' ? 'Acceptance' : 'Rejection';
    }

    private errorMessage(error: any, fallback: string): string {
        if (typeof error === 'string' && error.trim()) {
            return error;
        }

        const body = error?.error;
        if (Array.isArray(body) && body.length) {
            return body.join(' ');
        }

        return body?.ErrorMessage ?? body?.message ?? error?.message ?? fallback;
    }
}
