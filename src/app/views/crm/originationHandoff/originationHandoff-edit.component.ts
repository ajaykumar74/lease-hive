import { Component, DestroyRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IOriginationHandoff } from './originationHandoff';
import { OriginationHandoffService } from './originationHandoff.service';

@Component({
    selector: 'app-originationHandoff-edit',
    standalone: false,
    templateUrl: './originationHandoff-edit.component.html',
    providers: [MessageService]
})
export class OriginationHandoffEditComponent implements OnInit {
    private readonly entityLookupDestroyRef = inject(DestroyRef);
    selectedId: number;
    isLoading: boolean = false;
    originationHandoff: IOriginationHandoff = null;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    opportunityidOptions: ISelectItem[] = [];
    quoteidOptions: ISelectItem[] = [];
    creditdecisionidOptions: ISelectItem[] = [];
    partyidOptions: ISelectItem[] = [];
    handoffstatusidOptions: ISelectItem[] = [];
    targetmodulecodeOptions: ISelectItem[] = [];
    targetreferenceidOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: IOriginationHandoff = {} as IOriginationHandoff;

    constructor(
        private activatedRouter: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private originationHandoffService: OriginationHandoffService,
        private loggedInUserService: LoggedInUserService
    ) {}

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    ngOnInit(): void {
        this.objMaster = { ...this.originationHandoff };

        this.editForm = this.fb.group({
            Id: new FormControl(0, [Validators.required]),
            OpportunityId: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            QuoteId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
            CreditDecisionId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
            PartyId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
            HandoffStatusId: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            HandoffDateTime: new FormControl(new Date(), [Validators.required]),
            TargetModuleCode: new FormControl('', [Validators.maxLength(20)]),
            TargetReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)])
        });
        this.loggedInUserService.bindEntityLookup(this.editForm, 'OpportunityId', 'opportunities', options => this.opportunityidOptions = options, error => this.messageService?.showError(error), this.entityLookupDestroyRef);
        this.loggedInUserService.bindEntityLookup(this.editForm, 'QuoteId', 'quotes', options => this.quoteidOptions = options, error => this.messageService?.showError(error), this.entityLookupDestroyRef, { OpportunityId: 'OpportunityId' });
        this.loggedInUserService.bindEntityLookup(this.editForm, 'CreditDecisionId', 'credit-decisions', options => this.creditdecisionidOptions = options, error => this.messageService?.showError(error), this.entityLookupDestroyRef, { OpportunityId: 'OpportunityId' });
        this.loggedInUserService.bindEntityLookup(this.editForm, 'PartyId', 'parties', options => this.partyidOptions = options, error => this.messageService?.showError(error), this.entityLookupDestroyRef, { OpportunityId: 'OpportunityId' });
        this.handoffstatusidOptions = this.loggedInUserService.getPicklistOptions('HandoffStatusCode');
        this.targetmodulecodeOptions = this.loggedInUserService.getPicklistOptions('OriginationHandoffTargetModuleCode');
        this.loggedInUserService.bindReferenceTypeLookup(this.editForm, 'TargetModuleCode', 'TargetReferenceId', options => this.targetreferenceidOptions = options, error => this.messageService?.showError(error), this.entityLookupDestroyRef, { CONTACT: 'party-contacts' });

        this.selectedId = this.activatedRouter.snapshot.params['id'];
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.loadUI();
        }, 500);
    }

    loadUI(): void {
        this.isLoading = true;
        this.originationHandoffService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.originationHandoff = data.data;
                this.permission = data.permission;
                this.objMaster = { ...this.originationHandoff };
                this.populateUI(this.originationHandoff);
            },
            error: (err) => {
                this.messageService.showSuccess(err);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    populateUI(obj: IOriginationHandoff): void {
        this.editForm.patchValue({
            Id: obj.Id || 0,
            OpportunityId: obj.OpportunityId || '',
            QuoteId: obj.QuoteId || 0,
            CreditDecisionId: obj.CreditDecisionId || 0,
            PartyId: obj.PartyId || 0,
            HandoffStatusId: obj.HandoffStatusId || '',
            HandoffDateTime: obj.HandoffDateTime || new Date(),
            TargetModuleCode: obj.TargetModuleCode || '',
            TargetReferenceId: obj.TargetReferenceId || 0
        });

        this.Caption = 'OriginationHandoff Details #' + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/business/origination/handoffs/create', { id: -1 }]);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
        }
    }

    onCancel(): void {
        this.originationHandoff = { ...this.objMaster };
        var obj = this.originationHandoff;
        this.editForm.patchValue({
            Id: obj.Id || 0,
            OpportunityId: obj.OpportunityId || '',
            QuoteId: obj.QuoteId || 0,
            CreditDecisionId: obj.CreditDecisionId || 0,
            PartyId: obj.PartyId || 0,
            HandoffStatusId: obj.HandoffStatusId || '',
            HandoffDateTime: obj.HandoffDateTime || new Date(),
            TargetModuleCode: obj.TargetModuleCode || '',
            TargetReferenceId: obj.TargetReferenceId || 0
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
            QuoteId: formValues.QuoteId || 0,
            CreditDecisionId: formValues.CreditDecisionId || 0,
            PartyId: formValues.PartyId || 0,
            HandoffStatusId: formValues.HandoffStatusId || null,
            HandoffDateTime: formValues.HandoffDateTime || null,
            TargetModuleCode: formValues.TargetModuleCode || null,
            TargetReferenceId: formValues.TargetReferenceId || 0
        } as IOriginationHandoff;

        this.spinner.show();
        this.originationHandoffService.update(this.originationHandoff.Id, updatedObj).subscribe({
            next: (data) => {
                //this.messageService.showSuccess(OriginationHandoff +  'Details Updated sucessfully.');
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
