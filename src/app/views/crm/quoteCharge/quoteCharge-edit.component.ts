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
import { IQuoteCharge } from './quoteCharge';
import { QuoteChargeService } from './quoteCharge.service';

@Component({
    selector: 'app-quoteCharge-edit',
    standalone: false,
    templateUrl: './quoteCharge-edit.component.html',
    providers: [MessageService]
})
export class QuoteChargeEditComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    quoteCharge: IQuoteCharge = null;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    quoteidOptions: ISelectItem[] = [];
    quoteassetidOptions: ISelectItem[] = [];
    calculationtypecodeOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: IQuoteCharge = {} as IQuoteCharge;

    constructor(
        private activatedRouter: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private quoteChargeService: QuoteChargeService,
        private loggedInUserService: LoggedInUserService
    ) {}

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    ngOnInit(): void {
        this.objMaster = { ...this.quoteCharge };

        this.editForm = this.fb.group({
            Id: new FormControl(0, [Validators.required]),
            QuoteId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            QuoteAssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            ChargeType: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            ChargeDescription: new FormControl('', [Validators.required, Validators.maxLength(100)]),
            CalculationTypeCode: new FormControl('', [Validators.maxLength(20)]),
            RateOrAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            ChargeAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            IsRecurring: new FormControl(false, [Validators.required]),
            TaxCode: new FormControl('', [Validators.required, Validators.maxLength(0)])
        });
        this.loggedInUserService.getLookupOptions('quotes').subscribe((options) => (this.quoteidOptions = options));
        this.loggedInUserService.getLookupOptions('quote-assets').subscribe((options) => (this.quoteassetidOptions = options));
        this.calculationtypecodeOptions.push({ Text: 'FIXED', Value: 'FIXED' });
        this.calculationtypecodeOptions.push({ Text: 'PERCENT', Value: 'PERCENT' });
        this.calculationtypecodeOptions.push({ Text: 'PER_UNIT', Value: 'PER_UNIT' });

        this.selectedId = this.activatedRouter.snapshot.params['id'];
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.loadUI();
        }, 500);
    }

    loadUI(): void {
        this.isLoading = true;
        this.quoteChargeService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.quoteCharge = data.data;
                this.permission = data.permission;
                this.objMaster = { ...this.quoteCharge };
                this.populateUI(this.quoteCharge);
            },
            error: (err) => {
                this.messageService.showSuccess(err);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    populateUI(obj: IQuoteCharge): void {
        this.loggedInUserService.getLookupOptions('quote-assets', obj.QuoteAssetId).subscribe((options) => (this.quoteassetidOptions = options));
        this.loggedInUserService.getLookupOptions('quotes', obj.QuoteId).subscribe((options) => (this.quoteidOptions = options));
        this.editForm.patchValue({
            Id: obj.Id || 0,
            QuoteId: obj.QuoteId || 0,
            QuoteAssetId: obj.QuoteAssetId || 0,
            ChargeType: obj.ChargeType || '',
            ChargeDescription: obj.ChargeDescription || '',
            CalculationTypeCode: obj.CalculationTypeCode || '',
            RateOrAmount: obj.RateOrAmount || 0,
            ChargeAmount: obj.ChargeAmount || 0,
            IsRecurring: obj.IsRecurring || false,
            TaxCode: obj.TaxCode || ''
        });

        this.Caption = 'QuoteCharge Details #' + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['origination/quotes/charges/create', { id: -1 }]);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
        }
    }

    onCancel(): void {
        this.quoteCharge = { ...this.objMaster };
        var obj = this.quoteCharge;
        this.editForm.patchValue({
            Id: obj.Id || 0,
            QuoteId: obj.QuoteId || 0,
            QuoteAssetId: obj.QuoteAssetId || 0,
            ChargeType: obj.ChargeType || '',
            ChargeDescription: obj.ChargeDescription || '',
            CalculationTypeCode: obj.CalculationTypeCode || '',
            RateOrAmount: obj.RateOrAmount || 0,
            ChargeAmount: obj.ChargeAmount || 0,
            IsRecurring: obj.IsRecurring || false,
            TaxCode: obj.TaxCode || ''
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
            ChargeType: formValues.ChargeType || null,
            ChargeDescription: formValues.ChargeDescription || null,
            CalculationTypeCode: formValues.CalculationTypeCode || null,
            RateOrAmount: formValues.RateOrAmount || null,
            ChargeAmount: formValues.ChargeAmount || null,
            IsRecurring: formValues.IsRecurring || null,
            TaxCode: formValues.TaxCode || null
        } as IQuoteCharge;

        this.spinner.show();
        this.quoteChargeService.update(this.quoteCharge.Id, updatedObj).subscribe({
            next: (data) => {
                //this.messageService.showSuccess(QuoteCharge +  'Details Updated sucessfully.');
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
