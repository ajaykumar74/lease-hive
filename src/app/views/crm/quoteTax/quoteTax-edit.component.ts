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
import { IQuoteTax } from './quoteTax';
import { QuoteTaxService } from './quoteTax.service';

@Component({
    selector: 'app-quoteTax-edit',
    standalone: false,
    templateUrl: './quoteTax-edit.component.html',
    providers: [MessageService]
})
export class QuoteTaxEditComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    quoteTax: IQuoteTax = null;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    quoteidOptions: ISelectItem[] = [];
    quoteassetidOptions: ISelectItem[] = [];
    quotechargeidOptions: ISelectItem[] = [];
    taxtypeOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: IQuoteTax = {} as IQuoteTax;

    constructor(
        private activatedRouter: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private quoteTaxService: QuoteTaxService,
        private loggedInUserService: LoggedInUserService
    ) {}

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    ngOnInit(): void {
        this.objMaster = { ...this.quoteTax };

        this.editForm = this.fb.group({
            Id: new FormControl(0, [Validators.required]),
            QuoteId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            QuoteAssetId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            QuoteChargeId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            TaxType: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            TaxRate: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            TaxableAmount: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            TaxAmount: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            JurisdictionId: new FormControl(false),
            TaxRegistrationSnapshot: new FormControl('', [Validators.maxLength(100)])
        });
        this.loggedInUserService.getLookupOptions('quotes').subscribe((options) => (this.quoteidOptions = options));
        this.loggedInUserService.getLookupOptions('quote-assets').subscribe((options) => (this.quoteassetidOptions = options));
        this.loggedInUserService.getLookupOptions('quote-charges').subscribe((options) => (this.quotechargeidOptions = options));
        this.taxtypeOptions = this.loggedInUserService.getPicklistOptions('TaxType');

        this.selectedId = this.activatedRouter.snapshot.params['id'];
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.loadUI();
        }, 500);
    }

    loadUI(): void {
        this.isLoading = true;
        this.quoteTaxService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.quoteTax = data.data;
                this.permission = data.permission;
                this.objMaster = { ...this.quoteTax };
                this.populateUI(this.quoteTax);
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
        this.loggedInUserService.getLookupOptions('quote-charges', obj.QuoteChargeId).subscribe((options) => (this.quotechargeidOptions = options));
        this.loggedInUserService.getLookupOptions('quote-assets', obj.QuoteAssetId).subscribe((options) => (this.quoteassetidOptions = options));
        this.loggedInUserService.getLookupOptions('quotes', obj.QuoteId).subscribe((options) => (this.quoteidOptions = options));
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

        this.Caption = 'QuoteTax Details #' + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/quoteTax/create', { id: -1 }]);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
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
        var updatedObj = {
            Id: this.objMaster.Id,
            RowVersionStr: this.objMaster.RowVersionStr,
            QuoteId: formValues.QuoteId || null,
            QuoteAssetId: formValues.QuoteAssetId || null,
            QuoteChargeId: formValues.QuoteChargeId || null,
            TaxType: formValues.TaxType || null,
            TaxRate: formValues.TaxRate || null,
            TaxableAmount: formValues.TaxableAmount || null,
            TaxAmount: formValues.TaxAmount || null,
            JurisdictionId: formValues.JurisdictionId || null,
            TaxRegistrationSnapshot: formValues.TaxRegistrationSnapshot || null
        } as IQuoteTax;

        this.spinner.show();
        this.quoteTaxService.update(this.quoteTax.Id, updatedObj).subscribe({
            next: (data) => {
                //this.messageService.showSuccess(QuoteTax +  'Details Updated sucessfully.');
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
