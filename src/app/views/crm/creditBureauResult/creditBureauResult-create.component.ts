import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { ICreditBureauResult } from './creditBureauResult';
import { CreditBureauResultService } from './creditBureauResult.service';

@Component({
    selector: 'app-creditBureauResult-create',
    standalone: false,
    templateUrl: './creditBureauResult-create.component.html',
    providers: [MessageService]
})
export class CreditBureauResultCreateComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    creditBureauResult: ICreditBureauResult = null;
    creditapplicationidOptions: ISelectItem[] = [];
    partyidOptions: ISelectItem[] = [];
    providercodeOptions: ISelectItem[] = [];
    resultstatuscodeOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: ICreditBureauResult = {} as ICreditBureauResult;

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private creditBureauResultService: CreditBureauResultService,
        private loggedInUserService: LoggedInUserService
    ) {}

    ngOnInit(): void {
        this.objMaster = { ...this.creditBureauResult };

        this.editForm = this.fb.group({
            Id: new FormControl(0, []),
            CreditApplicationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            ProviderCode: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            RequestReference: new FormControl('', [Validators.maxLength(100)]),
            RequestedOn: new FormControl(new Date(), [Validators.required]),
            ReceivedOn: new FormControl(new Date(), [Validators.required]),
            Score: new FormControl(0, [Validators.min(0), Validators.max(255)]),
            RiskBand: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            AdverseFlag: new FormControl(false, []),
            RawDocumentId: new FormControl('', [Validators.required, Validators.maxLength(10)]),
            ResultStatusCode: new FormControl('', [Validators.maxLength(20)])
        });
        this.Caption = 'Create CreditBureauResult';
        this.loggedInUserService.getLookupOptions('credit-applications').subscribe((options) => (this.creditapplicationidOptions = options));
        this.loggedInUserService.getPartyOptions().subscribe((options) => (this.partyidOptions = options));
        this.providercodeOptions = this.loggedInUserService.getPicklistOptions('ProviderCode');
        this.resultstatuscodeOptions = this.loggedInUserService.getPicklistOptions('ResultStatusCode');
    }

    loadUI(): void {
        this.isLoading = true;
        this.creditBureauResultService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.creditBureauResult = data;
                this.objMaster = { ...this.creditBureauResult };
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

    populateUI(obj: ICreditBureauResult): void {
        this.editForm.patchValue({
            Id: obj.Id || 0,
            CreditApplicationId: obj.CreditApplicationId || 0,
            PartyId: obj.PartyId || 0,
            ProviderCode: obj.ProviderCode || '',
            RequestReference: obj.RequestReference || '',
            RequestedOn: obj.RequestedOn || new Date(),
            ReceivedOn: obj.ReceivedOn || new Date(),
            Score: obj.Score || 0,
            RiskBand: obj.RiskBand || 0,
            AdverseFlag: obj.AdverseFlag || false,
            RawDocumentId: obj.RawDocumentId || '',
            ResultStatusCode: obj.ResultStatusCode || ''
        });
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/creditBureauResults/create']);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
        } else if (key == 'Refresh') {
            this.loadUI();
        }
    }

    onCancel(): void {
        this.creditBureauResult = { ...this.objMaster };
        var obj = this.creditBureauResult;
        this.editForm.patchValue({
            Id: obj.Id || 0,
            CreditApplicationId: obj.CreditApplicationId || 0,
            PartyId: obj.PartyId || 0,
            ProviderCode: obj.ProviderCode || '',
            RequestReference: obj.RequestReference || '',
            RequestedOn: obj.RequestedOn || new Date(),
            ReceivedOn: obj.ReceivedOn || new Date(),
            Score: obj.Score || 0,
            RiskBand: obj.RiskBand || 0,
            AdverseFlag: obj.AdverseFlag || false,
            RawDocumentId: obj.RawDocumentId || '',
            ResultStatusCode: obj.ResultStatusCode || ''
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
            CreditApplicationId: formValues.CreditApplicationId || 0,
            PartyId: formValues.PartyId || 0,
            ProviderCode: formValues.ProviderCode || null,
            RequestReference: formValues.RequestReference || null,
            RequestedOn: formValues.RequestedOn || null,
            ReceivedOn: formValues.ReceivedOn || null,
            Score: formValues.Score || null,
            RiskBand: formValues.RiskBand || 0,
            AdverseFlag: formValues.AdverseFlag || false,
            RawDocumentId: formValues.RawDocumentId || null,
            ResultStatusCode: formValues.ResultStatusCode || null
        } as ICreditBureauResult;

        this.spinner.show();
        this.creditBureauResultService.create(createdObj).subscribe({
            next: (data) => {
                // this.messageService.showSuccess(CreditBureauResult +  'Details Updated sucessfully.');
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
