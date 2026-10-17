import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, startWith, switchMap } from 'rxjs';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { CustomerPortalInvitationService } from './customer-portal-invitation.service';

/** Tenant-admin-only form for granting party-scoped customer portal access. */
@Component({
    selector: 'app-customer-portal-invitation',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './customer-portal-invitation.component.html',
    styleUrls: ['./customer-portal-invitation.component.css']
})
export class CustomerPortalInvitationComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    partyOptions: ISelectItem[] = [];
    contactOptions: ISelectItem[] = [];
    submitting = false;
    message = '';
    error = '';

    readonly form = new FormGroup({
        PartyId: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
        PartyContactId: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
        PortalRole: new FormControl<'CUSTOMER_PORTAL_ADMIN' | 'CUSTOMER_PORTAL_USER'>('CUSTOMER_PORTAL_ADMIN', { nonNullable: true }),
        PartyLocationId: new FormControl<number | null>(null),
        CustomerDepartmentId: new FormControl<number | null>(null)
    });

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly loggedInUserService: LoggedInUserService,
        private readonly invitationService: CustomerPortalInvitationService
    ) {}

    ngOnInit(): void {
        this.loggedInUserService.getEntityLookupOptions('parties').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: options => this.partyOptions = options,
            error: () => this.error = 'Unable to load parties.'
        });

        const partyId = Number(this.route.snapshot.queryParamMap.get('partyId'));
        if (partyId > 0) this.form.controls.PartyId.setValue(partyId);

        this.form.controls.PartyId.valueChanges.pipe(
            startWith(this.form.controls.PartyId.value),
            switchMap(value => {
                this.form.controls.PartyContactId.setValue(null, { emitEvent: false });
                this.contactOptions = [];
                const selectedPartyId = Number(value);
                return selectedPartyId > 0
                    ? this.loggedInUserService.getEntityLookupOptions('party-contacts', undefined, { PartyId: selectedPartyId })
                    : of([]);
            }),
            catchError(() => {
                this.error = 'Unable to load contacts for this party.';
                return of([]);
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(options => this.contactOptions = options);
    }

    submit(): void {
        this.message = '';
        this.error = '';
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.submitting = true;
        const value = this.form.getRawValue();
        this.invitationService.send({
            PartyId: Number(value.PartyId),
            PartyContactId: Number(value.PartyContactId),
            PortalRole: value.PortalRole,
            PartyLocationId: Number(value.PartyLocationId) || 0,
            CustomerDepartmentId: Number(value.CustomerDepartmentId) || 0
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: response => {
                this.message = response?.Message || 'Invitation created. The contact will receive an activation email.';
                this.form.reset({ PartyId: value.PartyId, PartyContactId: null, PortalRole: 'CUSTOMER_PORTAL_ADMIN', PartyLocationId: null, CustomerDepartmentId: null });
            },
            error: error => this.error = error?.error?.Errors?.join(' ') || error?.error?.errors?.join(' ') || 'The invitation could not be sent.',
            complete: () => this.submitting = false
        });
    }

    cancel(): void {
        const partyId = Number(this.form.controls.PartyId.value);
        this.router.navigate(partyId > 0 ? ['/business/parties/view', partyId] : ['/business/parties']);
    }
}
