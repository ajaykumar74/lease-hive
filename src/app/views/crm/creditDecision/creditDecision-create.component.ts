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
import { ICreditDecision } from './creditDecision';
import { CreditDecisionService } from './creditDecision.service';

@Component({
    selector: 'app-creditDecision-create',
    standalone: false,
    templateUrl: './creditDecision-create.component.html',
    providers: [MessageService]
})
export class CreditDecisionCreateComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    creditDecision: ICreditDecision = null;
    creditapplicationidOptions: ISelectItem[] = [];
    creditassessmentidOptions: ISelectItem[] = [];
    decisioncodeOptions: ISelectItem[] = [];
    currencycodeOptions: ISelectItem[] = [];
    riskratingcodeOptions: ISelectItem[] = [];
    decisionreasoncodeOptions: ISelectItem[] = [];
    approvalrequestidOptions: ISelectItem[] = [];
    decidedbyOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: ICreditDecision = {} as ICreditDecision;

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private creditDecisionService: CreditDecisionService,
        private loggedInUserService: LoggedInUserService
    ) {}

    ngOnInit(): void {
        this.objMaster = { ...this.creditDecision };

        this.editForm = this.fb.group({
            Id: new FormControl(0, []),
            CreditApplicationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            CreditAssessmentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            DecisionCode: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            DecisionDateTime: new FormControl(new Date(), [Validators.required]),
            ApprovedLimitAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            CurrencyCode: new FormControl('', [Validators.maxLength(20)]),
            ApprovedTermMonths: new FormControl(0, [Validators.min(0), Validators.max(255)]),
            RiskRatingCode: new FormControl('', [Validators.maxLength(20)]),
            DecisionReasonCode: new FormControl('', [Validators.maxLength(20)]),
            DecisionSummary: new FormControl('', [Validators.maxLength(100)]),
            ValidUntil: new FormControl(new Date(), []),
            ApprovalRequestId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            DecidedBy: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)])
        });
        this.Caption = 'Create CreditDecision';
        this.loggedInUserService.getLookupOptions('credit-applications').subscribe((options) => (this.creditapplicationidOptions = options));
        this.loggedInUserService.getLookupOptions('credit-assessments').subscribe((options) => (this.creditassessmentidOptions = options));
        this.decisioncodeOptions = this.loggedInUserService.getPicklistOptions('CreditDecisionDecisionCode');
        this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
        this.riskratingcodeOptions = this.loggedInUserService.getPicklistOptions('RiskRatingCode');
        this.decisionreasoncodeOptions = this.loggedInUserService.getPicklistOptions('DecisionReasonCode');
        this.loggedInUserService.getLookupOptions('approval-requests').subscribe((options) => (this.approvalrequestidOptions = options));
        this.loggedInUserService.getApplicationUserOptions().subscribe((options) => (this.decidedbyOptions = options));
    }

    loadUI(): void {
        this.isLoading = true;
        this.creditDecisionService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.creditDecision = data;
                this.objMaster = { ...this.creditDecision };
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

    populateUI(obj: ICreditDecision): void {
        this.editForm.patchValue({
            Id: obj.Id || 0,
            CreditApplicationId: obj.CreditApplicationId || 0,
            CreditAssessmentId: obj.CreditAssessmentId || 0,
            DecisionCode: obj.DecisionCode || '',
            DecisionDateTime: obj.DecisionDateTime || new Date(),
            ApprovedLimitAmount: obj.ApprovedLimitAmount || 0,
            CurrencyCode: obj.CurrencyCode || '',
            ApprovedTermMonths: obj.ApprovedTermMonths || 0,
            RiskRatingCode: obj.RiskRatingCode || '',
            DecisionReasonCode: obj.DecisionReasonCode || '',
            DecisionSummary: obj.DecisionSummary || '',
            ValidUntil: obj.ValidUntil || new Date(),
            ApprovalRequestId: obj.ApprovalRequestId || 0,
            DecidedBy: obj.DecidedBy || 0
        });
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/business/origination/credit/decision/create']);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
        } else if (key == 'Refresh') {
            this.loadUI();
        }
    }

    onCancel(): void {
        this.creditDecision = { ...this.objMaster };
        var obj = this.creditDecision;
        this.editForm.patchValue({
            Id: obj.Id || 0,
            CreditApplicationId: obj.CreditApplicationId || 0,
            CreditAssessmentId: obj.CreditAssessmentId || 0,
            DecisionCode: obj.DecisionCode || '',
            DecisionDateTime: obj.DecisionDateTime || new Date(),
            ApprovedLimitAmount: obj.ApprovedLimitAmount || 0,
            CurrencyCode: obj.CurrencyCode || '',
            ApprovedTermMonths: obj.ApprovedTermMonths || 0,
            RiskRatingCode: obj.RiskRatingCode || '',
            DecisionReasonCode: obj.DecisionReasonCode || '',
            DecisionSummary: obj.DecisionSummary || '',
            ValidUntil: obj.ValidUntil || new Date(),
            ApprovalRequestId: obj.ApprovalRequestId || 0,
            DecidedBy: obj.DecidedBy || 0
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
            CreditApplicationId: formValues.CreditApplicationId || 0,
            CreditAssessmentId: formValues.CreditAssessmentId || 0,
            DecisionCode: formValues.DecisionCode || null,
            DecisionDateTime: formValues.DecisionDateTime || null,
            ApprovedLimitAmount: formValues.ApprovedLimitAmount || 0,
            CurrencyCode: formValues.CurrencyCode || null,
            ApprovedTermMonths: formValues.ApprovedTermMonths || null,
            RiskRatingCode: formValues.RiskRatingCode || null,
            DecisionReasonCode: formValues.DecisionReasonCode || null,
            DecisionSummary: formValues.DecisionSummary || null,
            ValidUntil: formValues.ValidUntil || null,
            ApprovalRequestId: formValues.ApprovalRequestId || 0,
            DecidedBy: formValues.DecidedBy || 0
        } as ICreditDecision;

        this.spinner.show();
        this.creditDecisionService.create(createdObj).subscribe({
            next: (data) => {
                // this.messageService.showSuccess(CreditDecision +  'Details Updated sucessfully.');
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
