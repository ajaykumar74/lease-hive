import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ISelectItem } from '@/shared/ISelectItem';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { TaxConfigurationService } from './tax-configuration.service';
import { TaxClassification, TaxClassificationInput, TaxClassificationMapping, TaxClassificationMappingInput } from './tax-classification.models';

@Component({
    selector: 'app-tax-classification-management', standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule, InputTextModule, SelectModule, TableModule, TagModule, ToastModule, TooltipModule],
    providers: [MessageService], templateUrl: './tax-classification-management.component.html', styleUrl: './tax-classification-management.component.scss'
})
export class TaxClassificationManagementComponent implements OnInit {
    classifications: TaxClassification[] = [];
    mappings: TaxClassificationMapping[] = [];
    sourceOptions: ISelectItem[] = [];
    classificationOptions: { label: string; value: number }[] = [];
    loadingClassifications = false;
    loadingMappings = false;
    canUpdate = false;
    classificationDialog = false;
    mappingDialog = false;
    classificationDetails = false;
    mappingDetails = false;
    classificationId: number | null = null;
    mappingId: number | null = null;
    selectedClassification: TaxClassification | null = null;
    selectedMapping: TaxClassificationMapping | null = null;
    error = '';
    readonly classificationTypes = [{ label: 'HSN', value: 'HSN' }, { label: 'SAC', value: 'SAC' }, { label: 'Other', value: 'OTHER' }];
    readonly sourceTypes = [{ label: 'Asset category', value: 'ASSETCATEGORY' }, { label: 'Service type', value: 'SERVICETYPE' }, { label: 'Charge type', value: 'CHARGETYPE' }];
    readonly transactionTypes = [{ label: 'Lease rental', value: 'LEASE_RENTAL' }, { label: 'Service', value: 'SERVICE' }, { label: 'Charge', value: 'CHARGE' }, { label: 'Asset sale', value: 'ASSET_SALE' }];
    readonly statuses = [{ label: 'Active', value: 'ACTIVE' }, { label: 'Inactive', value: 'INACTIVE' }];
    classificationForm: TaxClassificationInput = this.newClassification();
    mappingForm: TaxClassificationMappingInput = this.newMapping();

    constructor(private readonly service: TaxConfigurationService, private readonly users: LoggedInUserService, private readonly messages: MessageService) {}
    ngOnInit(): void { this.loadClassifications(); this.loadMappings(); }

    loadClassifications(): void {
        this.loadingClassifications = true;
        this.service.searchClassifications({ RecordStatus: 'ACTIVE', Take: 100 }).subscribe({
            next: response => { this.classifications = response.Records || []; this.canUpdate = response.CanUpdate === true; this.classificationOptions = this.classifications.map(item => ({ label: `${item.ClassificationType} · ${item.ClassificationCode} — ${item.Description}`, value: item.Id })); },
            error: error => this.showError(this.errorMessage(error, 'Tax classifications could not be loaded.')),
            complete: () => this.loadingClassifications = false
        });
    }
    loadMappings(): void {
        this.loadingMappings = true;
        this.service.searchMappings({ RecordStatus: 'ACTIVE', Take: 100 }).subscribe({
            next: response => { this.mappings = response.Records || []; this.canUpdate = this.canUpdate || response.CanUpdate === true; },
            error: error => this.showError(this.errorMessage(error, 'Classification mappings could not be loaded.')),
            complete: () => this.loadingMappings = false
        });
    }
    openClassification(value?: TaxClassification): void {
        if (!this.canUpdate) return;
        if (!value) { this.classificationId = null; this.classificationForm = this.newClassification(); this.classificationDialog = true; return; }
        this.service.getClassification(value.Id).subscribe({ next: saved => { this.classificationId = saved.Id; this.classificationForm = { ...saved, EffectiveFrom: this.date(saved.EffectiveFrom), EffectiveTo: saved.EffectiveTo ? this.date(saved.EffectiveTo) : undefined }; this.classificationDialog = true; }, error: error => this.showError(this.errorMessage(error, 'Classification details could not be loaded.')) });
    }
    openClassificationDetails(value: TaxClassification): void { this.service.getClassification(value.Id).subscribe({ next: saved => { this.selectedClassification = saved; this.classificationDetails = true; }, error: error => this.showError(this.errorMessage(error, 'Classification details could not be loaded.')) }); }
    saveClassification(): void {
        if (!this.validClassification()) return;
        const value = this.normalizedClassification();
        const request = this.classificationId ? this.service.updateClassification(this.classificationId, value) : this.service.createClassification(value);
        request.subscribe({ next: () => { this.classificationDialog = false; this.messages.add({ severity: 'success', summary: 'Tax classification saved' }); this.loadClassifications(); }, error: error => this.error = this.errorMessage(error, 'Tax classification could not be saved.') });
    }
    deleteClassification(value: TaxClassification): void { if (this.canUpdate && confirm(`Delete ${value.ClassificationType} ${value.ClassificationCode}?`)) this.service.deleteClassification(value.Id, value.RowVersionStr).subscribe({ next: () => { this.messages.add({ severity: 'success', summary: 'Tax classification deleted' }); this.loadClassifications(); }, error: error => this.showError(this.errorMessage(error, 'Tax classification could not be deleted.')) }); }

