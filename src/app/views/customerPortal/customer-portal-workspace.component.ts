import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
    selector: 'app-customer-portal-workspace',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
        <section class="workspace">
            <p class="eyebrow">Customer Portal</p>
            <h1>{{ title }}</h1>
            <p>{{ description }}</p>
            <div class="workspace-note"><i class="pi pi-lock"></i><span>Data in this area is restricted to the party or party location assigned to your account.</span></div>
            <a routerLink="/customer-portal/dashboard">Back to dashboard</a>
        </section>`,
    styles: [`.workspace{max-width:920px;margin:0 auto;padding:2rem}.workspace h1{margin:.25rem 0 .75rem}.workspace-note{display:flex;gap:.75rem;align-items:center;margin:1.5rem 0;padding:1rem;border:1px solid var(--surface-border);border-radius:.5rem;background:var(--surface-card)}.workspace-note i{color:#1d6f8c}.eyebrow{text-transform:uppercase;font-size:.75rem;font-weight:700;letter-spacing:.08em;color:#1d6f8c}`]
})
export class CustomerPortalWorkspaceComponent {
    private readonly route = inject(ActivatedRoute);
    readonly title = this.route.snapshot.data['title'] || 'Customer Portal';
    readonly description = this.route.snapshot.data['description'] || 'This workspace is being prepared for your organisation.';
}
