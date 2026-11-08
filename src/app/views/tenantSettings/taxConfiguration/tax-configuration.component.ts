import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TaxConfigurationService } from './tax-configuration.service';
import { TaxRule, TaxRuleInput, TaxRuleSearchRequest } from './tax-rule.models';
import { ISelectItem } from '@/shared/ISelectItem';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { TaxClassificationManagementComponent } from './tax-classification-management.component';

@Component({
    selector: 'app-tax-configuration',
    standalone: true,
    imports: [
        CommonModule, FormsModule, ButtonModule, CheckboxModule, DialogModule, InputNumberModule,
        InputTextModule, SelectModule, TableModule, TagModule, ToastModule, TooltipModule, TaxClassificationManagementComponent
    ],
    providers: [MessageService],
    templateUrl: './tax-configuration.component.html',
    styleUrl: './tax-configuration.component.scss'
})
export class TaxConfigurationComponent implements OnInit {
    records: TaxRule[] = [];
    totalRecords = 0;
    loading = false;
    saving = false;
    canUpdate = false;
    dialogVisible = false;
    detailVisible = false;
    editingId: number | null = null;
    selectedRule: TaxRule | null = null;
    error = '';

    filters: TaxRuleSearchRequest = { RecordStatus: 'ACTIVE', Take: 25 };
    form: TaxRuleInput = this.newForm();

    readonly taxTypeOptions = [
        { label: 'GST', value: 'GST' },
        { label: 'VAT', value: 'VAT' },
        { label: 'Sales Tax', value: 'SALES_TAX' },
        { label: 'Other', value: 'OTHER' }
    ];
    readonly treatmentOptions = [
        { label: 'Standard', value: 'STANDARD' },
        { label: 'Exempt', value: 'EXEMPT' },
        { label: 'Zero rated', value: 'ZERO_RATED' }
    ];
    readonly statusOptions = [
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Inactive', value: 'INACTIVE' }
    ];
    assetCategoryOptions: ISelectItem[] = [];

    constructor(
        private readonly taxRules: TaxConfigurationService,
        private readonly messages: MessageService,
        private readonly loggedInUserService: LoggedInUserService) {}

    ngOnInit(): void {
        this.load();
        this.loggedInUserService.getEntityLookupOptions('asset-categories').subscribe(options => this.assetCategoryOptions = options);
    }

    load(): void {
        this.loading = true;
        this.error = '';
        this.taxRules.search(this.filters).subscribe({
            next: response => {
                this.records = response.Records ?? [];
                this.totalRecords = response.TotalRecords ?? 0;
                this.canUpdate = response.CanUpdate === true;
            },
            error: error => this.error = this.errorMessage(error, 'Tax rules could not be loaded.'),
            complete: () => this.loading = false
        });
    }

    resetFilters(): void {
        this.filters = { RecordStatus: 'ACTIVE', Take: 25 };
        this.load();
    }

