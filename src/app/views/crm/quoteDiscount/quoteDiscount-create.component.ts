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
import { IQuoteDiscount } from './quoteDiscount';
import { QuoteDiscountService } from './quoteDiscount.service';

@Component({
    selector: 'app-quoteDiscount-create',
    standalone: false,
    templateUrl: './quoteDiscount-create.component.html',
    providers: [MessageService]
})
export class QuoteDiscountCreateComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    quoteDiscount: IQuoteDiscount = null;
    quoteidOptions: ISelectItem[] = [];
    quoteassetidOptions: ISelectItem[] = [];
    discounttypecodeOptions: ISelectItem[] = [];
    approvedbyOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: IQuoteDiscount = {} as IQuoteDiscount;

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private quoteDiscountService: QuoteDiscountService,
        private loggedInUserService: LoggedInUserService
    ) {}

    ngOnInit(): void {
        this.objMaster = { ...this.quoteDiscount };

        this.editForm = this.fb.group({
            Id: new FormControl(0, []),
            QuoteId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            QuoteAssetId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            DiscountTypeCode: new FormControl('', [Validators.maxLength(20)]),
            DiscountValue: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
            DiscountAmount: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            ReasonCode: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            ApprovalRequestId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            ApprovedBy: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            ApprovedOn: new FormControl(new Date(), [])
        });
        this.Caption = 'Create QuoteDiscount';
        this.loggedInUserService.getLookupOptions('quotes').subscribe((options) => (this.quoteidOptions = options));
        this.loggedInUserService.getLookupOptions('quote-assets').subscribe((options) => (this.quoteassetidOptions = options));
        this.discounttypecodeOptions.push({ Text: 'PERCENT', Value: 'PERCENT' });
        this.discounttypecodeOptions.push({ Text: 'FIXED', Value: 'FIXED' });
        this.discounttypecodeOptions.push({ Text: 'RATE_OVERRIDE', Value: 'RATE_OVERRIDE' });
        this.loggedInUserService.getApplicationUserOptions().subscribe((options) => (this.approvedbyOptions = options));
    }

    loadUI(): void {
        this.isLoading = true;
        this.quoteDiscountService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.quoteDiscount = data;
                this.objMaster = { ...this.quoteDiscount };
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

    populateUI(obj: IQuoteDiscount): void {
        this.editForm.patchValue({
            Id: obj.Id || 0,
            QuoteId: obj.QuoteId || 0,
            QuoteAssetId: obj.QuoteAssetId || 0,
            DiscountTypeCode: obj.DiscountTypeCode || '',
            DiscountValue: obj.DiscountValue || 0,
            DiscountAmount: obj.DiscountAmount || 0,
            ReasonCode: obj.ReasonCode || '',
            ApprovalRequestId: obj.ApprovalRequestId || 0,
            ApprovedBy: obj.ApprovedBy || 0,
            ApprovedOn: obj.ApprovedOn || new Date()
        });
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/quoteDiscounts/create']);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
        } else if (key == 'Refresh') {
            this.loadUI();
        }
    }

    onCancel(): void {
        this.quoteDiscount = { ...this.objMaster };
        var obj = this.quoteDiscount;
        this.editForm.patchValue({
            Id: obj.Id || 0,
            QuoteId: obj.QuoteId || 0,
            QuoteAssetId: obj.QuoteAssetId || 0,
            DiscountTypeCode: obj.DiscountTypeCode || '',
            DiscountValue: obj.DiscountValue || 0,
            DiscountAmount: obj.DiscountAmount || 0,
            ReasonCode: obj.ReasonCode || '',
            ApprovalRequestId: obj.ApprovalRequestId || 0,
            ApprovedBy: obj.ApprovedBy || 0,
            ApprovedOn: obj.ApprovedOn || new Date()
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
            Id: this.objMaster.Id,
            RowVersionStr: this.objMaster.RowVersionStr,
            QuoteId: formValues.QuoteId || 0,
            QuoteAssetId: formValues.QuoteAssetId || 0,
            DiscountTypeCode: formValues.DiscountTypeCode || null,
            DiscountValue: formValues.DiscountValue || null,
            DiscountAmount: formValues.DiscountAmount || 0,
            ReasonCode: formValues.ReasonCode || null,
            ApprovalRequestId: formValues.ApprovalRequestId || 0,
            ApprovedBy: formValues.ApprovedBy || 0,
            ApprovedOn: formValues.ApprovedOn || null
        } as IQuoteDiscount;

        this.spinner.show();
        this.quoteDiscountService.create(createdObj).subscribe({
            next: (data) => {
                // this.messageService.showSuccess(QuoteDiscount +  'Details Updated sucessfully.');
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
