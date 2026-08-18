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
import { ICreditApplication } from './creditApplication';
import { CreditApplicationService } from './creditApplication.service';

@Component({
    selector: 'app-creditApplication-create',
    standalone: false,
    templateUrl: './creditApplication-create.component.html',
    providers: [MessageService]
})
export class CreditApplicationCreateComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    creditApplication: ICreditApplication = null;
    opportunityidOptions: ISelectItem[] = [];
    partyidOptions: ISelectItem[] = [];
    originatingorganisationidOptions: ISelectItem[] = [];
    creditapplicationstatusidOptions: ISelectItem[] = [];
    currencycodeOptions: ISelectItem[] = [];
    risksegmentcodeOptions: ISelectItem[] = [];
    assignedanalystuseridOptions: ISelectItem[] = [];
    recordstatusOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: ICreditApplication = {} as ICreditApplication;

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private creditApplicationService: CreditApplicationService,
        private loggedInUserService: LoggedInUserService
    ) {}

    ngOnInit(): void {
        this.objMaster = { ...this.creditApplication };

        this.editForm = this.fb.group({
            Id: new FormControl(0, []),
            OpportunityId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            OriginatingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            CreditApplicationStatusId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            ApplicationDate: new FormControl(new Date(), [Validators.required]),
            RequestedLimitAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            RequestedTermMonths: new FormControl(0, [Validators.min(0), Validators.max(255)]),
            RiskSegmentCode: new FormControl('', [Validators.maxLength(20)]),
            AssignedAnalystUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            SubmittedOn: new FormControl(new Date(), []),
            DecisionOn: new FormControl(new Date(), []),
            RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            EffectiveFrom: new FormControl(new Date(), [Validators.required]),
            EffectiveTo: new FormControl(new Date(), [])
        });
        this.Caption = 'Create CreditApplication';
        this.loggedInUserService.getLookupOptions('opportunities').subscribe((options) => (this.opportunityidOptions = options));
        this.loggedInUserService.getPartyOptions().subscribe((options) => (this.partyidOptions = options));
        this.loggedInUserService.getOrganisationOptions().subscribe((options) => (this.originatingorganisationidOptions = options));
        this.loggedInUserService.getLookupOptions('credit-application-statuses').subscribe((options) => (this.creditapplicationstatusidOptions = options));
        this.currencycodeOptions.push({ Text: 'INR', Value: 'INR' });
        this.currencycodeOptions.push({ Text: 'USD', Value: 'USD' });
        this.risksegmentcodeOptions.push({ Text: '', Value: '' });
        this.loggedInUserService.getApplicationUserOptions().subscribe((options) => (this.assignedanalystuseridOptions = options));
        this.recordstatusOptions.push({ Text: 'Draft', Value: 'Draft' });
        this.recordstatusOptions.push({ Text: 'Active', Value: 'Active' });
        this.recordstatusOptions.push({ Text: 'Inactive', Value: 'Inactive' });
        this.recordstatusOptions.push({ Text: 'Archived', Value: 'Archived' });
    }

    loadUI(): void {
        this.isLoading = true;
        this.creditApplicationService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.creditApplication = data;
                this.objMaster = { ...this.creditApplication };
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

    populateUI(obj: ICreditApplication): void {
        this.editForm.patchValue({
            Id: obj.Id || 0,
            OpportunityId: obj.OpportunityId || 0,
            PartyId: obj.PartyId || 0,
            OriginatingOrganisationId: obj.OriginatingOrganisationId || 0,
            CreditApplicationStatusId: obj.CreditApplicationStatusId || 0,
            ApplicationDate: obj.ApplicationDate || new Date(),
            RequestedLimitAmount: obj.RequestedLimitAmount || 0,
            CurrencyCode: obj.CurrencyCode || '',
            RequestedTermMonths: obj.RequestedTermMonths || 0,
            RiskSegmentCode: obj.RiskSegmentCode || '',
            AssignedAnalystUserId: obj.AssignedAnalystUserId || 0,
            SubmittedOn: obj.SubmittedOn || new Date(),
            DecisionOn: obj.DecisionOn || new Date(),
            RecordStatus: obj.RecordStatus || '',
            EffectiveFrom: obj.EffectiveFrom || new Date(),
            EffectiveTo: obj.EffectiveTo || new Date()
        });
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/creditApplications/create']);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
        } else if (key == 'Refresh') {
            this.loadUI();
        }
    }

    onCancel(): void {
        this.creditApplication = { ...this.objMaster };
        var obj = this.creditApplication;
        this.editForm.patchValue({
            Id: obj.Id || 0,
            OpportunityId: obj.OpportunityId || 0,
            PartyId: obj.PartyId || 0,
            OriginatingOrganisationId: obj.OriginatingOrganisationId || 0,
            CreditApplicationStatusId: obj.CreditApplicationStatusId || 0,
            ApplicationDate: obj.ApplicationDate || new Date(),
            RequestedLimitAmount: obj.RequestedLimitAmount || 0,
            CurrencyCode: obj.CurrencyCode || '',
            RequestedTermMonths: obj.RequestedTermMonths || 0,
            RiskSegmentCode: obj.RiskSegmentCode || '',
            AssignedAnalystUserId: obj.AssignedAnalystUserId || 0,
            SubmittedOn: obj.SubmittedOn || new Date(),
            DecisionOn: obj.DecisionOn || new Date(),
            RecordStatus: obj.RecordStatus || '',
            EffectiveFrom: obj.EffectiveFrom || new Date(),
            EffectiveTo: obj.EffectiveTo || new Date()
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
            OpportunityId: formValues.OpportunityId || 0,
            PartyId: formValues.PartyId || 0,
            OriginatingOrganisationId: formValues.OriginatingOrganisationId || 0,
            CreditApplicationStatusId: formValues.CreditApplicationStatusId || 0,
            ApplicationDate: formValues.ApplicationDate || null,
            RequestedLimitAmount: formValues.RequestedLimitAmount || 0,
            CurrencyCode: formValues.CurrencyCode || null,
            RequestedTermMonths: formValues.RequestedTermMonths || null,
            RiskSegmentCode: formValues.RiskSegmentCode || null,
            AssignedAnalystUserId: formValues.AssignedAnalystUserId || 0,
            SubmittedOn: formValues.SubmittedOn || null,
            DecisionOn: formValues.DecisionOn || null,
            RecordStatus: formValues.RecordStatus || null,
            EffectiveFrom: formValues.EffectiveFrom || null,
            EffectiveTo: formValues.EffectiveTo || null
        } as ICreditApplication;

        this.spinner.show();
        this.creditApplicationService.create(createdObj).subscribe({
            next: (data) => {
                // this.messageService.showSuccess(CreditApplication +  'Details Updated sucessfully.');
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