    scrollToSection(sectionId: string): void {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    openCreate(): void {
        if (!this.canUpdate) return;
        this.editingId = null;
        this.form = this.newForm();
        this.error = '';
        this.dialogVisible = true;
    }

    openEdit(rule: TaxRule): void {
        if (!this.canUpdate) return;
        this.taxRules.get(rule.Id).subscribe({
            next: saved => {
                this.editingId = saved.Id;
                this.form = this.toInput(saved);
                this.error = '';
                this.dialogVisible = true;
            },
            error: error => this.showError(this.errorMessage(error, 'Tax rule details could not be loaded.'))
        });
    }

    openDetails(rule: TaxRule): void {
        this.taxRules.get(rule.Id).subscribe({
            next: saved => {
                this.selectedRule = saved;
                this.detailVisible = true;
            },
            error: error => this.showError(this.errorMessage(error, 'Tax rule details could not be loaded.'))
        });
    }

    save(): void {
        if (this.saving || !this.formValid()) return;
        this.saving = true;
        this.error = '';
        const request = this.editingId
            ? this.taxRules.update(this.editingId, this.normalizedForm())
            : this.taxRules.create(this.normalizedForm());
        request.subscribe({
            next: () => {
                this.messages.add({ severity: 'success', summary: 'Tax rule saved', detail: 'The tenant tax configuration has been updated.' });
                this.dialogVisible = false;
                this.load();
            },
            error: error => this.error = this.errorMessage(error, 'Tax rule could not be saved.'),
            complete: () => this.saving = false
        });
    }

    delete(rule: TaxRule): void {
        if (!this.canUpdate || !confirm(`Delete the ${rule.TaxCode} tax rule?`)) return;
        this.taxRules.delete(rule.Id, rule.RowVersionStr).subscribe({
            next: () => {
                this.messages.add({ severity: 'success', summary: 'Tax rule deleted', detail: 'The configuration rule has been removed.' });
                this.load();
            },
            error: error => this.showError(this.errorMessage(error, 'Tax rule could not be deleted.'))
        });
    }

    treatmentChanged(): void {
        if (this.form.TaxTreatmentCode === 'EXEMPT' || this.form.TaxTreatmentCode === 'ZERO_RATED') this.form.TaxRate = 0;
    }

    statusSeverity(status: string): 'success' | 'secondary' {
        return status === 'ACTIVE' ? 'success' : 'secondary';
    }

    treatmentLabel(treatment: string): string {
        return treatment === 'ZERO_RATED' ? 'Zero rated' : `${treatment.charAt(0)}${treatment.slice(1).toLowerCase()}`;
    }

    private formValid(): boolean {
        if (!this.form.CountryCode?.trim() || !this.form.TaxTypeCode || !this.form.TaxCode?.trim() || !this.form.TaxName?.trim() || !this.form.EffectiveFrom) {
            this.error = 'Country, type, code, name and effective start date are required.';
            return false;
        }
        if (this.form.EffectiveTo && this.form.EffectiveTo < this.form.EffectiveFrom) {
            this.error = 'Effective end must be on or after the effective start.';
            return false;
        }
        if (this.form.TaxRate < 0 || this.form.TaxRate > 100) {
            this.error = 'Tax rate must be between 0% and 100%.';
            return false;
        }
        if ((this.form.TaxTreatmentCode === 'EXEMPT' || this.form.TaxTreatmentCode === 'ZERO_RATED') && this.form.TaxRate !== 0) {
            this.error = 'Exempt and zero-rated rules must have a 0% rate.';
            return false;
        }
        if (!this.form.AppliesToRental && !this.form.AppliesToServices && !this.form.AppliesToCharges) {
            this.error = 'Select at least one taxable item type.';
            return false;
        }
        return true;
    }

    private normalizedForm(): TaxRuleInput {
        return {
            ...this.form,
            CountryCode: this.form.CountryCode.trim().toUpperCase(),
            JurisdictionCode: this.emptyToUndefined(this.form.JurisdictionCode)?.toUpperCase(),
            TaxTypeCode: this.form.TaxTypeCode.toUpperCase(),
            TaxCode: this.form.TaxCode.trim().toUpperCase(),
            TaxName: this.form.TaxName.trim(),
            TaxGroupCode: this.emptyToUndefined(this.form.TaxGroupCode)?.toUpperCase(),
            RecordStatus: this.form.RecordStatus.toUpperCase()
        };
    }

    private toInput(rule: TaxRule): TaxRuleInput {
        return {
            ...rule,
            EffectiveFrom: this.dateInput(rule.EffectiveFrom),
            EffectiveTo: rule.EffectiveTo ? this.dateInput(rule.EffectiveTo) : undefined
        };
    }

    private newForm(): TaxRuleInput {
        return {
            CountryCode: '', JurisdictionCode: undefined, TaxTypeCode: 'GST', TaxCode: '', TaxName: '', TaxGroupCode: undefined,
            AssetCategoryId: undefined, LeaseTypeCode: undefined, TransactionTypeCode: undefined, RulePriority: undefined,
            TaxRate: 0, TaxTreatmentCode: 'STANDARD', AppliesToRental: true, AppliesToServices: true, AppliesToCharges: true,
            EffectiveFrom: this.dateInput(new Date().toISOString()), EffectiveTo: undefined, RecordStatus: 'ACTIVE', RowVersionStr: ''
        };
    }

    private dateInput(value: string): string {
        return value ? value.slice(0, 10) : '';
    }

    private emptyToUndefined(value: string | null | undefined): string | undefined {
        const trimmed = value?.trim();
        return trimmed || undefined;
    }

    private showError(detail: string): void {
        this.messages.add({ severity: 'error', summary: 'Tax configuration', detail });
    }

    private errorMessage(error: any, fallback: string): string {
        return error?.error?.message || error?.error?.ErrorMessage || error?.message || fallback;
    }
}
