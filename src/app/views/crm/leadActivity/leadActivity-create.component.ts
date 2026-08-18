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
import { ILeadActivity } from './leadActivity';
import { LeadActivityService } from './leadActivity.service';

@Component({
    selector: 'app-leadActivity-create',
    standalone: false,
    templateUrl: './leadActivity-create.component.html',
    providers: [MessageService]
})
export class LeadActivityCreateComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    leadActivity: ILeadActivity = null;
    leadidOptions: ISelectItem[] = [];
    opportunityidOptions: ISelectItem[] = [];
    activitytypeOptions: ISelectItem[] = [];
    outcomecodeOptions: ISelectItem[] = [];
    recordstatusOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: ILeadActivity = {} as ILeadActivity;

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private leadActivityService: LeadActivityService,
        private loggedInUserService: LoggedInUserService
    ) {}

    ngOnInit(): void {
        this.objMaster = { ...this.leadActivity };

        this.editForm = this.fb.group({
            Id: new FormControl(0, []),
            LeadId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            OpportunityId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            ActivityType: new FormControl('', [Validators.maxLength(20)]),
            Subject: new FormControl('', [Validators.maxLength(256)]),
            ActivityDateTime: new FormControl(new Date(), [Validators.required]),
            DueDateTime: new FormControl(new Date(), [Validators.required]),
            AssignedUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            OutcomeCode: new FormControl('', [Validators.maxLength(20)]),
            Notes: new FormControl('', [Validators.maxLength(100)]),
            CompletedOn: new FormControl(new Date(), []),
            RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            EffectiveFrom: new FormControl(new Date(), [Validators.required]),
            EffectiveTo: new FormControl(new Date(), []),
            Description: new FormControl('', [Validators.maxLength(100)])
        });
        this.Caption = 'Create LeadActivity';
        this.loggedInUserService.getLookupOptions('leads').subscribe((options) => (this.leadidOptions = options));
        this.loggedInUserService.getLookupOptions('opportunities').subscribe((options) => (this.opportunityidOptions = options));
        this.activitytypeOptions.push({ Text: 'Call', Value: 'Call' });
        this.activitytypeOptions.push({ Text: 'Email', Value: 'Email' });
        this.activitytypeOptions.push({ Text: 'Meeting', Value: 'Meeting' });
        this.activitytypeOptions.push({ Text: 'Note', Value: 'Note' });
        this.activitytypeOptions.push({ Text: 'Task', Value: 'Task' });
        this.outcomecodeOptions.push({ Text: 'Followup', Value: 'Followup' });
        this.outcomecodeOptions.push({ Text: 'Call', Value: 'Call' });
        this.recordstatusOptions.push({ Text: 'Active', Value: 'Active' });
        this.recordstatusOptions.push({ Text: 'Disabled', Value: 'Disabled' });
    }

    loadUI(): void {
        this.isLoading = true;
        this.leadActivityService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.leadActivity = data;
                this.objMaster = { ...this.leadActivity };
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

    populateUI(obj: ILeadActivity): void {
        this.editForm.patchValue({
            Id: obj.Id || 0,
            LeadId: obj.LeadId || 0,
            OpportunityId: obj.OpportunityId || 0,
            ActivityType: obj.ActivityType || '',
            Subject: obj.Subject || '',
            ActivityDateTime: obj.ActivityDateTime || new Date(),
            DueDateTime: obj.DueDateTime || new Date(),
            AssignedUserId: obj.AssignedUserId || 0,
            OutcomeCode: obj.OutcomeCode || '',
            Notes: obj.Notes || '',
            CompletedOn: obj.CompletedOn || new Date(),
            RecordStatus: obj.RecordStatus || '',
            EffectiveFrom: obj.EffectiveFrom || new Date(),
            EffectiveTo: obj.EffectiveTo || new Date(),
            Description: obj.Description || ''
        });
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/leadActivitys/create']);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
        } else if (key == 'Refresh') {
            this.loadUI();
        }
    }

    onCancel(): void {
        this.leadActivity = { ...this.objMaster };
        var obj = this.leadActivity;
        this.editForm.patchValue({
            Id: obj.Id || 0,
            LeadId: obj.LeadId || 0,
            OpportunityId: obj.OpportunityId || 0,
            ActivityType: obj.ActivityType || '',
            Subject: obj.Subject || '',
            ActivityDateTime: obj.ActivityDateTime || new Date(),
            DueDateTime: obj.DueDateTime || new Date(),
            AssignedUserId: obj.AssignedUserId || 0,
            OutcomeCode: obj.OutcomeCode || '',
            Notes: obj.Notes || '',
            CompletedOn: obj.CompletedOn || new Date(),
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
        var createdObj = {
            Id: this.objMaster.Id,
            RowVersionStr: this.objMaster.RowVersionStr,
            LeadId: formValues.LeadId || 0,
            OpportunityId: formValues.OpportunityId || 0,
            ActivityType: formValues.ActivityType || null,
            Subject: formValues.Subject || null,
            ActivityDateTime: formValues.ActivityDateTime || null,
            DueDateTime: formValues.DueDateTime || null,
            AssignedUserId: formValues.AssignedUserId || 0,
            OutcomeCode: formValues.OutcomeCode || null,
            Notes: formValues.Notes || null,
            CompletedOn: formValues.CompletedOn || null,
            RecordStatus: formValues.RecordStatus || null,
            EffectiveFrom: formValues.EffectiveFrom || null,
            EffectiveTo: formValues.EffectiveTo || null,
            Description: formValues.Description || null
        } as ILeadActivity;

        this.spinner.show();
        this.leadActivityService.create(createdObj).subscribe({
            next: (data) => {
                // this.messageService.showSuccess(LeadActivity +  'Details Updated sucessfully.');
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
