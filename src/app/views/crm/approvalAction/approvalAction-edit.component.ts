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
import { IApprovalAction } from './approvalAction';
import { ApprovalActionService } from './approvalAction.service';

@Component({
    selector: 'app-approvalAction-edit',
    standalone: false,
    templateUrl: './approvalAction-edit.component.html',
    providers: [MessageService]
})
export class ApprovalActionEditComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    approvalAction: IApprovalAction = null;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    approvalrequestidOptions: ISelectItem[] = [];
    approveruseridOptions: ISelectItem[] = [];
    actioncodeOptions: ISelectItem[] = [];
    delegatedfromuseridOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: IApprovalAction = {} as IApprovalAction;

    constructor(
        private activatedRouter: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private approvalActionService: ApprovalActionService,
        private loggedInUserService: LoggedInUserService
    ) {}

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    ngOnInit(): void {
        this.objMaster = { ...this.approvalAction };

        this.editForm = this.fb.group({
            Id: new FormControl(0, [Validators.required]),
            ApprovalRequestId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            StepNo: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
            ApproverUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            ActionCode: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            ActionDateTime: new FormControl(new Date(), [Validators.required]),
            Comments: new FormControl('', [Validators.maxLength(100)]),
            DelegatedFromUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)])
        });

        this.actioncodeOptions = [
            { Text: 'APPROVE', Value: 'APPROVE' },
            { Text: 'REJECT', Value: 'REJECT' },
            { Text: 'RETURN', Value: 'RETURN' },
            { Text: 'DELEGATE', Value: 'DELEGATE' }
        ];

        this.selectedId = this.activatedRouter.snapshot.params['id'];
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.loadUI();
        }, 500);
    }

    loadUI(): void {
        this.isLoading = true;
        this.approvalActionService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.approvalAction = data.data;
                this.permission = data.permission;
                this.objMaster = { ...this.approvalAction };
                this.populateUI(this.approvalAction);
            },
            error: (err) => {
                this.messageService.showSuccess(err);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    populateUI(obj: IApprovalAction): void {
        this.loadLookups(obj);
        this.editForm.patchValue({
            Id: obj.Id || 0,
            ApprovalRequestId: obj.ApprovalRequestId || 0,
            StepNo: obj.StepNo || 0,
            ApproverUserId: obj.ApproverUserId || 0,
            ActionCode: obj.ActionCode || '',
            ActionDateTime: obj.ActionDateTime || new Date(),
            Comments: obj.Comments || '',
            DelegatedFromUserId: obj.DelegatedFromUserId || 0
        });

        this.Caption = 'ApprovalAction Details #' + obj.Id;
    }

    private loadLookups(selected: IApprovalAction): void {
        this.loggedInUserService.getLookupOptions('approval-requests', selected.ApprovalRequestId).subscribe((options) => (this.approvalrequestidOptions = options));
        this.loggedInUserService.getApplicationUserOptions(selected.ApproverUserId).subscribe((options) => (this.approveruseridOptions = options));
        this.loggedInUserService.getApplicationUserOptions(selected.DelegatedFromUserId).subscribe((options) => (this.delegatedfromuseridOptions = options));
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/approvalAction/create', { id: -1 }]);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
        }
    }

    onCancel(): void {
        this.approvalAction = { ...this.objMaster };
        var obj = this.approvalAction;
        this.editForm.patchValue({
            Id: obj.Id || 0,
            ApprovalRequestId: obj.ApprovalRequestId || 0,
            StepNo: obj.StepNo || 0,
            ApproverUserId: obj.ApproverUserId || 0,
            ActionCode: obj.ActionCode || '',
            ActionDateTime: obj.ActionDateTime || new Date(),
            Comments: obj.Comments || '',
            DelegatedFromUserId: obj.DelegatedFromUserId || 0
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
            ApprovalRequestId: formValues.ApprovalRequestId || null,
            StepNo: formValues.StepNo || null,
            ApproverUserId: formValues.ApproverUserId || null,
            ActionCode: formValues.ActionCode || null,
            ActionDateTime: formValues.ActionDateTime || null,
            Comments: formValues.Comments || null,
            DelegatedFromUserId: formValues.DelegatedFromUserId || null
        } as IApprovalAction;

        this.spinner.show();
        this.approvalActionService.update(this.approvalAction.Id, updatedObj).subscribe({
            next: (data) => {
                //this.messageService.showSuccess(ApprovalAction +  'Details Updated sucessfully.');
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
