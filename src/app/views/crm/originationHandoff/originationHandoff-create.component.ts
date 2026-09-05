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
import { IOriginationHandoff } from './originationHandoff';
import { OriginationHandoffService } from './originationHandoff.service';

@Component({
    selector: 'app-originationHandoff-create',
    standalone: false,
    templateUrl: './originationHandoff-create.component.html',
    providers: [MessageService]
})
export class OriginationHandoffCreateComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    originationHandoff: IOriginationHandoff = null;
    opportunityidOptions: ISelectItem[] = [];
    quoteidOptions: ISelectItem[] = [];
    creditdecisionidOptions: ISelectItem[] = [];
    partyidOptions: ISelectItem[] = [];
    handoffstatusidOptions: ISelectItem[] = [];
    targetmodulecodeOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: IOriginationHandoff = {} as IOriginationHandoff;

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private originationHandoffService: OriginationHandoffService,
        private loggedInUserService: LoggedInUserService
    ) {}

    ngOnInit(): void {
        this.objMaster = { ...this.originationHandoff };

        this.editForm = this.fb.group({
            Id: new FormControl(0, []),
            OpportunityId: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            QuoteId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            CreditDecisionId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            HandoffStatusId: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            HandoffDateTime: new FormControl(new Date(), [Validators.required]),
            TargetModuleCode: new FormControl('', [Validators.maxLength(20)]),
            TargetReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)])
        });
        this.Caption = 'Create OriginationHandoff';
        this.loggedInUserService.getLookupOptions('opportunities').subscribe((options) => (this.opportunityidOptions = options));
        this.loggedInUserService.getLookupOptions('quotes').subscribe((options) => (this.quoteidOptions = options));
        this.loggedInUserService.getLookupOptions('credit-decisions').subscribe((options) => (this.creditdecisionidOptions = options));
        this.loggedInUserService.getPartyOptions().subscribe((options) => (this.partyidOptions = options));
        this.handoffstatusidOptions.push({ Text: 'Ready', Value: 'Ready' });
        this.handoffstatusidOptions.push({ Text: 'Sent', Value: 'Sent' });
        this.handoffstatusidOptions.push({ Text: 'Accepted', Value: 'Accepted' });
        this.handoffstatusidOptions.push({ Text: 'Failed', Value: 'Failed' });
        this.targetmodulecodeOptions = this.loggedInUserService.getPicklistOptions('OriginationHandoffTargetModuleCode');
    }

    loadUI(): void {
        this.isLoading = true;
        this.originationHandoffService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.originationHandoff = data;
                this.objMaster = { ...this.originationHandoff };
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
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/originationHandoffs/create']);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
        } else if (key == 'Refresh') {
            this.loadUI();
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
        var createdObj = {
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
        this.originationHandoffService.create(createdObj).subscribe({
            next: (data) => {
                // this.messageService.showSuccess(OriginationHandoff +  'Details Updated sucessfully.');
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
