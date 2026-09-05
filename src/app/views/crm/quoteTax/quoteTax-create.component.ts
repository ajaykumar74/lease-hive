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
import { IQuoteTax } from './quoteTax';
import { QuoteTaxService } from './quoteTax.service';

@Component({
    selector: 'app-quoteTax-create',
    standalone: false,
    templateUrl: './quoteTax-create.component.html',
    providers: [MessageService]
})
export class QuoteTaxCreateComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    quoteTax: IQuoteTax = null;
    quoteidOptions: ISelectItem[] = [];
    quoteassetidOptions: ISelectItem[] = [];
    quotechargeidOptions: ISelectItem[] = [];
    taxtypeOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: IQuoteTax = {} as IQuoteTax;

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private quoteTaxService: QuoteTaxService,
        private loggedInUserService: LoggedInUserService
    ) {}

    ngOnInit(): void {
        this.objMaster = { ...this.quoteTax };

        this.editForm = this.fb.group({
            Id: new FormControl(0, []),
            QuoteId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            QuoteAssetId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            QuoteChargeId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            TaxType: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            TaxRate: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            TaxableAmount: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            TaxAmount: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            JurisdictionId: new FormControl(false, []),
            TaxRegistrationSnapshot: new FormControl('', [Validators.maxLength(100)])
        });
        this.Caption = 'Create QuoteTax';
        this.loggedInUserService.getLookupOptions('quotes').subscribe((options) => (this.quoteidOptions = options));
        this.loggedInUserService.getLookupOptions('quote-assets').subscribe((options) => (this.quoteassetidOptions = options));
        this.loggedInUserService.getLookupOptions('quote-charges').subscribe((options) => (this.quotechargeidOptions = options));
        this.taxtypeOptions = this.loggedInUserService.getPicklistOptions('TaxType');
    }

    loadUI(): void {
        this.isLoading = true;
        this.quoteTaxService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.quoteTax = data;
                this.objMaster = { ...this.quoteTax };
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

    populateUI(obj: IQuoteTax): void {
        this.editForm.patchValue({
            Id: obj.Id || 0,
            QuoteId: obj.QuoteId || 0,
            QuoteAssetId: obj.QuoteAssetId || 0,
            QuoteChargeId: obj.QuoteChargeId || 0,
            TaxType: obj.TaxType || '',
            TaxRate: obj.TaxRate || 0,
            TaxableAmount: obj.TaxableAmount || 0,
            TaxAmount: obj.TaxAmount || 0,
            JurisdictionId: obj.JurisdictionId || false,
            TaxRegistrationSnapshot: obj.TaxRegistrationSnapshot || ''
        });
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/quoteTaxs/create']);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
        } else if (key == 'Refresh') {
            this.loadUI();
        }
    }

    onCancel(): void {
        this.quoteTax = { ...this.objMaster };
        var obj = this.quoteTax;
        this.editForm.patchValue({
            Id: obj.Id || 0,
            QuoteId: obj.QuoteId || 0,
            QuoteAssetId: obj.QuoteAssetId || 0,
            QuoteChargeId: obj.QuoteChargeId || 0,
            TaxType: obj.TaxType || '',
            TaxRate: obj.TaxRate || 0,
            TaxableAmount: obj.TaxableAmount || 0,
            TaxAmount: obj.TaxAmount || 0,
            JurisdictionId: obj.JurisdictionId || false,
            TaxRegistrationSnapshot: obj.TaxRegistrationSnapshot || ''
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
            QuoteId: formValues.QuoteId || 0,
            QuoteAssetId: formValues.QuoteAssetId || 0,
            QuoteChargeId: formValues.QuoteChargeId || 0,
            TaxType: formValues.TaxType || null,
            TaxRate: formValues.TaxRate || 0,
            TaxableAmount: formValues.TaxableAmount || 0,
            TaxAmount: formValues.TaxAmount || 0,
            JurisdictionId: formValues.JurisdictionId || false,
            TaxRegistrationSnapshot: formValues.TaxRegistrationSnapshot || null
        } as IQuoteTax;

        this.spinner.show();
        this.quoteTaxService.create(createdObj).subscribe({
            next: (data) => {
                // this.messageService.showSuccess(QuoteTax +  'Details Updated sucessfully.');
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
