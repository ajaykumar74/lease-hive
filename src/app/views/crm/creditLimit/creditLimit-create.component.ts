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
import { ICreditLimit } from './creditLimit';
import { CreditLimitService } from './creditLimit.service';

@Component({
    selector: 'app-creditLimit-create',
    standalone: false,
    templateUrl: './creditLimit-create.component.html',
    providers: [MessageService]
})
export class CreditLimitCreateComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    creditLimit: ICreditLimit = null;
    partyidOptions: ISelectItem[] = [];
    organisationidOptions: ISelectItem[] = [];
    creditdecisionidOptions: ISelectItem[] = [];
    currencycodeOptions: ISelectItem[] = [];
    limitstatusOptions: ISelectItem[] = [];
    recordstatusOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: ICreditLimit = {} as ICreditLimit;

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private creditLimitService: CreditLimitService,
        private loggedInUserService: LoggedInUserService
    ) {}

    ngOnInit(): void {
        this.objMaster = { ...this.creditLimit };

        this.editForm = this.fb.group({
            Id: new FormControl(0, []),
            PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            OrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            CreditDecisionId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            LimitAmount: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            EffectiveFrom: new FormControl(new Date(), [Validators.required]),
            EffectiveTo: new FormControl(new Date(), []),
            LimitStatus: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            Remarks: new FormControl('', [Validators.maxLength(100)]),
            RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20)])
        });
        this.Caption = 'Create CreditLimit';
        this.loggedInUserService.getPartyOptions().subscribe((options) => (this.partyidOptions = options));
        this.loggedInUserService.getOrganisationOptions().subscribe((options) => (this.organisationidOptions = options));
        this.loggedInUserService.getLookupOptions('credit-decisions').subscribe((options) => (this.creditdecisionidOptions = options));
        this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
        this.limitstatusOptions = this.loggedInUserService.getPicklistOptions('LimitStatus');
        this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');
    }

    loadUI(): void {
        this.isLoading = true;
        this.creditLimitService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.creditLimit = data;
                this.objMaster = { ...this.creditLimit };
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

    populateUI(obj: ICreditLimit): void {
        this.editForm.patchValue({
            Id: obj.Id || 0,
            PartyId: obj.PartyId || 0,
            OrganisationId: obj.OrganisationId || 0,
            CreditDecisionId: obj.CreditDecisionId || 0,
            CurrencyCode: obj.CurrencyCode || '',
            LimitAmount: obj.LimitAmount || 0,
            EffectiveFrom: obj.EffectiveFrom || new Date(),
            EffectiveTo: obj.EffectiveTo || new Date(),
            LimitStatus: obj.LimitStatus || '',
            Remarks: obj.Remarks || '',
            RecordStatus: obj.RecordStatus || ''
        });
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/creditLimits/create']);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
        } else if (key == 'Refresh') {
            this.loadUI();
        }
    }

    onCancel(): void {
        this.creditLimit = { ...this.objMaster };
        var obj = this.creditLimit;
        this.editForm.patchValue({
            Id: obj.Id || 0,
            PartyId: obj.PartyId || 0,
            OrganisationId: obj.OrganisationId || 0,
            CreditDecisionId: obj.CreditDecisionId || 0,
            CurrencyCode: obj.CurrencyCode || '',
            LimitAmount: obj.LimitAmount || 0,
            EffectiveFrom: obj.EffectiveFrom || new Date(),
            EffectiveTo: obj.EffectiveTo || new Date(),
            LimitStatus: obj.LimitStatus || '',
            Remarks: obj.Remarks || '',
            RecordStatus: obj.RecordStatus || ''
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
            PartyId: formValues.PartyId || 0,
            OrganisationId: formValues.OrganisationId || 0,
            CreditDecisionId: formValues.CreditDecisionId || 0,
            CurrencyCode: formValues.CurrencyCode || null,
            LimitAmount: formValues.LimitAmount || 0,
            EffectiveFrom: formValues.EffectiveFrom || null,
            EffectiveTo: formValues.EffectiveTo || null,
            LimitStatus: formValues.LimitStatus || null,
            Remarks: formValues.Remarks || null,
            RecordStatus: formValues.RecordStatus || null
        } as ICreditLimit;

        this.spinner.show();
        this.creditLimitService.create(createdObj).subscribe({
            next: (data) => {
                // this.messageService.showSuccess(CreditLimit +  'Details Updated sucessfully.');
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