    openMapping(value?: TaxClassificationMapping): void {
        if (!this.canUpdate) return;
        if (!value) { this.mappingId = null; this.mappingForm = this.newMapping(); this.loadSourceOptions(); this.mappingDialog = true; return; }
        this.service.getMapping(value.Id).subscribe({ next: saved => { this.mappingId = saved.Id; this.mappingForm = { CountryCode: saved.CountryCode, SourceType: saved.SourceType, SourceId: saved.SourceId, TransactionTypeCode: saved.TransactionTypeCode, TaxClassificationId: saved.TaxClassificationId, EffectiveFrom: this.date(saved.EffectiveFrom), EffectiveTo: saved.EffectiveTo ? this.date(saved.EffectiveTo) : undefined, RecordStatus: saved.RecordStatus, RowVersionStr: saved.RowVersionStr }; this.loadSourceOptions(); this.mappingDialog = true; }, error: error => this.showError(this.errorMessage(error, 'Mapping details could not be loaded.')) });
    }
    openMappingDetails(value: TaxClassificationMapping): void { this.service.getMapping(value.Id).subscribe({ next: saved => { this.selectedMapping = saved; this.mappingDetails = true; }, error: error => this.showError(this.errorMessage(error, 'Mapping details could not be loaded.')) }); }
    sourceTypeChanged(): void { this.mappingForm.SourceId = 0; this.loadSourceOptions(); }
    loadSourceOptions(): void {
        const lookup = this.mappingForm.SourceType === 'ASSETCATEGORY' ? 'asset-categories' : this.mappingForm.SourceType === 'SERVICETYPE' ? 'lease-services' : 'settlement-charge-types';
        this.users.getEntityLookupOptions(lookup).subscribe({ next: options => this.sourceOptions = options || [], error: () => this.sourceOptions = [] });
    }
    saveMapping(): void {
        if (!this.validMapping()) return;
        const value: TaxClassificationMappingInput = { ...this.mappingForm, CountryCode: this.mappingForm.CountryCode.trim().toUpperCase(), SourceType: this.mappingForm.SourceType.toUpperCase(), TransactionTypeCode: this.mappingForm.TransactionTypeCode.toUpperCase() };
        const request = this.mappingId ? this.service.updateMapping(this.mappingId, value) : this.service.createMapping(value);
        request.subscribe({ next: () => { this.mappingDialog = false; this.messages.add({ severity: 'success', summary: 'Classification mapping saved' }); this.loadMappings(); }, error: error => this.error = this.errorMessage(error, 'Classification mapping could not be saved.') });
    }
    deleteMapping(value: TaxClassificationMapping): void { if (this.canUpdate && confirm(`Delete the ${value.SourceType} classification mapping?`)) this.service.deleteMapping(value.Id, value.RowVersionStr).subscribe({ next: () => { this.messages.add({ severity: 'success', summary: 'Classification mapping deleted' }); this.loadMappings(); }, error: error => this.showError(this.errorMessage(error, 'Classification mapping could not be deleted.')) }); }
    statusSeverity(status: string): 'success' | 'secondary' { return status === 'ACTIVE' ? 'success' : 'secondary'; }
    private validClassification(): boolean { if (!this.classificationForm.CountryCode?.trim() || !this.classificationForm.ClassificationCode?.trim() || !this.classificationForm.Description?.trim() || !this.classificationForm.EffectiveFrom) { this.error = 'Country, type, code, description and effective start are required.'; return false; } if (this.classificationForm.EffectiveTo && this.classificationForm.EffectiveTo < this.classificationForm.EffectiveFrom) { this.error = 'Effective end must be on or after the effective start.'; return false; } return true; }
    private validMapping(): boolean { if (!this.mappingForm.CountryCode?.trim() || !this.mappingForm.SourceType || this.mappingForm.SourceId <= 0 || !this.mappingForm.TransactionTypeCode || this.mappingForm.TaxClassificationId <= 0 || !this.mappingForm.EffectiveFrom) { this.error = 'Country, source, transaction, classification and effective start are required.'; return false; } if (this.mappingForm.EffectiveTo && this.mappingForm.EffectiveTo < this.mappingForm.EffectiveFrom) { this.error = 'Effective end must be on or after the effective start.'; return false; } return true; }
    private normalizedClassification(): TaxClassificationInput { return { ...this.classificationForm, CountryCode: this.classificationForm.CountryCode.trim().toUpperCase(), ClassificationType: this.classificationForm.ClassificationType.toUpperCase(), ClassificationCode: this.classificationForm.ClassificationCode.trim().toUpperCase(), Description: this.classificationForm.Description.trim(), RecordStatus: this.classificationForm.RecordStatus.toUpperCase() }; }
    private newClassification(): TaxClassificationInput { return { CountryCode: '', ClassificationType: 'HSN', ClassificationCode: '', Description: '', EffectiveFrom: this.date(new Date().toISOString()), EffectiveTo: undefined, RecordStatus: 'ACTIVE', RowVersionStr: '' }; }
    private newMapping(): TaxClassificationMappingInput { return { CountryCode: '', SourceType: 'ASSETCATEGORY', SourceId: 0, TransactionTypeCode: 'LEASE_RENTAL', TaxClassificationId: 0, EffectiveFrom: this.date(new Date().toISOString()), EffectiveTo: undefined, RecordStatus: 'ACTIVE', RowVersionStr: '' }; }
    private date(value: string): string { return value ? value.slice(0, 10) : ''; }
    private showError(detail: string): void { this.messages.add({ severity: 'error', summary: 'Tax classifications', detail }); }
    private errorMessage(error: any, fallback: string): string { return error?.error?.message || error?.error?.ErrorMessage || error?.message || fallback; }
}
