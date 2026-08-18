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
import { IApprovalRequest } from './approvalRequest';
import { ApprovalRequestService } from './approvalRequest.service';

@Component({
    selector: 'app-approvalRequest-create',
    standalone: false,
    templateUrl: './approvalRequest-create.component.html',
    providers: [MessageService]
})
export class ApprovalRequestCreateComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    approvalRequest: IApprovalRequest = null;
    featurecodeOptions: ISelectItem[] = [];
    requestedbyOptions: ISelectItem[] = [];
    currencyidOptions: ISelectItem[] = [];
    approvalstatusOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: IApprovalRequest = {} as IApprovalRequest;

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private approvalRequestService: ApprovalRequestService,
        private loggedInUserService: LoggedInUserService
    ) {}

    ngOnInit(): void {
        this.objMaster = { ...this.approvalRequest };

        this.editForm = this.fb.group({
            Id: new FormControl(0, []),
            FeatureCode: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            ReferenceType: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            ReferenceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            WorkflowDefinitionId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            RequestedBy: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            RequestedOn: new FormControl(new Date(), [Validators.required]),
            RequestedAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            CurrencyId: new FormControl('', [Validators.maxLength(20)]),
            ApprovalStatus: new FormControl('', [Validators.required, Validators.maxLength(20)])
        });
        this.Caption = 'Create ApprovalRequest';
        this.featurecodeOptions.push({ Text: 'QUOTE', Value: 'QUOTE' });
        this.featurecodeOptions.push({ Text: 'LEAD', Value: 'LEAD' });
        this.featurecodeOptions.push({ Text: 'CREDIT', Value: 'CREDIT' });
        this.loggedInUserService.getApplicationUserOptions().subscribe((options) => (this.requestedbyOptions = options));
        this.currencyidOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
        this.approvalstatusOptions.push({ Text: 'Pending', Value: 'Pending' });
        this.approvalstatusOptions.push({ Text: 'Approved', Value: 'Approved' });
        this.approvalstatusOptions.push({ Text: 'Rejected', Value: 'Rejected' });
        this.approvalstatusOptions.push({ Text: 'Preturned', Value: 'Preturned' });
    }

    loadUI(): void {
        this.isLoading = true;
        this.approvalRequestService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.approvalRequest = data;
                this.objMaster = { ...this.approvalRequest };
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

    populateUI(obj: IApprovalRequest): void {
        this.editForm.patchValue({
            Id: obj.Id || 0,
            FeatureCode: obj.FeatureCode || '',
            ReferenceType: obj.ReferenceType || '',
            ReferenceId: obj.ReferenceId || 0,
            WorkflowDefinitionId: obj.WorkflowDefinitionId || 0,
            RequestedBy: obj.RequestedBy || 0,
            RequestedOn: obj.RequestedOn || new Date(),
            RequestedAmount: obj.RequestedAmount || 0,
            CurrencyId: obj.CurrencyId || '',
            ApprovalStatus: obj.ApprovalStatus || ''
        });
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/approvalRequests/create']);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
        } else if (key == 'Refresh') {
            this.loadUI();
        }
    }

    onCancel(): void {
        this.approvalRequest = { ...this.objMaster };
        var obj = this.approvalRequest;
        this.editForm.patchValue({
            Id: obj.Id || 0,
            FeatureCode: obj.FeatureCode || '',
            ReferenceType: obj.ReferenceType || '',
            ReferenceId: obj.ReferenceId || 0,
            WorkflowDefinitionId: obj.WorkflowDefinitionId || 0,
            RequestedBy: obj.RequestedBy || 0,
            RequestedOn: obj.RequestedOn || new Date(),
            RequestedAmount: obj.RequestedAmount || 0,
            CurrencyId: obj.CurrencyId || '',
            ApprovalStatus: obj.ApprovalStatus || ''
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
            FeatureCode: formValues.FeatureCode || null,
            ReferenceType: formValues.ReferenceType || null,
            ReferenceId: formValues.ReferenceId || 0,
            WorkflowDefinitionId: formValues.WorkflowDefinitionId || 0,
            RequestedBy: formValues.RequestedBy || 0,
            RequestedOn: formValues.RequestedOn || null,
            RequestedAmount: formValues.RequestedAmount || 0,
            CurrencyId: formValues.CurrencyId || null,
            ApprovalStatus: formValues.ApprovalStatus || null
        } as IApprovalRequest;

        this.spinner.show();
        this.approvalRequestService.create(createdObj).subscribe({
            next: (data) => {
                // this.messageService.showSuccess(ApprovalRequest +  'Details Updated sucessfully.');
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
