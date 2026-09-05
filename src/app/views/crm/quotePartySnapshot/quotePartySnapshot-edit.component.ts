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
import { IQuotePartySnapshot } from './quotePartySnapshot';
import { QuotePartySnapshotService } from './quotePartySnapshot.service';

@Component({
    selector: 'app-quotePartySnapshot-edit',
    standalone: false,
    templateUrl: './quotePartySnapshot-edit.component.html',
    providers: [MessageService]
})
export class QuotePartySnapshotEditComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    quotePartySnapshot: IQuotePartySnapshot = null;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    quoteidOptions: ISelectItem[] = [];
    partyidOptions: ISelectItem[] = [];
    currencycodeOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: IQuotePartySnapshot = {} as IQuotePartySnapshot;

    constructor(
        private activatedRouter: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private quotePartySnapshotService: QuotePartySnapshotService,
        private loggedInUserService: LoggedInUserService
    ) {}

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    ngOnInit(): void {
        this.objMaster = { ...this.quotePartySnapshot };

        this.editForm = this.fb.group({
            Id: new FormControl(0, [Validators.required]),
            QuoteId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            LegalName: new FormControl('', [Validators.required, Validators.maxLength(150)]),
            TaxRegistrationNo: new FormControl('', [Validators.maxLength(20)]),
            BillingAddress: new FormControl('', [Validators.maxLength(150)]),
            ContactName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
            ContactEmail: new FormControl('', [Validators.required, Validators.maxLength(100)]),
            ContactPhone: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            SnapshotOn: new FormControl(new Date(), [Validators.required]),
            CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20)])
        });
        this.loggedInUserService.getLookupOptions('quotes').subscribe((options) => (this.quoteidOptions = options));
        this.loggedInUserService.getPartyOptions().subscribe((options) => (this.partyidOptions = options));
        this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');

        this.selectedId = this.activatedRouter.snapshot.params['id'];
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.loadUI();
        }, 500);
    }

    loadUI(): void {
        this.isLoading = true;
        this.quotePartySnapshotService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.quotePartySnapshot = data.data;
                this.permission = data.permission;
                this.objMaster = { ...this.quotePartySnapshot };
                this.populateUI(this.quotePartySnapshot);
            },
            error: (err) => {
                this.messageService.showSuccess(err);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    populateUI(obj: IQuotePartySnapshot): void {
        this.loggedInUserService.getLookupOptions('quotes', obj.QuoteId).subscribe((options) => (this.quoteidOptions = options));
        this.editForm.patchValue({
            Id: obj.Id || 0,
            QuoteId: obj.QuoteId || 0,
            PartyId: obj.PartyId || 0,
            LegalName: obj.LegalName || '',
            TaxRegistrationNo: obj.TaxRegistrationNo || '',
            BillingAddress: obj.BillingAddress || '',
            ContactName: obj.ContactName || '',
            ContactEmail: obj.ContactEmail || '',
            ContactPhone: obj.ContactPhone || '',
            SnapshotOn: obj.SnapshotOn || new Date(),
            CurrencyCode: obj.CurrencyCode || ''
        });

        this.Caption = 'QuotePartySnapshot Details #' + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/quotePartySnapshot/create', { id: -1 }]);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
        }
    }

    onCancel(): void {
        this.quotePartySnapshot = { ...this.objMaster };
        var obj = this.quotePartySnapshot;
        this.editForm.patchValue({
            Id: obj.Id || 0,
            QuoteId: obj.QuoteId || 0,
            PartyId: obj.PartyId || 0,
            LegalName: obj.LegalName || '',
            TaxRegistrationNo: obj.TaxRegistrationNo || '',
            BillingAddress: obj.BillingAddress || '',
            ContactName: obj.ContactName || '',
            ContactEmail: obj.ContactEmail || '',
            ContactPhone: obj.ContactPhone || '',
            SnapshotOn: obj.SnapshotOn || new Date(),
            CurrencyCode: obj.CurrencyCode || ''
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
            PartyId: formValues.PartyId || null,
            LegalName: formValues.LegalName || null,
            TaxRegistrationNo: formValues.TaxRegistrationNo || null,
            BillingAddress: formValues.BillingAddress || null,
            ContactName: formValues.ContactName || null,
            ContactEmail: formValues.ContactEmail || null,
            ContactPhone: formValues.ContactPhone || null,
            SnapshotOn: formValues.SnapshotOn || null,
            CurrencyCode: formValues.CurrencyCode || null
        } as IQuotePartySnapshot;

        this.spinner.show();
        this.quotePartySnapshotService.update(this.quotePartySnapshot.Id, updatedObj).subscribe({
            next: (data) => {
                //this.messageService.showSuccess(QuotePartySnapshot +  'Details Updated sucessfully.');
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
