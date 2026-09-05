import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { ICreditApplicantParty } from './creditApplicantParty';
import { CreditApplicantPartyService } from './creditApplicantParty.service';

@Component({
    selector: 'app-creditApplicantParty-edit',
    standalone: false,
    templateUrl: './creditApplicantParty-edit.component.html',
    providers: [MessageService]
})
export class CreditApplicantPartyEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);
    selectedId: number;
    isLoading: boolean = false;
    creditApplicantParty: ICreditApplicantParty = null;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    creditapplicationidOptions: ISelectItem[] = [];
    partyidOptions: ISelectItem[] = [];
    creditpartyroleidOptions: ISelectItem[] = [];
    currencycodeOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: ICreditApplicantParty = {} as ICreditApplicantParty;

    constructor(
        private activatedRouter: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private creditApplicantPartyService: CreditApplicantPartyService,
        private loggedInUserService: LoggedInUserService
    ) {}

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    ngOnInit(): void {
        this.objMaster = { ...this.creditApplicantParty };

        this.editForm = this.fb.group({
            Id: new FormControl(0, [Validators.required]),
            CreditApplicationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            CreditPartyRoleId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            IsPrimary: new FormControl(false),
            GuaranteeAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20)])
        });
        this.loggedInUserService.getLookupOptions('credit-applications').subscribe((options) => (this.creditapplicationidOptions = options));
        this.loggedInUserService.getPartyOptions().subscribe((options) => (this.partyidOptions = options));
        this.loggedInUserService.bindEntityLookup(this.editForm, 'CreditPartyRoleId', 'party-roles',
      options => this.creditpartyroleidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"PartyId":"PartyId"});
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
        this.creditApplicantPartyService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.creditApplicantParty = data.data;
                this.permission = data.permission;
                this.objMaster = { ...this.creditApplicantParty };
                this.populateUI(this.creditApplicantParty);
            },
            error: (err) => {
                this.messageService.showSuccess(err);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    populateUI(obj: ICreditApplicantParty): void {
        this.loggedInUserService.getLookupOptions('credit-applications', obj.CreditApplicationId).subscribe((options) => (this.creditapplicationidOptions = options));
        this.editForm.patchValue({
            Id: obj.Id || 0,
            CreditApplicationId: obj.CreditApplicationId || 0,
            PartyId: obj.PartyId || 0,
            CreditPartyRoleId: obj.CreditPartyRoleId || 0,
            IsPrimary: obj.IsPrimary || false,
            GuaranteeAmount: obj.GuaranteeAmount || 0,
            CurrencyCode: obj.CurrencyCode || ''
        });

        this.Caption = 'CreditApplicantParty Details #' + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/business/origination/credit/ApplicantPartys/create', { id: -1 }]);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
        }
    }

    onCancel(): void {
        this.creditApplicantParty = { ...this.objMaster };
        var obj = this.creditApplicantParty;
        this.editForm.patchValue({
            Id: obj.Id || 0,
            CreditApplicationId: obj.CreditApplicationId || 0,
            PartyId: obj.PartyId || 0,
            CreditPartyRoleId: obj.CreditPartyRoleId || 0,
            IsPrimary: obj.IsPrimary || false,
            GuaranteeAmount: obj.GuaranteeAmount || 0,
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
            CreditApplicationId: formValues.CreditApplicationId || null,
            PartyId: formValues.PartyId || null,
            CreditPartyRoleId: formValues.CreditPartyRoleId || null,
            IsPrimary: formValues.IsPrimary || null,
            GuaranteeAmount: formValues.GuaranteeAmount || null,
            CurrencyCode: formValues.CurrencyCode || null
        } as ICreditApplicantParty;

        this.spinner.show();
        this.creditApplicantPartyService.update(this.creditApplicantParty.Id, updatedObj).subscribe({
            next: (data) => {
                //this.messageService.showSuccess(CreditApplicantParty +  'Details Updated sucessfully.');
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
