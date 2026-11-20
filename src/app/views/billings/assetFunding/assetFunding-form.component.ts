import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AssetFundingService } from './assetFunding.service';
import { IAssetFunding, IAssetFundingAllocation } from './assetFunding';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { MessageComponent } from '@/shared/message.component';
@Component({ selector: 'app-asset-funding-form', standalone: false, templateUrl: './assetFunding-form.component.html' })
export class AssetFundingFormComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly fb = inject(FormBuilder);
    readonly types = ['SELF_FUNDED', 'BANK_LOAN', 'NBFC_LOAN', 'SUPPLIER_CREDIT', 'OTHER']; readonly statuses = ['DRAFT', 'APPROVED', 'PARTIALLY_DISBURSED', 'ACTIVE', 'CLOSED', 'CANCELLED']; readonly frequencies = ['MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY', 'BULLET', 'OTHER'];
    organisationOptions: any[] = []; lenderOptions: any[] = []; loading = false; id?: number;
    caption = 'Create Asset Funding';
    @ViewChild(MessageComponent) private messageService?: MessageComponent;
    form = this.fb.group({ organisationId: [0, [Validators.required, Validators.min(1)]], lenderPartyId: [null as number | null], fundingType: ['SELF_FUNDED', Validators.required], fundingNumber: ['', [Validators.required, Validators.maxLength(60)]], agreementReference: [''], currencyCode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]], approvedAmount: [0, [Validators.required, Validators.min(0.01)]], interestRate: [null as number | null, [Validators.min(0), Validators.max(100)]], interestType: [''], tenureMonths: [null as number | null, [Validators.min(1)]], startDate: [null as Date | null], maturityDate: [null as Date | null], repaymentFrequency: ['MONTHLY'], fundingStatus: ['DRAFT', Validators.required], remarks: [''], rowVersionStr: [''], allocations: this.fb.array([]) });
    constructor(private route: ActivatedRoute, private router: Router, private service: AssetFundingService, private users: LoggedInUserService) {}
    get allocations(): FormArray { return this.form.controls.allocations; }
    ngOnInit(): void {
        this.users.bindEntityLookup(this.form, 'organisationId', 'organisations', x => this.organisationOptions = x, error => setTimeout(() => this.messageService?.showError(error)), this.destroyRef);
        this.users.bindEntityLookup(this.form, 'lenderPartyId', 'parties', x => this.lenderOptions = x, error => setTimeout(() => this.messageService?.showError(error)), this.destroyRef);
        this.form.controls.startDate.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.populateMaturityDate());
        this.form.controls.tenureMonths.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.populateMaturityDate());
        this.id = Number(this.route.snapshot.paramMap.get('id')) || undefined;
        this.caption = this.id ? 'Edit Asset Funding' : 'Create Asset Funding';
        if (this.id) this.load(this.id);
    }
    addAllocation(value?: any): void {
        this.allocations.push(this.fb.group({
            assetId: [value?.assetId || 0, [Validators.required, Validators.min(1)]],
            allocatedAmount: [value?.allocatedAmount || 0, [Validators.required, Validators.min(0.01)]],
            allocationDate: [value ? this.parseAllocationDate(value.allocationDate) : new Date(), Validators.required],
            remarks: [value?.remarks || '']
        }));
    }
    removeAllocation(index: number): void { this.allocations.removeAt(index); }
    onOptionItemClicked(action: string): void {
        if (action === 'Save') this.save();
        if (action === 'Cancel') this.resetForm();
    }
    save(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.messageService?.showError('Please correct the highlighted fields before saving.');
            return;
        }
        const request: Partial<IAssetFunding> = { ...this.form.getRawValue(), allocations: this.allocationRequestValues() };
        this.loading = true;
        const save = this.id ? this.service.update(this.id, request) : this.service.create(request);
        save.subscribe({
            next: value => {
                this.messageService?.showSuccess(this.id ? 'Asset funding updated successfully.' : 'Asset funding created successfully.');
                setTimeout(() => this.router.navigate(['/billing-finance/funding', value.id]), 1000);
            },
            complete: () => this.loading = false,
            error: error => {
                this.loading = false;
                this.messageService?.showError(error);
            }
        });
    }
    private resetForm(): void { this.form.reset({ organisationId: 0, lenderPartyId: null, fundingType: 'SELF_FUNDED', fundingNumber: '', agreementReference: '', currencyCode: '', approvedAmount: 0, interestRate: null, interestType: '', tenureMonths: null, startDate: null, maturityDate: null, repaymentFrequency: 'MONTHLY', fundingStatus: 'DRAFT', remarks: '', rowVersionStr: '' }); this.allocations.clear(); }
    private allocationRequestValues(): IAssetFundingAllocation[] { return this.allocations.controls.map(control => ({ assetId: Number(control.get('assetId')?.value), allocatedAmount: Number(control.get('allocatedAmount')?.value), allocationDate: control.get('allocationDate')?.value, remarks: control.get('remarks')?.value || undefined })); }
    private parseAllocationDate(value: unknown): Date | null {
        if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
        if (typeof value !== 'string' || !value.trim()) return null;

        const match = value.trim().match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})/);
        if (match) {
            const [, day, month, year] = match;
            const date = new Date(Number(year), Number(month) - 1, Number(day));
            return date.getFullYear() === Number(year) && date.getMonth() === Number(month) - 1 && date.getDate() === Number(day)
                ? date
                : null;
        }

        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    private populateMaturityDate(): void {
        const startDate = this.form.controls.startDate.value;
        const tenureMonths = Number(this.form.controls.tenureMonths.value);
        if (!startDate || !Number.isInteger(tenureMonths) || tenureMonths < 1) {
            this.form.controls.maturityDate.setValue(null, { emitEvent: false });
            return;
        }

        const start = new Date(startDate);
        if (Number.isNaN(start.getTime())) {
            this.form.controls.maturityDate.setValue(null, { emitEvent: false });
            return;
        }
        const targetMonth = start.getMonth() + tenureMonths;
        const year = start.getFullYear() + Math.floor(targetMonth / 12);
        const month = targetMonth % 12;
        const lastDayOfTargetMonth = new Date(year, month + 1, 0).getDate();
        this.form.controls.maturityDate.setValue(new Date(year, month, Math.min(start.getDate(), lastDayOfTargetMonth)), { emitEvent: false });
    }
    private load(id: number): void {
        this.loading = true;
        this.service.get(id).subscribe({
            next: value => {
                this.form.patchValue(value, { emitEvent: false });
                this.populateMaturityDate();
                value.allocations?.forEach(x => this.addAllocation(x));
            },
            complete: () => this.loading = false,
            error: error => {
                this.loading = false;
                this.messageService?.showError(error);
            }
        });
    }
}
