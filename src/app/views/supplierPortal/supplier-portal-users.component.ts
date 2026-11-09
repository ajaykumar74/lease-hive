import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, forkJoin, of, startWith, switchMap } from 'rxjs';
import { SupplierPortalLookupItem, SupplierPortalService, SupplierPortalUser } from './supplier-portal.service';

@Component({
    selector: 'app-supplier-portal-users',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './supplier-portal-users.component.html',
    styleUrls: ['./supplier-portal-users.component.css']
})
export class SupplierPortalUsersComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    partyOptions: SupplierPortalLookupItem[] = [];
    contactOptions: SupplierPortalLookupItem[] = [];
    users: SupplierPortalUser[] = [];
    message = '';
    error = '';
    submitting = false;
    resendingInvitationId?: number;
    deactivatingUserId?: number;

    readonly form = new FormGroup({
        PartyId: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
        PartyContactId: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
        PortalRole: new FormControl<'SUPPLIER_PORTAL_ADMIN' | 'SUPPLIER_PORTAL_USER'>('SUPPLIER_PORTAL_USER', { nonNullable: true })
    });

    constructor(private readonly supplierPortal: SupplierPortalService) {}

    ngOnInit(): void {
        this.supplierPortal.parties().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: parties => this.partyOptions = parties,
            error: () => this.error = 'Unable to load your assigned supplier parties.'
        });

        this.form.controls.PartyId.valueChanges.pipe(
            startWith(this.form.controls.PartyId.value),
            switchMap(partyId => {
                this.form.controls.PartyContactId.setValue(null, { emitEvent: false });
                this.contactOptions = [];
                this.users = [];
                return partyId && partyId > 0
                    ? forkJoin({ contacts: this.supplierPortal.contacts(partyId), users: this.supplierPortal.users(partyId) })
                    : of({ contacts: [], users: [] });
            }),
            catchError(() => {
                this.error = 'Unable to load supplier users and authorised contacts for this party.';
                return of({ contacts: [], users: [] });
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(result => {
            this.contactOptions = result.contacts;
            this.users = result.users;
        });
    }

    invite(): void {
        this.message = '';
        this.error = '';
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.submitting = true;
        const value = this.form.getRawValue();
        this.supplierPortal.invite({
            PartyId: Number(value.PartyId),
            PartyContactId: Number(value.PartyContactId),
            PortalRole: value.PortalRole
        }).pipe(
            finalize(() => this.submitting = false),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: response => {
                this.message = response?.Message || 'Supplier portal invitation created.';
                this.form.controls.PartyContactId.setValue(null);
                this.refreshUsers();
            },
            error: error => this.error = error?.error?.Errors?.join(' ') || 'The supplier portal invitation could not be sent.'
        });
    }

    resend(user: SupplierPortalUser): void {
        if (!user.InvitationId || !user.CanResend) return;
        this.message = '';
        this.error = '';
        this.resendingInvitationId = user.InvitationId;
        this.supplierPortal.resendInvitation(user.InvitationId).pipe(
            finalize(() => this.resendingInvitationId = undefined),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: response => {
                this.message = response?.Message || 'Activation invitation resent.';
                this.refreshUsers();
            },
            error: error => this.error = error?.error?.Errors?.join(' ') || 'The activation invitation could not be resent.'
        });
    }

    deactivate(user: SupplierPortalUser): void {
        const partyId = Number(this.form.controls.PartyId.value);
        if (!partyId || !user.ApplicationUserId || !confirm(`Deactivate ${user.DisplayName || user.Email}?`)) return;

        this.message = '';
        this.error = '';
        this.deactivatingUserId = user.ApplicationUserId;
        this.supplierPortal.deactivateUser(partyId, user.ApplicationUserId).pipe(
            finalize(() => this.deactivatingUserId = undefined),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: response => {
                this.message = response?.Message || 'Supplier user access has been deactivated.';
                this.refreshUsers();
            },
            error: error => this.error = error?.error?.Errors?.join(' ') || 'The supplier user could not be deactivated.'
        });
    }

    private refreshUsers(): void {
        const partyId = Number(this.form.controls.PartyId.value);
        if (!partyId) return;
        this.supplierPortal.users(partyId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: users => this.users = users,
            error: () => this.error = 'Supplier users could not be refreshed.'
        });
    }
}
