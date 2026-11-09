import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, skip, switchMap } from 'rxjs';
import { SupplierPortalProfile, SupplierPortalService } from './supplier-portal.service';

@Component({
    selector: 'app-supplier-portal-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './supplier-portal-profile.component.html',
    styleUrls: ['./supplier-portal-profile.component.css']
})
export class SupplierPortalProfileComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    profile?: SupplierPortalProfile;
    loading = true;
    saving = false;
    error = '';
    message = '';

    readonly form = new FormGroup({
        PartyId: new FormControl<number | null>(null, Validators.required),
        TradeName: new FormControl(''),
        WebsiteUrl: new FormControl(''),
        PreferredCurrencyCode: new FormControl(''),
        Description: new FormControl(''),
        MobileCountryCode: new FormControl(''),
        MobileNumber: new FormControl(''),
        PhoneNumber: new FormControl(''),
        PreferredContactMethod: new FormControl('')
    });

    constructor(private readonly supplierPortal: SupplierPortalService) {}

    ngOnInit(): void {
        this.loadProfile();
        this.form.controls.PartyId.valueChanges.pipe(
            skip(1),
            switchMap(partyId => this.supplierPortal.profile(Number(partyId))),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({ next: profile => this.applyProfile(profile), error: () => this.error = 'Unable to load this supplier party profile.' });
    }

    save(): void {
        if (this.form.invalid || !this.profile) return;
        this.saving = true;
        this.message = '';
        this.error = '';
        const value = this.form.getRawValue();
        this.supplierPortal.updateProfile({
            PartyId: Number(value.PartyId), TradeName: value.TradeName || '', WebsiteUrl: value.WebsiteUrl || '',
            PreferredCurrencyCode: value.PreferredCurrencyCode || '', Description: value.Description || '',
            MobileCountryCode: value.MobileCountryCode || '', MobileNumber: value.MobileNumber || '',
            PhoneNumber: value.PhoneNumber || '', PreferredContactMethod: value.PreferredContactMethod || ''
        }).pipe(finalize(() => this.saving = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: response => { this.message = response?.Message || 'Supplier profile updated.'; this.loadProfile(Number(value.PartyId)); },
            error: error => this.error = error?.error?.Errors?.join(' ') || 'The supplier profile could not be updated.'
        });
    }

    private loadProfile(partyId?: number): void {
        this.loading = true;
        this.supplierPortal.profile(partyId).pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: profile => this.applyProfile(profile),
            error: () => this.error = 'Unable to load your supplier profile.'
        });
    }

    private applyProfile(profile: SupplierPortalProfile): void {
        this.profile = profile;
        this.form.patchValue({
            PartyId: profile.PartyId, TradeName: profile.TradeName, WebsiteUrl: profile.WebsiteUrl,
            PreferredCurrencyCode: profile.PreferredCurrencyCode, Description: profile.Description,
            MobileCountryCode: profile.MobileCountryCode, MobileNumber: profile.MobileNumber,
            PhoneNumber: profile.PhoneNumber, PreferredContactMethod: profile.PreferredContactMethod
        }, { emitEvent: false });
    }
}
