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
import { IOpportunity } from './opportunity';
import { OpportunityService } from './opportunity.service';

@Component({
    selector: 'app-opportunity-create',
    standalone: false,
    templateUrl: './opportunity-create.component.html',
    providers: [MessageService]
})
export class OpportunityCreateComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    opportunity: IOpportunity = null;
    leadidOptions: ISelectItem[] = [];
    partyidOptions: ISelectItem[] = [];
    originatingorganisationidOptions: ISelectItem[] = [];
    ownerorganisationunitidOptions: ISelectItem[] = [];
    owneruseridOptions: ISelectItem[] = [];
    opportunitystageidOptions: ISelectItem[] = [];
    currencycodeOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: IOpportunity = {} as IOpportunity;

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private opportunityService: OpportunityService,
        private loggedInUserService: LoggedInUserService
    ) {}

    ngOnInit(): void {
        this.objMaster = { ...this.opportunity };

        this.editForm = this.fb.group({
            Id: new FormControl(0, []),
            LeadId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            OriginatingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            OwnerOrganisationUnitId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            OwnerUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            OpportunityStageId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            OpportunityName: new FormControl('', [Validators.required, Validators.maxLength(256)]),
            EstimatedAmount: new FormControl(0, [Validators.min(0)]),
            CurrencyCode: new FormControl('', [Validators.maxLength(20)]),
            ProbabilityPct: new FormControl(0, [Validators.min(0), Validators.max(255)]),
            ExpectedCloseDate: new FormControl(new Date(), []),
            LostReasonCode: new FormControl('', [Validators.maxLength(100)]),
            ClosedOn: new FormControl(new Date(), []),
            EffectiveFrom: new FormControl(new Date(), [Validators.required]),
            EffectiveTo: new FormControl(new Date(), []),
            Description: new FormControl('', [Validators.maxLength(100)])
        });
        this.Caption = 'Create Opportunity';
        this.loggedInUserService.getLookupOptions('leads').subscribe((options) => (this.leadidOptions = options));
        this.loggedInUserService.getPartyOptions().subscribe((options) => (this.partyidOptions = options));
        this.loggedInUserService.getOrganisationOptions().subscribe((options) => (this.originatingorganisationidOptions = options));
        this.loggedInUserService.getLookupOptions('organisation-units').subscribe((options) => (this.ownerorganisationunitidOptions = options));
        this.loggedInUserService.getApplicationUserOptions().subscribe((options) => (this.owneruseridOptions = options));
        this.loggedInUserService.getLookupOptions('opportunity-stages').subscribe((options) => (this.opportunitystageidOptions = options));
        this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
    }

    loadUI(): void {
        this.isLoading = true;
        this.opportunityService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.opportunity = data;
                this.objMaster = { ...this.opportunity };
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

    populateUI(obj: IOpportunity): void {
        this.editForm.patchValue({
            Id: obj.Id || 0,
            LeadId: obj.LeadId || 0,
            PartyId: obj.PartyId || 0,
            OriginatingOrganisationId: obj.OriginatingOrganisationId || 0,
            OwnerOrganisationUnitId: obj.OwnerOrganisationUnitId || 0,
            OwnerUserId: obj.OwnerUserId || 0,
            OpportunityStageId: obj.OpportunityStageId || 0,
            OpportunityName: obj.OpportunityName || '',
            EstimatedAmount: obj.EstimatedAmount ?? 0,
            CurrencyCode: obj.CurrencyCode || '',
            ProbabilityPct: obj.ProbabilityPct || 0,
            ExpectedCloseDate: obj.ExpectedCloseDate || new Date(),
            LostReasonCode: obj.LostReasonCode || '',
            ClosedOn: obj.ClosedOn || new Date(),
            EffectiveFrom: obj.EffectiveFrom || new Date(),
            EffectiveTo: obj.EffectiveTo || new Date(),
            Description: obj.Description || ''
        });
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/business/crm/opportunities/create']);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
        } else if (key == 'Refresh') {
            this.loadUI();
        }
    }

    onCancel(): void {
        this.opportunity = { ...this.objMaster };
        var obj = this.opportunity;
        this.editForm.patchValue({
            Id: obj.Id || 0,
            LeadId: obj.LeadId || 0,
            PartyId: obj.PartyId || 0,
            OriginatingOrganisationId: obj.OriginatingOrganisationId || 0,
            OwnerOrganisationUnitId: obj.OwnerOrganisationUnitId || 0,
            OwnerUserId: obj.OwnerUserId || 0,
            OpportunityStageId: obj.OpportunityStageId || 0,
            OpportunityName: obj.OpportunityName || '',
            EstimatedAmount: obj.EstimatedAmount ?? 0,
            CurrencyCode: obj.CurrencyCode || '',
            ProbabilityPct: obj.ProbabilityPct || 0,
            ExpectedCloseDate: obj.ExpectedCloseDate || new Date(),
            LostReasonCode: obj.LostReasonCode || '',
            ClosedOn: obj.ClosedOn || new Date(),
            EffectiveFrom: obj.EffectiveFrom || new Date(),
            EffectiveTo: obj.EffectiveTo || new Date(),
            Description: obj.Description || ''
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
            LeadId: formValues.LeadId || 0,
            PartyId: formValues.PartyId || 0,
            OriginatingOrganisationId: formValues.OriginatingOrganisationId || 0,
            OwnerOrganisationUnitId: formValues.OwnerOrganisationUnitId || 0,
            OwnerUserId: formValues.OwnerUserId || 0,
            OpportunityStageId: formValues.OpportunityStageId || 0,
            OpportunityName: formValues.OpportunityName || null,
            EstimatedAmount: Number(formValues.EstimatedAmount) || 0,
            CurrencyCode: formValues.CurrencyCode || null,
            ProbabilityPct: formValues.ProbabilityPct || 0,
            ExpectedCloseDate: formValues.ExpectedCloseDate || null,
            LostReasonCode: formValues.LostReasonCode || null,
            ClosedOn: formValues.ClosedOn || null,
            RecordStatus: 'Active',
            EffectiveFrom: formValues.EffectiveFrom || null,
            EffectiveTo: formValues.EffectiveTo || null,
            Description: formValues.Description || null
        } as IOpportunity;

        this.spinner.show();
        this.opportunityService.create(createdObj).subscribe({
            next: (data) => {
                // this.messageService.showSuccess(Opportunity +  'Details Updated sucessfully.');
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
