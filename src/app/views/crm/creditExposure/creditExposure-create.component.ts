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
import { ICreditExposure } from './creditExposure';
import { CreditExposureService } from './creditExposure.service';

@Component({
    selector: 'app-creditExposure-create',
    standalone: false,
    templateUrl: './creditExposure-create.component.html',
    providers: [MessageService]
})
export class CreditExposureCreateComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    creditExposure: ICreditExposure = null;
    creditassessmentidOptions: ISelectItem[] = [];
    partyidOptions: ISelectItem[] = [];
    organisationidOptions: ISelectItem[] = [];
    exposuretypeOptions: ISelectItem[] = [];
    currencycodeOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: ICreditExposure = {} as ICreditExposure;

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private creditExposureService: CreditExposureService,
        private loggedInUserService: LoggedInUserService
    ) {}

    ngOnInit(): void {
        this.objMaster = { ...this.creditExposure };

        this.editForm = this.fb.group({
            Id: new FormControl(0, []),
            CreditAssessmentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            OrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            ExposureType: new FormControl('', [Validators.required, Validators.maxLength(100)]),
            CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            PrincipalOutstanding: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            UndrawnCommitment: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            ProposedExposure: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            TotalExposure: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            AsOfDate: new FormControl(new Date(), [Validators.required])
        });
        this.Caption = 'Create CreditExposure';
        this.loggedInUserService.getLookupOptions('credit-assessments').subscribe((options) => (this.creditassessmentidOptions = options));
        this.loggedInUserService.getPartyOptions().subscribe((options) => (this.partyidOptions = options));
        this.loggedInUserService.getOrganisationOptions().subscribe((options) => (this.organisationidOptions = options));
        this.exposuretypeOptions = this.loggedInUserService.getPicklistOptions('ExposureType');
        this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
    }

    loadUI(): void {
        this.isLoading = true;
        this.creditExposureService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.creditExposure = data;
                this.objMaster = { ...this.creditExposure };
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

    populateUI(obj: ICreditExposure): void {
        this.editForm.patchValue({
            Id: obj.Id || 0,
            CreditAssessmentId: obj.CreditAssessmentId || 0,
            PartyId: obj.PartyId || 0,
            OrganisationId: obj.OrganisationId || 0,
            ExposureType: obj.ExposureType || '',
            CurrencyCode: obj.CurrencyCode || '',
            PrincipalOutstanding: obj.PrincipalOutstanding || 0,
            UndrawnCommitment: obj.UndrawnCommitment || 0,
            ProposedExposure: obj.ProposedExposure || 0,
            TotalExposure: obj.TotalExposure || 0,
            AsOfDate: obj.AsOfDate || new Date()
        });
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/creditExposures/create']);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
        } else if (key == 'Refresh') {
            this.loadUI();
        }
    }

    onCancel(): void {
        this.creditExposure = { ...this.objMaster };
        var obj = this.creditExposure;
        this.editForm.patchValue({
            Id: obj.Id || 0,
            CreditAssessmentId: obj.CreditAssessmentId || 0,
            PartyId: obj.PartyId || 0,
            OrganisationId: obj.OrganisationId || 0,
            ExposureType: obj.ExposureType || '',
            CurrencyCode: obj.CurrencyCode || '',
            PrincipalOutstanding: obj.PrincipalOutstanding || 0,
            UndrawnCommitment: obj.UndrawnCommitment || 0,
            ProposedExposure: obj.ProposedExposure || 0,
            TotalExposure: obj.TotalExposure || 0,
            AsOfDate: obj.AsOfDate || new Date()
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
            CreditAssessmentId: formValues.CreditAssessmentId || 0,
            PartyId: formValues.PartyId || 0,
            OrganisationId: formValues.OrganisationId || 0,
            ExposureType: formValues.ExposureType || null,
            CurrencyCode: formValues.CurrencyCode || null,
            PrincipalOutstanding: formValues.PrincipalOutstanding || 0,
            UndrawnCommitment: formValues.UndrawnCommitment || 0,
            ProposedExposure: formValues.ProposedExposure || 0,
            TotalExposure: formValues.TotalExposure || 0,
            AsOfDate: formValues.AsOfDate || null
        } as ICreditExposure;

        this.spinner.show();
        this.creditExposureService.create(createdObj).subscribe({
            next: (data) => {
                // this.messageService.showSuccess(CreditExposure +  'Details Updated sucessfully.');
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
