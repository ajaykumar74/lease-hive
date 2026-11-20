import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetFundingService } from './assetFunding.service';
import { IAssetFunding, IAssetFundingInstallmentBalance, IAssetFundingPaymentSummary, IAssetFundingScheduleLine, IAssetFundingSchedulePreview, IAssetFundingScheduleVersion, IAssetFundingTransaction, ISpreadsheetInspection } from './assetFunding';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { deserializeApiDate } from '@/shared/api-date.util';
import { HttpEventType } from '@angular/common/http';
import { filter, finalize, first, switchMap } from 'rxjs';
import { DocumentAttachmentService } from '@/shared/document-attachments/document-attachment.service';

interface PendingScheduleAttachment {
    fundingId: number;
    version: number;
    file: File;
    uploading: boolean;
    error: string;
}
@Component({ selector: 'app-asset-funding-view', standalone: false, templateUrl: './assetFunding-view.component.html', styleUrls: ['./assetFunding-view.component.css'] })
export class AssetFundingViewComponent implements OnInit {
    funding?: IAssetFunding;
    caption = 'Asset Funding Details';
    schedules: IAssetFundingScheduleVersion[] = []; activeTab: 'overview' | 'assets' | 'schedule' | 'payments' | 'documents' = 'overview'; wizardStep = 0; file?: File; inspection?: ISpreadsheetInspection; preview?: IAssetFundingSchedulePreview; selectedSheet = ''; headerRow = 1; mappings: Record<string, string> = {}; error = ''; loadingSchedule = false; manual = false;
    transactions: IAssetFundingTransaction[] = []; paymentSummary?: IAssetFundingPaymentSummary; installments: IAssetFundingInstallmentBalance[] = []; paymentOpen = false; loadingPayments = false;
    readonly fields = [{ key: 'installmentNumber', label: 'Installment number', required: true }, { key: 'dueDate', label: 'Due date', required: true }, { key: 'totalDue', label: 'Total due', required: true }, { key: 'openingPrincipal', label: 'Opening principal', required: false }, { key: 'principalDue', label: 'Principal due', required: false }, { key: 'interestDue', label: 'Interest due', required: false }, { key: 'chargesDue', label: 'Charges due', required: false }, { key: 'closingPrincipal', label: 'Closing principal', required: false }];
    manualForm!: FormGroup;
    paymentForm!: FormGroup;
    pendingScheduleAttachments: PendingScheduleAttachment[] = [];
    attachedScheduleFile = '';
    constructor(private route: ActivatedRoute, private router: Router, private service: AssetFundingService, private fb: FormBuilder, private documentAttachments: DocumentAttachmentService) { this.manualForm = this.fb.group({ lines: this.fb.array([]) }); this.paymentForm = this.fb.group({ transactionType: ['REPAYMENT', Validators.required], transactionDate: [new Date(), Validators.required], referenceNumber: [''], amount: [0, [Validators.required, Validators.min(0.0001)]], paymentMethod: ['BANK_TRANSFER'], principalComponent: [0, Validators.min(0)], interestComponent: [0, Validators.min(0)], chargesComponent: [0, Validators.min(0)], remarks: [''], allocations: this.fb.array([]) }); }
    ngOnInit(): void { const id = Number(this.route.snapshot.paramMap.get('id')); if (id) { this.service.get(id).subscribe(x => { this.funding = x; this.caption = `Asset Funding · ${x.fundingNumber}`; }); this.loadSchedules(id); this.loadPayments(id); } }
    edit(): void { if (this.funding) this.router.navigate(['/billing-finance/funding', this.funding.id, 'edit']); }
    get lines(): FormArray { return this.manualForm.get('lines') as FormArray; }
    selectTab(tab: 'overview' | 'assets' | 'schedule' | 'payments' | 'documents'): void { this.activeTab = tab; if (tab === 'payments') this.loadPayments(); }
    moveToStatus(status: string): void { if (!this.funding || this.funding.fundingStatus === status) return; const request = { ...this.funding, fundingStatus: status }; this.service.update(this.funding.id, request).subscribe({ next: funding => this.funding = funding, error: () => this.error = 'The funding status could not be changed. Refresh and try again.' }); }
    nextStatuses(): string[] { const current = this.funding?.fundingStatus; if (current === 'DRAFT') return ['APPROVED', 'CANCELLED']; if (current === 'APPROVED') return ['PARTIALLY_DISBURSED', 'ACTIVE', 'CANCELLED']; if (current === 'PARTIALLY_DISBURSED') return ['ACTIVE', 'CLOSED']; if (current === 'ACTIVE') return ['CLOSED']; return []; }
    formatDate(value: unknown): string {
        const date = this.parseDate(value);
        return date ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date) : '—';
    }
    loadSchedules(id = this.funding?.id): void { if (id) this.service.schedules(id).subscribe({ next: x => this.schedules = x, error: () => this.error = 'Unable to load repayment schedules.' }); }
    onFile(event: Event): void {
        const input = event.target as HTMLInputElement;
        const candidate = input.files?.[0];
        input.value = '';
        if (!candidate || this.loadingSchedule) return;

        this.error = '';
        if (!candidate.name.toLowerCase().endsWith('.xlsx')) {
            this.error = 'Select an .xlsx workbook.';
            return;
        }

        this.loadingSchedule = true;
        this.service.inspectSchedule(candidate).subscribe({
            next: result => {
                this.file = candidate;
                this.inspection = result;
                this.selectedSheet = result.worksheet || result.worksheets[0] || '';
                this.headerRow = result.headerRow ?? 1;
                this.preview = undefined;
                this.mappings = {};
                this.wizardStep = 1;
                this.loadingSchedule = false;
            },
            error: err => {
                this.error = String(err);
                this.loadingSchedule = false;
            }
        });
    }
    readHeaders(): void {
        if (!this.file || !this.selectedSheet || !Number.isInteger(this.headerRow) || this.headerRow < 1 || this.loadingSchedule) return;

        this.error = '';
        this.loadingSchedule = true;
        this.service.inspectSchedule(this.file, this.selectedSheet, this.headerRow).subscribe({
            next: result => {
                this.inspection = result;
                const suggestions = { ...result.suggestedMappings };
                const requiredColumns = new Set(this.fields.filter(field => field.required).map(field => suggestions[field.key]));
                for (const field of this.fields) {
                    if (!field.required && requiredColumns.has(suggestions[field.key])) delete suggestions[field.key];
                }
                this.mappings = suggestions;
                this.wizardStep = 2;
                this.loadingSchedule = false;
            },
            error: err => {
                this.error = String(err);
                this.loadingSchedule = false;
            }
        });
    }
    sampleFor(column: string): string { if (!this.inspection) return ''; const index = this.inspection.headers.indexOf(column); return index < 0 ? '' : (this.inspection.sampleRows[0]?.[index] ?? ''); }
    get mappingsComplete(): boolean {
        return this.fields.every(field => !field.required || !!this.mappings[field.key]);
    }

    mappingConflict(key: string): boolean {
        const column = this.mappings[key];
        return !!column && this.fields.some(field => field.key !== key && this.mappings[field.key] === column);
    }

    worksheetIssue(issue: string): string {
        return issue.replace(/^Row\s+(\d+)\s*:/i, 'Excel row $1:');
    }

    get hasWorksheetErrors(): boolean {
        return this.preview?.errors.some(issue => /^Row\s+\d+\s*:/i.test(issue)) ?? false;
    }
    mappingOptions(): { label: string; value: string }[] { return [{ label: 'Not mapped', value: '' }, ...(this.inspection?.headers || []).map(header => ({ label: header, value: header }))]; }
    previewImport(): void { if (!this.file || !this.selectedSheet) return; this.loadingSchedule = true; this.error = ''; this.service.previewSchedule(this.file, this.selectedSheet, this.headerRow, this.mappings).subscribe({ next: result => { this.preview = result; this.wizardStep = 3; this.loadingSchedule = false; }, error: err => { this.error = String(err); this.loadingSchedule = false; } }); }
    confirmImport(): void {
        if (!this.funding || !this.file || !this.preview?.isValid || this.loadingSchedule) return;

        const fundingId = this.funding.id;
        const file = this.file;
        this.error = '';
        this.attachedScheduleFile = '';
        this.loadingSchedule = true;
        this.service.saveSchedule(fundingId, this.preview.lines, true).pipe(
            finalize(() => this.loadingSchedule = false)
        ).subscribe({
            next: schedule => {
                this.wizardStep = 0;
                this.file = undefined;
                this.preview = undefined;
                this.loadSchedules(fundingId);

                const attachment = { fundingId, file, version: schedule.scheduleVersion, uploading: false, error: '' };
                this.pendingScheduleAttachments.push(attachment);
                this.attachScheduleWorkbook(attachment);
            },
            error: err => this.error = String(err)
        });
    }

    attachScheduleWorkbook(attachment: PendingScheduleAttachment): void {
        if (attachment.uploading) return;
        attachment.uploading = true;
        attachment.error = '';

        const ownerType = 'AssetFunding';
        this.documentAttachments.getRequirements(ownerType, attachment.fundingId).pipe(
            switchMap(({ data }) => {
                const requirement = data?.find(item =>
                    [item.Code, item.DisplayName, item.DocumentTypeCode, item.DocumentTypeName].some(value =>
                        value?.replace(/[^a-z]/gi, '').toLowerCase().includes('repaymentschedule')
                    )
                );
                if (!requirement) {
                    throw new Error('Configure a Repayment Schedule document requirement that accepts .xlsx files for asset funding.');
                }
                return this.documentAttachments.upload(
                    ownerType, attachment.fundingId, attachment.file, requirement.Id, `Repayment schedule · Version ${attachment.version}`
                );
            }),
            filter(event => event.type === HttpEventType.Response),
            first(),
            finalize(() => attachment.uploading = false)
        ).subscribe({
            next: () => {
                this.pendingScheduleAttachments = this.pendingScheduleAttachments.filter(item => item !== attachment);
                this.attachedScheduleFile = attachment.file.name;
            },
            error: err => {
                attachment.error = err instanceof Error ? err.message : String(err);
            }
        });
    }
    startManual(): void { this.manual = true; this.lines.clear(); this.addManualLine(); }
    addManualLine(): void { this.lines.push(this.fb.group({ installmentNumber: [this.lines.length + 1, [Validators.required, Validators.min(1)]], dueDate: [null, Validators.required], openingPrincipal: [null], principalDue: [null], interestDue: [null], chargesDue: [0], totalDue: [null, [Validators.required, Validators.min(0)]], closingPrincipal: [null] })); }
    removeManualLine(index: number): void { this.lines.removeAt(index); }
    saveManual(confirm: boolean): void { if (!this.funding) return; if (this.manualForm.invalid) { this.manualForm.markAllAsTouched(); return; } this.loadingSchedule = true; this.service.saveSchedule(this.funding.id, this.manualForm.getRawValue().lines as IAssetFundingScheduleLine[], confirm).subscribe({ next: () => { this.manual = false; this.loadSchedules(); this.loadingSchedule = false; }, error: err => { this.error = String(err); this.loadingSchedule = false; } }); }
    get paymentAllocations(): FormArray { return this.paymentForm.get('allocations') as FormArray; }
    loadPayments(id = this.funding?.id): void { if (!id) return; this.loadingPayments = true; this.service.paymentSummary(id).subscribe({ next: summary => { this.paymentSummary = summary; this.loadingPayments = false; }, error: () => { this.error = 'Unable to load payment summary.'; this.loadingPayments = false; } }); this.service.installments(id).subscribe({ next: rows => this.installments = rows, error: () => this.error = 'Unable to load installment balances.' }); this.service.transactions(id).subscribe({ next: rows => this.transactions = rows, error: () => this.error = 'Unable to load transaction history.' }); }
    openPayment(type: 'DISBURSEMENT' | 'REPAYMENT'): void {
        this.error = '';
        this.paymentOpen = true;
        this.paymentAllocations.clear();
        this.paymentForm.reset({ transactionType: type, transactionDate: new Date(), amount: 0, paymentMethod: 'BANK_TRANSFER', principalComponent: 0, interestComponent: 0, chargesComponent: 0 });
        if (type === 'DISBURSEMENT') return;

        for (const line of this.installments.filter(line => line.remainingAmount > 0)) {
            this.paymentAllocations.push(this.fb.group({
                scheduleId: [line.scheduleId],
                installmentNumber: [line.installmentNumber],
                dueDate: [line.dueDate],
                remainingAmount: [line.remainingAmount],
                principalRemaining: [line.principalRemaining],
                interestRemaining: [line.interestRemaining],
                chargesRemaining: [line.chargesRemaining],
                principalAmount: [0, Validators.min(0)],
                interestAmount: [0, Validators.min(0)],
                chargesAmount: [0, Validators.min(0)]
            }));
        }
    }
    onPaymentAmount(): void { const value = this.paymentForm.value; if (value.transactionType === 'DISBURSEMENT' || ((+value.principalComponent || 0) + (+value.interestComponent || 0) + (+value.chargesComponent || 0) === 0)) this.paymentForm.patchValue({ principalComponent: value.amount || 0, interestComponent: 0, chargesComponent: 0 }, { emitEvent: false }); }
    useInstallmentBalance(index: number): void {
        const allocation = this.paymentAllocations.at(index);
        const { principalRemaining, interestRemaining, chargesRemaining } = allocation.value;
        allocation.patchValue({
            principalAmount: principalRemaining ?? 0,
            interestAmount: interestRemaining ?? 0,
            chargesAmount: chargesRemaining ?? 0
        });
        allocation.markAsDirty();
    }

    get paymentComponentTotal(): number {
        const { principalComponent, interestComponent, chargesComponent } = this.paymentForm.value;
        return (this.paymentUnits(principalComponent) + this.paymentUnits(interestComponent) + this.paymentUnits(chargesComponent)) / 10000;
    }

    get paymentValidationMessage(): string {
        const { amount, principalComponent, interestComponent, chargesComponent, allocations } = this.paymentForm.value;
        if (this.paymentUnits(amount) !== this.paymentUnits(this.paymentComponentTotal)) {
            return 'Principal, interest, and charges must add up to the transaction amount.';
        }

        const allocated = { principal: 0, interest: 0, charges: 0 };
        for (const allocation of allocations) {
            const principal = this.paymentUnits(allocation.principalAmount);
            const interest = this.paymentUnits(allocation.interestAmount);
            const charges = this.paymentUnits(allocation.chargesAmount);
            const balance = this.installments.find(line => line.scheduleId === allocation.scheduleId);
            if (balance) {
                const exceeded = [
                    { label: 'principal', entered: principal, remaining: balance.principalRemaining },
                    { label: 'interest', entered: interest, remaining: balance.interestRemaining },
                    { label: 'charges', entered: charges, remaining: balance.chargesRemaining }
                ].find(component => component.entered > this.paymentUnits(component.remaining));
                if (exceeded) {
                    const limit = (exceeded.remaining ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
                    return `Installment #${allocation.installmentNumber}: ${exceeded.label} allocation exceeds the remaining ${limit}. Edit the amount or select Use remaining.`;
                }
            }
            allocated.principal += principal;
            allocated.interest += interest;
            allocated.charges += charges;
        }
        if (allocated.principal > this.paymentUnits(principalComponent)
            || allocated.interest > this.paymentUnits(interestComponent)
            || allocated.charges > this.paymentUnits(chargesComponent)) {
            return 'Allocated principal, interest, and charges must each stay within the corresponding transaction component.';
        }
        return '';
    }

    private paymentUnits(value: number | null | undefined): number {
        return Math.round((value ?? 0) * 10000);
    }

    recordPayment(): void {
        if (!this.funding || this.loadingPayments) return;
        this.paymentForm.markAllAsTouched();
        if (this.paymentForm.invalid || this.paymentValidationMessage) return;

        this.error = '';
        const value = this.paymentForm.getRawValue();
        const allocations = this.paymentAllocations.controls
            .map(({ value: { scheduleId, principalAmount, interestAmount, chargesAmount } }) => ({
                scheduleId, principalAmount: principalAmount ?? 0, interestAmount: interestAmount ?? 0, chargesAmount: chargesAmount ?? 0
            }))
            .filter(allocation => allocation.principalAmount > 0 || allocation.interestAmount > 0 || allocation.chargesAmount > 0);
        this.loadingPayments = true;
        this.service.recordTransaction(this.funding.id, {
            ...value,
            principalComponent: value.principalComponent ?? 0,
            interestComponent: value.interestComponent ?? 0,
            chargesComponent: value.chargesComponent ?? 0,
            currencyCode: this.funding.currencyCode,
            allocations
        }).subscribe({
            next: () => {
                this.paymentOpen = false;
                this.loadPayments();
            },
            error: err => {
                this.error = String(err);
                this.loadingPayments = false;
            }
        });
    }
    private parseDate(value: unknown): Date | null {
        if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
        if (typeof value !== 'string' || !value.trim()) return null;
        const text = value.trim();
        const apiDate = deserializeApiDate(text);
        if (apiDate !== undefined) return apiDate;
        const match = text.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})/);
        if (match) {
            const [, day, month, year] = match;
            const date = new Date(Number(year), Number(month) - 1, Number(day));
            return date.getFullYear() === Number(year) && date.getMonth() === Number(month) - 1 && date.getDate() === Number(day)
                ? date
                : null;
        }
        const parsed = new Date(text);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
}
