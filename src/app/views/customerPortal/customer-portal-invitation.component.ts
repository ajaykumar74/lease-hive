import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, startWith, switchMap } from 'rxjs';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { CustomerPortalInvitationService } from './customer-portal-invitation.service';

/** Tenant-admin form for granting party-scoped customer or supplier portal access. */
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
        PortalType: new FormControl<'Customer' | 'Supplier'>('Customer', { nonNullable: true }),
        PartyId: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
        PartyContactId: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
        PortalRole: new FormControl<'CUSTOMER_PORTAL_ADMIN' | 'CUSTOMER_PORTAL_USER' | 'SUPPLIER_PORTAL_ADMIN' | 'SUPPLIER_PORTAL_USER'>('CUSTOMER_PORTAL_ADMIN', { nonNullable: true }),
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
        const partyId = Number(this.route.snapshot.queryParamMap.get('partyId'));
        this.form.controls.PortalType.valueChanges.pipe(
            startWith(this.form.controls.PortalType.value),
            switchMap(portalType => {
                this.form.controls.PartyId.setValue(null, { emitEvent: false });
                this.form.controls.PartyContactId.setValue(null, { emitEvent: false });
                this.contactOptions = [];
                this.partyOptions = [];
                this.form.controls.PortalRole.setValue(
                    portalType === 'Supplier' ? 'SUPPLIER_PORTAL_ADMIN' : 'CUSTOMER_PORTAL_ADMIN',
                    { emitEvent: false }
                );
                return this.loggedInUserService.getEntityLookupOptions(
                    portalType === 'Supplier' ? 'supplier-parties' : 'customer-parties'
                );
            }),
            catchError(() => {
                this.error = 'Unable to load parties for the selected portal type.';
                return of([]);
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(options => {
            this.partyOptions = options;
            if (partyId > 0 && this.form.controls.PortalType.value === 'Customer') {
                this.form.controls.PartyId.setValue(partyId);
            }
        });

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
            PortalType: value.PortalType,
            PartyId: Number(value.PartyId),
            PartyContactId: Number(value.PartyContactId),
            PortalRole: value.PortalRole,
            PartyLocationId: Number(value.PartyLocationId) || 0,
            CustomerDepartmentId: Number(value.CustomerDepartmentId) || 0
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: response => {
                this.message = response?.Message || 'Invitation created. The contact will receive an activation email.';
                this.form.reset({
                    PortalType: value.PortalType,
                    PartyId: value.PartyId,
                    PartyContactId: null,
                    PortalRole: value.PortalType === 'Supplier' ? 'SUPPLIER_PORTAL_ADMIN' : 'CUSTOMER_PORTAL_ADMIN',
                    PartyLocationId: null,
                    CustomerDepartmentId: null
                });
            },
            error: error => this.error = error?.error?.Errors?.join(' ') || error?.error?.errors?.join(' ') || 'The invitation could not be sent.',
            complete: () => this.submitting = false
        });
    }

    get isSupplierPortal(): boolean {
        return this.form.controls.PortalType.value === 'Supplier';
    }

    cancel(): void {
        const partyId = Number(this.form.controls.PartyId.value);
        this.router.navigate(partyId > 0 ? ['/business/parties/view', partyId] : ['/business/parties']);
    }
}
