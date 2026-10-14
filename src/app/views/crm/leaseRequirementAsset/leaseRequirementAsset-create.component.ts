import { Component, DestroyRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { ILeaseRequirementAsset } from './leaseRequirementAsset';
import { LeaseRequirementAssetService } from './leaseRequirementAsset.service';

@Component({
    selector: 'app-leaseRequirementAsset-create',
    standalone: false,
    templateUrl: './leaseRequirementAsset-create.component.html',
    providers: [MessageService]
})
export class LeaseRequirementAssetCreateComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    leaseRequirementAsset: ILeaseRequirementAsset = null;
    leaserequirementidOptions: ISelectItem[] = [];
    assetcategoryidOptions: ISelectItem[] = [];
    assettypeidOptions: ISelectItem[] = [];
    assetmakeidOptions: ISelectItem[] = [];
    assetmodelidOptions: ISelectItem[] = [];
    newusedcodeOptions: ISelectItem[] = [];
    servicepackagecodeOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: ILeaseRequirementAsset = {} as ILeaseRequirementAsset;

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private leaseRequirementAssetService: LeaseRequirementAssetService,
        private loggedInUserService: LoggedInUserService,
        private destroyRef: DestroyRef
    ) {}

    ngOnInit(): void {
        this.objMaster = { ...this.leaseRequirementAsset };

        this.editForm = this.fb.group({
            Id: new FormControl(0, []),
            LeaseRequirementId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
            LineNo: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
            AssetCategoryId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            AssetTypeId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
            AssetMakeId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            AssetModelId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
            Quantity: new FormControl(0, [Validators.min(-32768), Validators.max(32767)]),
            NewUsedCode: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            EstimatedUnitCost: new FormControl(0, [Validators.min(0)]),
            CurrencyCode: new FormControl('', [Validators.maxLength(20)]),
            ExpectedAnnualUsage: new FormControl(0, [Validators.min(0)]),
            UsageUOMId: new FormControl(0, [Validators.min(-32768), Validators.max(32767)]),
            ServicePackageCode: new FormControl('', [Validators.maxLength(20)]),
            Remarks: new FormControl('', [Validators.maxLength(100)]),
            EffectiveFrom: new FormControl(new Date(), [Validators.required]),
            EffectiveTo: new FormControl(new Date(), [])
        });
        this.Caption = 'Create LeaseRequirementAsset';
        this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseRequirementId', 'lease-requirements', options => this.leaserequirementidOptions = options, error => this.messageService?.showError(error), this.destroyRef);
        this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetCategoryId', 'asset-categories', options => this.assetcategoryidOptions = options, error => this.messageService?.showError(error), this.destroyRef);
        this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetTypeId', 'asset-types', options => this.assettypeidOptions = options, error => this.messageService?.showError(error), this.destroyRef, { AssetCategoryId: 'AssetCategoryId' });
        this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetMakeId', 'asset-makes', options => this.assetmakeidOptions = options, error => this.messageService?.showError(error), this.destroyRef, { AssetCategoryId: 'AssetCategoryId', AssetTypeId: 'AssetTypeId' });
        this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetModelId', 'asset-models', options => this.assetmodelidOptions = options, error => this.messageService?.showError(error), this.destroyRef, { AssetMakeId: 'AssetMakeId' });
        this.newusedcodeOptions = this.loggedInUserService.getPicklistOptions('NewUsedCode');
        this.servicepackagecodeOptions = this.loggedInUserService.getPicklistOptions('ServicePackageCode');
    }

    loadUI(): void {
        this.isLoading = true;
        this.leaseRequirementAssetService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.leaseRequirementAsset = data;
                this.objMaster = { ...this.leaseRequirementAsset };
                this.populateUI(data);
            },
            error: (err) => {
                this.messageService.showSuccess(err);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    populateUI(obj: ILeaseRequirementAsset): void {
        this.editForm.patchValue({
            Id: obj.Id || 0,
            LeaseRequirementId: obj.LeaseRequirementId || 0,
            LineNo: obj.LineNo || 0,
            AssetCategoryId: obj.AssetCategoryId || 0,
            AssetTypeId: obj.AssetTypeId || 0,
            AssetMakeId: obj.AssetMakeId || 0,
            AssetModelId: obj.AssetModelId || 0,
            Quantity: obj.Quantity || 0,
            NewUsedCode: obj.NewUsedCode || '',
            EstimatedUnitCost: obj.EstimatedUnitCost ?? 0,
            CurrencyCode: obj.CurrencyCode || '',
            ExpectedAnnualUsage: obj.ExpectedAnnualUsage ?? 0,
            UsageUOMId: obj.UsageUOMId || 0,
            ServicePackageCode: obj.ServicePackageCode || '',
            Remarks: obj.Remarks || '',
        });
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/business/crm/leaseRequirementAssets/create']);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
        } else if (key == 'Refresh') {
            this.loadUI();
        }
    }

    onCancel(): void {
        this.leaseRequirementAsset = { ...this.objMaster };
        var obj = this.leaseRequirementAsset;
        this.editForm.patchValue({
            Id: obj.Id || 0,
            LeaseRequirementId: obj.LeaseRequirementId || 0,
            LineNo: obj.LineNo || 0,
            AssetCategoryId: obj.AssetCategoryId || 0,
            AssetTypeId: obj.AssetTypeId || 0,
            AssetMakeId: obj.AssetMakeId || 0,
            AssetModelId: obj.AssetModelId || 0,
            Quantity: obj.Quantity || 0,
            NewUsedCode: obj.NewUsedCode || '',
            EstimatedUnitCost: obj.EstimatedUnitCost ?? 0,
            CurrencyCode: obj.CurrencyCode || '',
            ExpectedAnnualUsage: obj.ExpectedAnnualUsage ?? 0,
            UsageUOMId: obj.UsageUOMId || 0,
            ServicePackageCode: obj.ServicePackageCode || '',
            Remarks: obj.Remarks || '',
        });
        this.editForm.reset();
    }

    Save(): void {
        if (!this.editForm.valid) {
            this.messageService.showError('One or more validation failed. Please clear error to continue...');
            return;
        }

        const formValues = this.editForm.value;
        var createdObj = {
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
            Id: this.objMaster.Id,
            RowVersionStr: this.objMaster.RowVersionStr,
            LeaseRequirementId: formValues.LeaseRequirementId || 0,
            LineNo: formValues.LineNo || 0,
            AssetCategoryId: formValues.AssetCategoryId || 0,
            AssetTypeId: formValues.AssetTypeId || 0,
            AssetMakeId: formValues.AssetMakeId || 0,
            AssetModelId: formValues.AssetModelId || 0,
            Quantity: formValues.Quantity || 0,
            NewUsedCode: formValues.NewUsedCode || null,
            EstimatedUnitCost: Number(formValues.EstimatedUnitCost) || 0,
            CurrencyCode: formValues.CurrencyCode || null,
            ExpectedAnnualUsage: Number(formValues.ExpectedAnnualUsage) || 0,
            UsageUOMId: formValues.UsageUOMId || 0,
            ServicePackageCode: formValues.ServicePackageCode || null,
            Remarks: formValues.Remarks || null,
            RecordStatus: 'Active',
            EffectiveFrom: new Date(),
            EffectiveTo: null
        } as ILeaseRequirementAsset;

        this.spinner.show();
        this.leaseRequirementAssetService.create(createdObj).subscribe({
            next: (data) => {
                // this.messageService.showSuccess(LeaseRequirementAsset +  'Details Updated sucessfully.');
                this._location.back();
            },
            error: (err) => {
                this.messageService.showError(err);
                this.spinner.hide();
            },
            complete: () => {
                this.spinner.hide();
            }
        });
    }
}
