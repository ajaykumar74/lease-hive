import { Component, DestroyRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IQuote } from './quote';
import { QuoteService } from './quote.service';

@Component({
    selector: 'app-quote-edit',
    standalone: false,
    templateUrl: './quote-edit.component.html',
    providers: [MessageService]
})
export class QuoteEditComponent implements OnInit {
    private readonly entityLookupDestroyRef = inject(DestroyRef);
    selectedId: number;
    isLoading: boolean = false;
    quote: IQuote = null;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    opportunityidOptions: ISelectItem[] = [];
    leaserequirementidOptions: ISelectItem[] = [];
    partyidOptions: ISelectItem[] = [];
    originatingorganisationidOptions: ISelectItem[] = [];
    quotestatusidOptions: ISelectItem[] = [];
    supersedesquoteidOptions: ISelectItem[] = [];
    billingfrequencyOptions: ISelectItem[] = [];
    recordstatusOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: IQuote = {} as IQuote;

    constructor(
        private activatedRouter: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private quoteService: QuoteService,
        private loggedInUserService: LoggedInUserService
    ) {}

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    ngOnInit(): void {
        this.objMaster = { ...this.quote };

        this.editForm = this.fb.group({
            Id: new FormControl(0, [Validators.required]),
            QuoteGroupNo: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
            VersionNo: new FormControl('', [Validators.required, Validators.maxLength(10)]),
            OpportunityId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
            LeaseRequirementId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            PartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            OriginatingOrganisationId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
            QuoteStatusId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
            QuoteDate: new FormControl(new Date(), [Validators.required]),
            ValidUntil: new FormControl(new Date(), [Validators.required]),
            CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            RequestedTermMonths: new FormControl(0, [Validators.min(0), Validators.max(255)]),
            BillingFrequency: new FormControl('', [Validators.maxLength(20)]),
            SubtotalAmount: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            TaxAmount: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            TotalAmount: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            SecurityDepositAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            PricingDateTime: new FormControl(new Date(), []),
            IssuedOn: new FormControl(new Date(), []),
            AcceptedOn: new FormControl(new Date(), []),
            SupersedesQuoteId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            Remarks: new FormControl('', [Validators.maxLength(100)]),
            RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            EffectiveFrom: new FormControl(new Date(), [Validators.required]),
            EffectiveTo: new FormControl(new Date(), [])
        });
        this.editForm.get('SubtotalAmount')?.valueChanges
            .pipe(takeUntilDestroyed(this.entityLookupDestroyRef))
            .subscribe(() => this.recalculateTotalAmount());
        this.editForm.get('TaxAmount')?.valueChanges
            .pipe(takeUntilDestroyed(this.entityLookupDestroyRef))
            .subscribe(() => this.recalculateTotalAmount());
        this.recalculateTotalAmount();
        this.loggedInUserService.bindEntityLookup(this.editForm, 'OpportunityId', 'opportunities', options => this.opportunityidOptions = options, error => this.messageService?.showError(error), this.entityLookupDestroyRef);
        this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseRequirementId', 'lease-requirements', options => this.leaserequirementidOptions = options, error => this.messageService?.showError(error), this.entityLookupDestroyRef, { OpportunityId: 'OpportunityId' });
        this.loggedInUserService.bindEntityLookup(this.editForm, 'PartyId', 'parties', options => this.partyidOptions = options, error => this.messageService?.showError(error), this.entityLookupDestroyRef, { OpportunityId: 'OpportunityId' });
        this.loggedInUserService.bindEntityLookup(this.editForm, 'SupersedesQuoteId', 'quotes', options => this.supersedesquoteidOptions = options, error => this.messageService?.showError(error), this.entityLookupDestroyRef, { OpportunityId: 'OpportunityId' });
        this.loggedInUserService.getOrganisationOptions().subscribe((options) => (this.originatingorganisationidOptions = options));
        this.loggedInUserService.bindEntityLookup(this.editForm, 'QuoteStatusId', 'quote-statuses', options => this.quotestatusidOptions = options, error => this.messageService?.showError(error), this.entityLookupDestroyRef);
        this.billingfrequencyOptions = this.loggedInUserService.getPicklistOptions('BillingFrequency');
        this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

        this.selectedId = this.activatedRouter.snapshot.params['id'];
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.loadUI();
        }, 500);
    }

    loadUI(): void {
        this.isLoading = true;
        this.quoteService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.quote = data.data;
                this.permission = data.permission;
                this.objMaster = { ...this.quote };
                this.populateUI(this.quote);
            },
            error: (err) => {
                this.messageService.showSuccess(err);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    populateUI(obj: IQuote): void {
        this.editForm.patchValue({
            Id: obj.Id || 0,
            QuoteGroupNo: obj.QuoteGroupNo || 0,
            VersionNo: obj.VersionNo || '',
            OpportunityId: obj.OpportunityId || 0,
            LeaseRequirementId: obj.LeaseRequirementId || 0,
            PartyId: obj.PartyId || 0,
            OriginatingOrganisationId: obj.OriginatingOrganisationId || 0,
            QuoteStatusId: obj.QuoteStatusId || 0,
            QuoteDate: obj.QuoteDate || new Date(),
            ValidUntil: obj.ValidUntil || new Date(),
            CurrencyCode: obj.CurrencyCode || '',
            RequestedTermMonths: obj.RequestedTermMonths || 0,
            BillingFrequency: obj.BillingFrequency || '',
            SubtotalAmount: obj.SubtotalAmount || 0,
            TaxAmount: obj.TaxAmount || 0,
            TotalAmount: obj.TotalAmount || 0,
            SecurityDepositAmount: obj.SecurityDepositAmount || 0,
            PricingDateTime: obj.PricingDateTime || new Date(),
            IssuedOn: obj.IssuedOn || new Date(),
            AcceptedOn: obj.AcceptedOn || new Date(),
            SupersedesQuoteId: obj.SupersedesQuoteId || 0,
            Remarks: obj.Remarks || '',
            RecordStatus: obj.RecordStatus || '',
            EffectiveFrom: obj.EffectiveFrom || new Date(),
            EffectiveTo: obj.EffectiveTo || new Date()
        });
        this.recalculateTotalAmount();

        this.Caption = 'Quote Details #' + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/business/origination/quotes/create', { id: -1 }]);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
        }
    }

    onCancel(): void {
        this.quote = { ...this.objMaster };
        var obj = this.quote;
        this.editForm.patchValue({
            Id: obj.Id || 0,
            QuoteGroupNo: obj.QuoteGroupNo || 0,
            VersionNo: obj.VersionNo || '',
            OpportunityId: obj.OpportunityId || 0,
            LeaseRequirementId: obj.LeaseRequirementId || 0,
            PartyId: obj.PartyId || 0,
            OriginatingOrganisationId: obj.OriginatingOrganisationId || 0,
            QuoteStatusId: obj.QuoteStatusId || 0,
            QuoteDate: obj.QuoteDate || new Date(),
            ValidUntil: obj.ValidUntil || new Date(),
            CurrencyCode: obj.CurrencyCode || '',
            RequestedTermMonths: obj.RequestedTermMonths || 0,
            BillingFrequency: obj.BillingFrequency || '',
            SubtotalAmount: obj.SubtotalAmount || 0,
            TaxAmount: obj.TaxAmount || 0,
            TotalAmount: obj.TotalAmount || 0,
            SecurityDepositAmount: obj.SecurityDepositAmount || 0,
            PricingDateTime: obj.PricingDateTime || new Date(),
            IssuedOn: obj.IssuedOn || new Date(),
            AcceptedOn: obj.AcceptedOn || new Date(),
            SupersedesQuoteId: obj.SupersedesQuoteId || 0,
            Remarks: obj.Remarks || '',
            RecordStatus: obj.RecordStatus || '',
            EffectiveFrom: obj.EffectiveFrom || new Date(),
            EffectiveTo: obj.EffectiveTo || new Date()
        });

        this.editForm.reset();
    }

    Save(): void {
        this.recalculateTotalAmount();
        if (!this.editForm.valid) {
            this.messageService.showError('One or more validation failed. Please clear error to continue...');
            return;
        }

        const formValues = this.editForm.value;
        if (Number(formValues.SupersedesQuoteId) > 0 && Number(formValues.SupersedesQuoteId) === Number(this.quote?.Id)) {
            this.messageService.showError('A quote cannot supersede itself.');
            return;
        }
        var updatedObj = {
            Id: this.objMaster.Id,
            RowVersionStr: this.objMaster.RowVersionStr,
            QuoteGroupNo: formValues.QuoteGroupNo || 0,
            VersionNo: formValues.VersionNo || null,
            OpportunityId: formValues.OpportunityId || 0,
            LeaseRequirementId: formValues.LeaseRequirementId || 0,
            PartyId: formValues.PartyId || 0,
            OriginatingOrganisationId: formValues.OriginatingOrganisationId || 0,
            QuoteStatusId: formValues.QuoteStatusId || 0,
            QuoteDate: formValues.QuoteDate || null,
            ValidUntil: formValues.ValidUntil || null,
            CurrencyCode: formValues.CurrencyCode || null,
            RequestedTermMonths: formValues.RequestedTermMonths || 0,
            BillingFrequency: formValues.BillingFrequency || null,
            SubtotalAmount: formValues.SubtotalAmount || 0,
            TaxAmount: formValues.TaxAmount || 0,
            TotalAmount: formValues.TotalAmount || 0,
            SecurityDepositAmount: formValues.SecurityDepositAmount || 0,
            PricingDateTime: formValues.PricingDateTime || null,
            IssuedOn: formValues.IssuedOn || null,
            AcceptedOn: formValues.AcceptedOn || null,
            SupersedesQuoteId: formValues.SupersedesQuoteId || 0,
            Remarks: formValues.Remarks || null,
            RecordStatus: formValues.RecordStatus || null,
            EffectiveFrom: new Date(),
            EffectiveTo: null
        } as IQuote;

        this.spinner.show();
        this.quoteService.update(this.quote.Id, updatedObj).subscribe({
            next: (data) => {
                //this.messageService.showSuccess(Quote +  'Details Updated sucessfully.');
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

    private recalculateTotalAmount(): void {
        const rentalAmount = Number(this.editForm?.get('SubtotalAmount')?.value) || 0;
        const taxAmount = Number(this.editForm?.get('TaxAmount')?.value) || 0;

        this.editForm?.get('TotalAmount')?.setValue(rentalAmount + taxAmount, { emitEvent: false });
    }
}
