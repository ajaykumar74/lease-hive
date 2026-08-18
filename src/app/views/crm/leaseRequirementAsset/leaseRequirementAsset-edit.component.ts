import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
    selector: 'app-leaseRequirementAsset-edit',
    standalone: false,
    templateUrl: './leaseRequirementAsset-edit.component.html',
    providers: [MessageService]
})
export class LeaseRequirementAssetEditComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    leaseRequirementAsset: ILeaseRequirementAsset = null;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    leaserequirementidOptions: ISelectItem[] = [];
    assetcategoryidOptions: ISelectItem[] = [];
    assettypeidOptions: ISelectItem[] = [];
    assetmakeidOptions: ISelectItem[] = [];
    assetmodelidOptions: ISelectItem[] = [];
    newusedcodeOptions: ISelectItem[] = [];
    currencycodeOptions: ISelectItem[] = [];
    servicepackagecodeOptions: ISelectItem[] = [];
    recordstatusOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: ILeaseRequirementAsset = {} as ILeaseRequirementAsset;

    constructor(
        private activatedRouter: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private leaseRequirementAssetService: LeaseRequirementAssetService,
        private loggedInUserService: LoggedInUserService
    ) {}

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    ngOnInit(): void {
        this.objMaster = { ...this.leaseRequirementAsset };

        this.editForm = this.fb.group({
            Id: new FormControl(0, [Validators.required]),
            LeaseRequirementId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            LineNo: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
            AssetCategoryId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            AssetTypeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            AssetMakeId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            AssetModelId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            Quantity: new FormControl(0, [Validators.min(-32768), Validators.max(32767)]),
            NewUsedCode: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            CurrencyCode: new FormControl('', [Validators.maxLength(20)]),
            UsageUOMId: new FormControl(0, [Validators.min(-32768), Validators.max(32767)]),
            ServicePackageCode: new FormControl('', [Validators.maxLength(20)]),
            Remarks: new FormControl('', [Validators.maxLength(100)]),
            RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            EffectiveFrom: new FormControl(new Date(), [Validators.required]),
            EffectiveTo: new FormControl(new Date(), [])
        });
        this.loggedInUserService.getLookupOptions('lease-requirements').subscribe((options) => (this.leaserequirementidOptions = options));
        this.loggedInUserService.getLookupOptions('asset-categories').subscribe((options) => (this.assetcategoryidOptions = options));
        this.loggedInUserService.getLookupOptions('asset-types').subscribe((options) => (this.assettypeidOptions = options));
        this.loggedInUserService.getLookupOptions('asset-makes').subscribe((options) => (this.assetmakeidOptions = options));
        this.loggedInUserService.getLookupOptions('asset-models').subscribe((options) => (this.assetmodelidOptions = options));
        this.newusedcodeOptions.push({ Text: 'NEW', Value: 'NEW' });
        this.newusedcodeOptions.push({ Text: 'USED', Value: 'USED' });
        this.newusedcodeOptions.push({ Text: 'ANY', Value: 'ANY' });
        this.currencycodeOptions.push({ Text: 'INR', Value: 'INR' });
        this.currencycodeOptions.push({ Text: 'USD', Value: 'USD' });
        this.servicepackagecodeOptions.push({ Text: 'Full', Value: 'Full' });
        this.servicepackagecodeOptions.push({ Text: 'Partial', Value: 'Partial' });
        this.recordstatusOptions.push({ Text: 'Draft', Value: 'Draft' });
        this.recordstatusOptions.push({ Text: 'Active', Value: 'Active' });
        this.recordstatusOptions.push({ Text: 'Inactive', Value: 'Inactive' });
        this.recordstatusOptions.push({ Text: 'Archived', Value: 'Archived' });

        this.selectedId = this.activatedRouter.snapshot.params['id'];
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.loadUI();
        }, 500);
    }

    loadUI(): void {
        this.isLoading = true;
        this.leaseRequirementAssetService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.leaseRequirementAsset = data.data;
                this.permission = data.permission;
                this.objMaster = { ...this.leaseRequirementAsset };
                this.populateUI(this.leaseRequirementAsset);
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
        this.loggedInUserService.getLookupOptions('asset-models', obj.AssetModelId).subscribe((options) => (this.assetmodelidOptions = options));
        this.loggedInUserService.getLookupOptions('asset-makes', obj.AssetMakeId).subscribe((options) => (this.assetmakeidOptions = options));
        this.loggedInUserService.getLookupOptions('asset-types', obj.AssetTypeId).subscribe((options) => (this.assettypeidOptions = options));
        this.loggedInUserService.getLookupOptions('lease-requirements', obj.LeaseRequirementId).subscribe((options) => (this.leaserequirementidOptions = options));
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
            CurrencyCode: obj.CurrencyCode || '',
            UsageUOMId: obj.UsageUOMId || 0,
            ServicePackageCode: obj.ServicePackageCode || '',
            Remarks: obj.Remarks || '',
            RecordStatus: obj.RecordStatus || '',
            EffectiveFrom: obj.EffectiveFrom || new Date(),
            EffectiveTo: obj.EffectiveTo || new Date()
        });

        this.Caption = 'LeaseRequirementAsset Details #' + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/leaseRequirementAsset/create', { id: -1 }]);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
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
            CurrencyCode: obj.CurrencyCode || '',
            UsageUOMId: obj.UsageUOMId || 0,
            ServicePackageCode: obj.ServicePackageCode || '',
            Remarks: obj.Remarks || '',
            RecordStatus: obj.RecordStatus || '',
            EffectiveFrom: obj.EffectiveFrom || new Date(),
            EffectiveTo: obj.EffectiveTo || new Date()
        });

        this.editForm.reset();
    }

    Save(): void {
        if (!this.editForm.valid) {
            this.messageService.showError('One or more validation failed. Please clear error to continue...');
            return;
        }

        const formValues = this.editForm.value;
        var updatedObj = {
            Id: this.objMaster.Id,
            RowVersionStr: this.objMaster.RowVersionStr,
            LeaseRequirementId: formValues.LeaseRequirementId || null,
            LineNo: formValues.LineNo || null,
            AssetCategoryId: formValues.AssetCategoryId || null,
            AssetTypeId: formValues.AssetTypeId || null,
            AssetMakeId: formValues.AssetMakeId || null,
            AssetModelId: formValues.AssetModelId || null,
            Quantity: formValues.Quantity || null,
            NewUsedCode: formValues.NewUsedCode || null,
            EstimatedUnitCost: formValues.EstimatedUnitCost || null,
            CurrencyCode: formValues.CurrencyCode || null,
            ExpectedAnnualUsage: formValues.ExpectedAnnualUsage || null,
            UsageUOMId: formValues.UsageUOMId || null,
            ServicePackageCode: formValues.ServicePackageCode || null,
            Remarks: formValues.Remarks || null,
            RecordStatus: formValues.RecordStatus || null,
            EffectiveFrom: formValues.EffectiveFrom || null,
            EffectiveTo: formValues.EffectiveTo || null
        } as ILeaseRequirementAsset;

        this.spinner.show();
        this.leaseRequirementAssetService.update(this.leaseRequirementAsset.Id, updatedObj).subscribe({
            next: (data) => {
                //this.messageService.showSuccess(LeaseRequirementAsset +  'Details Updated sucessfully.');
                //this.editForm.reset();
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
