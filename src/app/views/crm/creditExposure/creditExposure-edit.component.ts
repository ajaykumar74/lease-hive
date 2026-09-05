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
import { ICreditExposure } from './creditExposure';
import { CreditExposureService } from './creditExposure.service';

@Component({
    selector: 'app-creditExposure-edit',
    standalone: false,
    templateUrl: './creditExposure-edit.component.html',
    providers: [MessageService]
})
export class CreditExposureEditComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    creditExposure: ICreditExposure = null;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    creditassessmentidOptions: ISelectItem[] = [];
    partyidOptions: ISelectItem[] = [];
    organisationidOptions: ISelectItem[] = [];
    exposuretypeOptions: ISelectItem[] = [];
    currencycodeOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: ICreditExposure = {} as ICreditExposure;

    constructor(
        private activatedRouter: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private creditExposureService: CreditExposureService,
        private loggedInUserService: LoggedInUserService
    ) {}

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    ngOnInit(): void {
        this.objMaster = { ...this.creditExposure };

        this.editForm = this.fb.group({
            Id: new FormControl(0, [Validators.required]),
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
        this.loggedInUserService.getLookupOptions('credit-assessments').subscribe((options) => (this.creditassessmentidOptions = options));
        this.loggedInUserService.getPartyOptions().subscribe((options) => (this.partyidOptions = options));
        this.loggedInUserService.getOrganisationOptions().subscribe((options) => (this.organisationidOptions = options));
        this.exposuretypeOptions = this.loggedInUserService.getPicklistOptions('ExposureType');
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
        this.creditExposureService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.creditExposure = data.data;
                this.permission = data.permission;
                this.objMaster = { ...this.creditExposure };
                this.populateUI(this.creditExposure);
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
        this.loggedInUserService.getLookupOptions('credit-assessments', obj.CreditAssessmentId).subscribe((options) => (this.creditassessmentidOptions = options));
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

        this.Caption = 'CreditExposure Details #' + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['origination/credit/exposure/create', { id: -1 }]);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
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
        var updatedObj = {
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
        this.creditExposureService.update(this.creditExposure.Id, updatedObj).subscribe({
            next: (data) => {
                //this.messageService.showSuccess(CreditExposure +  'Details Updated sucessfully.');
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
