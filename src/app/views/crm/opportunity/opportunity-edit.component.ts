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
import { IOpportunity } from './opportunity';
import { OpportunityService } from './opportunity.service';

@Component({
    selector: 'app-opportunity-edit',
    standalone: false,
    templateUrl: './opportunity-edit.component.html',
    providers: [MessageService]
})
export class OpportunityEditComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    opportunity: IOpportunity = null;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    leadidOptions: ISelectItem[] = [];
    partyidOptions: ISelectItem[] = [];
    originatingorganisationidOptions: ISelectItem[] = [];
    ownerorganisationunitidOptions: ISelectItem[] = [];
    owneruseridOptions: ISelectItem[] = [];
    opportunitystageidOptions: ISelectItem[] = [];
    currencycodeOptions: ISelectItem[] = [];
    recordstatusOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: IOpportunity = {} as IOpportunity;

    constructor(
        private activatedRouter: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private opportunityService: OpportunityService,
        private loggedInUserService: LoggedInUserService
    ) {}

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    ngOnInit(): void {
        this.objMaster = { ...this.opportunity };

        this.editForm = this.fb.group({
            Id: new FormControl(0, [Validators.required]),
            LeadId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            OriginatingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            OwnerOrganisationUnitId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            OwnerUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            OpportunityStageId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            OpportunityName: new FormControl('', [Validators.required, Validators.maxLength(256)]),
            CurrencyCode: new FormControl('', [Validators.maxLength(20)]),
            ProbabilityPct: new FormControl(0, [Validators.min(0), Validators.max(255)]),
            ExpectedCloseDate: new FormControl(new Date(), []),
            LostReasonCode: new FormControl('', [Validators.maxLength(100)]),
            ClosedOn: new FormControl(new Date(), []),
            RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            EffectiveFrom: new FormControl(new Date(), [Validators.required]),
            EffectiveTo: new FormControl(new Date(), []),
            Description: new FormControl('', [Validators.maxLength(100)])
        });
        this.loggedInUserService.getLookupOptions('leads').subscribe((options) => (this.leadidOptions = options));
        this.loggedInUserService.getPartyOptions().subscribe((options) => (this.partyidOptions = options));
        this.loggedInUserService.getOrganisationOptions().subscribe((options) => (this.originatingorganisationidOptions = options));
        this.loggedInUserService.getLookupOptions('organisation-units').subscribe((options) => (this.ownerorganisationunitidOptions = options));
        this.loggedInUserService.getApplicationUserOptions().subscribe((options) => (this.owneruseridOptions = options));
        this.loggedInUserService.getLookupOptions('opportunity-stages').subscribe((options) => (this.opportunitystageidOptions = options));
        this.currencycodeOptions.push({ Text: 'INR', Value: 'INR' });
        this.currencycodeOptions.push({ Text: 'USD', Value: 'USD' });
        this.recordstatusOptions.push({ Text: 'Active', Value: 'Active' });
        this.recordstatusOptions.push({ Text: 'Disabled', Value: 'Disabled' });

        this.selectedId = this.activatedRouter.snapshot.params['id'];
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.loadUI();
        }, 500);
    }

    loadUI(): void {
        this.isLoading = true;
        this.opportunityService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.opportunity = data.data;
                this.permission = data.permission;
                this.objMaster = { ...this.opportunity };
                this.populateUI(this.opportunity);
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
        this.loggedInUserService.getLookupOptions('opportunity-stages', obj.OpportunityStageId).subscribe((options) => (this.opportunitystageidOptions = options));
        this.loggedInUserService.getLookupOptions('leads', obj.LeadId).subscribe((options) => (this.leadidOptions = options));
        this.editForm.patchValue({
            Id: obj.Id || 0,
            LeadId: obj.LeadId || 0,
            PartyId: obj.PartyId || 0,
            OriginatingOrganisationId: obj.OriginatingOrganisationId || 0,
            OwnerOrganisationUnitId: obj.OwnerOrganisationUnitId || 0,
            OwnerUserId: obj.OwnerUserId || 0,
            OpportunityStageId: obj.OpportunityStageId || 0,
            OpportunityName: obj.OpportunityName || '',
            CurrencyCode: obj.CurrencyCode || '',
            ProbabilityPct: obj.ProbabilityPct || 0,
            ExpectedCloseDate: obj.ExpectedCloseDate || new Date(),
            LostReasonCode: obj.LostReasonCode || '',
            ClosedOn: obj.ClosedOn || new Date(),
            RecordStatus: obj.RecordStatus || '',
            EffectiveFrom: obj.EffectiveFrom || new Date(),
            EffectiveTo: obj.EffectiveTo || new Date(),
            Description: obj.Description || ''
        });

        this.Caption = 'Opportunity Details #' + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/business/crm/opportunities/create', { id: -1 }]);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
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
            CurrencyCode: obj.CurrencyCode || '',
            ProbabilityPct: obj.ProbabilityPct || 0,
            ExpectedCloseDate: obj.ExpectedCloseDate || new Date(),
            LostReasonCode: obj.LostReasonCode || '',
            ClosedOn: obj.ClosedOn || new Date(),
            RecordStatus: obj.RecordStatus || '',
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
        var updatedObj = {
            Id: this.objMaster.Id,
            RowVersionStr: this.objMaster.RowVersionStr,
            LeadId: formValues.LeadId || null,
            PartyId: formValues.PartyId || null,
            OriginatingOrganisationId: formValues.OriginatingOrganisationId || null,
            OwnerOrganisationUnitId: formValues.OwnerOrganisationUnitId || null,
            OwnerUserId: formValues.OwnerUserId || null,
            OpportunityStageId: formValues.OpportunityStageId || null,
            OpportunityName: formValues.OpportunityName || null,
            EstimatedAmount: formValues.EstimatedAmount || null,
            CurrencyCode: formValues.CurrencyCode || null,
            ProbabilityPct: formValues.ProbabilityPct || null,
            ExpectedCloseDate: formValues.ExpectedCloseDate || null,
            LostReasonCode: formValues.LostReasonCode || null,
            ClosedOn: formValues.ClosedOn || null,
            RecordStatus: formValues.RecordStatus || null,
            EffectiveFrom: formValues.EffectiveFrom || null,
            EffectiveTo: formValues.EffectiveTo || null,
            Description: formValues.Description || null
        } as IOpportunity;

        this.spinner.show();
        this.opportunityService.update(this.opportunity.Id, updatedObj).subscribe({
            next: (data) => {
                //this.messageService.showSuccess(Opportunity +  'Details Updated sucessfully.');
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
