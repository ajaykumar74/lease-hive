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
import { ILeaseRequirement } from './leaseRequirement';
import { LeaseRequirementService } from './leaseRequirement.service';

@Component({
    selector: 'app-leaseRequirement-edit',
    standalone: false,
    templateUrl: './leaseRequirement-edit.component.html',
    providers: [MessageService]
})
export class LeaseRequirementEditComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    leaseRequirement: ILeaseRequirement = null;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    opportunityidOptions: ISelectItem[] = [];
    partyidOptions: ISelectItem[] = [];
    partylocationidOptions: ISelectItem[] = [];
    currencycodeOptions: ISelectItem[] = [];
    requirementstatuscodeOptions: ISelectItem[] = [];
    recordstatusOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: ILeaseRequirement = {} as ILeaseRequirement;

    constructor(
        private activatedRouter: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private leaseRequirementService: LeaseRequirementService,
        private loggedInUserService: LoggedInUserService
    ) {}

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    ngOnInit(): void {
        this.objMaster = { ...this.leaseRequirement };

        this.editForm = this.fb.group({
            Id: new FormControl(0, [Validators.required]),
            OpportunityId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            PartyLocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            RequirementDate: new FormControl(new Date(), [Validators.required]),
            PreferredStartDate: new FormControl(new Date(), []),
            RequestedTermMonths: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
            CurrencyCode: new FormControl('', [Validators.maxLength(20)]),
            RequirementStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            CustomerReference: new FormControl('', [Validators.maxLength(100)]),
            Remarks: new FormControl('', [Validators.maxLength(100)]),
            RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            EffectiveFrom: new FormControl(new Date(), [Validators.required]),
            EffectiveTo: new FormControl(new Date(), [])
        });
        this.loggedInUserService.getLookupOptions('opportunities').subscribe((options) => (this.opportunityidOptions = options));
        this.loggedInUserService.getPartyOptions().subscribe((options) => (this.partyidOptions = options));
        this.editForm.get('PartyId').valueChanges.subscribe((partyId: number) => {
            if (partyId !== this.objMaster?.PartyId) {
                this.editForm.get('PartyLocationId').setValue(null, { emitEvent: false });
                this.loadPartyLocations(partyId);
            }
        });
        this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
        this.requirementstatuscodeOptions = this.loggedInUserService.getPicklistOptions('RequirementStatusCode');
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
        this.leaseRequirementService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.leaseRequirement = data.data;
                this.permission = data.permission;
                this.objMaster = { ...this.leaseRequirement };
                this.populateUI(this.leaseRequirement);
            },
            error: (err) => {
                this.messageService.showSuccess(err);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    populateUI(obj: ILeaseRequirement): void {
        this.loggedInUserService.getLookupOptions('opportunities', obj.OpportunityId).subscribe((options) => (this.opportunityidOptions = options));
        this.loggedInUserService.getPartyOptions(obj.PartyId).subscribe((options) => (this.partyidOptions = options));
        this.loadPartyLocations(obj.PartyId, obj.PartyLocationId);
        this.editForm.patchValue({
            Id: obj.Id || 0,
            OpportunityId: obj.OpportunityId || 0,
            PartyId: obj.PartyId || 0,
            PartyLocationId: obj.PartyLocationId || 0,
            RequirementDate: obj.RequirementDate || new Date(),
            PreferredStartDate: obj.PreferredStartDate || new Date(),
            RequestedTermMonths: obj.RequestedTermMonths || 0,
            CurrencyCode: obj.CurrencyCode || '',
            RequirementStatusCode: obj.RequirementStatusCode || '',
            CustomerReference: obj.CustomerReference || '',
            Remarks: obj.Remarks || '',
            RecordStatus: obj.RecordStatus || '',
            EffectiveFrom: obj.EffectiveFrom || new Date(),
            EffectiveTo: obj.EffectiveTo || new Date()
        });

        this.Caption = 'LeaseRequirement Details #' + obj.Id;
    }

    private loadPartyLocations(partyId: number, selectedId?: number): void {
        if (!partyId) {
            this.partylocationidOptions = [];
            return;
        }
        this.loggedInUserService
            .getLookupOptions('party-locations', selectedId, { partyId })
            .subscribe((options) => (this.partylocationidOptions = options));
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/business/origination/requirements/create', { id: -1 }]);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
        }
    }

    onCancel(): void {
        this.leaseRequirement = { ...this.objMaster };
        var obj = this.leaseRequirement;
        this.editForm.patchValue({
            Id: obj.Id || 0,
            OpportunityId: obj.OpportunityId || 0,
            PartyId: obj.PartyId || 0,
            PartyLocationId: obj.PartyLocationId || 0,
            RequirementDate: obj.RequirementDate || new Date(),
            PreferredStartDate: obj.PreferredStartDate || new Date(),
            RequestedTermMonths: obj.RequestedTermMonths || 0,
            CurrencyCode: obj.CurrencyCode || '',
            RequirementStatusCode: obj.RequirementStatusCode || '',
            CustomerReference: obj.CustomerReference || '',
            Remarks: obj.Remarks || '',
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
        var updatedObj = {
            Id: this.objMaster.Id,
            RowVersionStr: this.objMaster.RowVersionStr,
            OpportunityId: formValues.OpportunityId || null,
            PartyId: formValues.PartyId || null,
            PartyLocationId: formValues.PartyLocationId || null,
            RequirementDate: formValues.RequirementDate || null,
            PreferredStartDate: formValues.PreferredStartDate || null,
            RequestedTermMonths: formValues.RequestedTermMonths || null,
            CurrencyCode: formValues.CurrencyCode || null,
            RequirementStatusCode: formValues.RequirementStatusCode || null,
            CustomerReference: formValues.CustomerReference || null,
            Remarks: formValues.Remarks || null,
            RecordStatus: formValues.RecordStatus || null,
            EffectiveFrom: formValues.EffectiveFrom || null,
            EffectiveTo: formValues.EffectiveTo || null
        } as ILeaseRequirement;

        this.spinner.show();
        this.leaseRequirementService.update(this.leaseRequirement.Id, updatedObj).subscribe({
            next: (data) => {
                //this.messageService.showSuccess(LeaseRequirement +  'Details Updated sucessfully.');
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
