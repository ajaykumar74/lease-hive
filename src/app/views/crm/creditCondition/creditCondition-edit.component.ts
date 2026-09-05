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
import { ICreditCondition } from './creditCondition';
import { CreditConditionService } from './creditCondition.service';

@Component({
    selector: 'app-creditCondition-edit',
    standalone: false,
    templateUrl: './creditCondition-edit.component.html',
    providers: [MessageService]
})
export class CreditConditionEditComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    creditCondition: ICreditCondition = null;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    creditdecisionidOptions: ISelectItem[] = [];
    conditiontypeOptions: ISelectItem[] = [];
    conditionstatusOptions: ISelectItem[] = [];
    verifiedbyOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: ICreditCondition = {} as ICreditCondition;

    constructor(
        private activatedRouter: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private creditConditionService: CreditConditionService,
        private loggedInUserService: LoggedInUserService
    ) {}

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    ngOnInit(): void {
        this.objMaster = { ...this.creditCondition };

        this.editForm = this.fb.group({
            Id: new FormControl(0, [Validators.required]),
            CreditDecisionId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            ConditionType: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            ConditionText: new FormControl('', [Validators.required, Validators.maxLength(100)]),
            IsPrecedent: new FormControl(false, [Validators.required]),
            DueDate: new FormControl(new Date(), []),
            ConditionStatus: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            SatisfiedOn: new FormControl(new Date(), []),
            EvidenceDocumentId: new FormControl('', [Validators.maxLength(20)]),
            VerifiedBy: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)])
        });
        this.loggedInUserService.getLookupOptions('credit-decisions').subscribe((options) => (this.creditdecisionidOptions = options));
        this.conditiontypeOptions = this.loggedInUserService.getPicklistOptions('ConditionType');
        this.conditionstatusOptions = this.loggedInUserService.getPicklistOptions('ConditionStatus');
        this.loggedInUserService.getApplicationUserOptions().subscribe((options) => (this.verifiedbyOptions = options));
        this.selectedId = this.activatedRouter.snapshot.params['id'];
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.loadUI();
        }, 500);
    }

    loadUI(): void {
        this.isLoading = true;
        this.creditConditionService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.creditCondition = data.data;
                this.permission = data.permission;
                this.objMaster = { ...this.creditCondition };
                this.populateUI(this.creditCondition);
            },
            error: (err) => {
                this.messageService.showSuccess(err);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    populateUI(obj: ICreditCondition): void {
        this.loggedInUserService.getLookupOptions('credit-decisions', obj.CreditDecisionId).subscribe((options) => (this.creditdecisionidOptions = options));
        this.editForm.patchValue({
            Id: obj.Id || 0,
            CreditDecisionId: obj.CreditDecisionId || 0,
            ConditionType: obj.ConditionType || '',
            ConditionText: obj.ConditionText || '',
            IsPrecedent: obj.IsPrecedent || false,
            DueDate: obj.DueDate || new Date(),
            ConditionStatus: obj.ConditionStatus || '',
            SatisfiedOn: obj.SatisfiedOn || new Date(),
            EvidenceDocumentId: obj.EvidenceDocumentId || '',
            VerifiedBy: obj.VerifiedBy || 0
        });

        this.Caption = 'CreditCondition Details #' + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/business/origination/credit/Conditions/create', { id: -1 }]);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
        }
    }

    onCancel(): void {
        this.creditCondition = { ...this.objMaster };
        var obj = this.creditCondition;
        this.editForm.patchValue({
            Id: obj.Id || 0,
            CreditDecisionId: obj.CreditDecisionId || 0,
            ConditionType: obj.ConditionType || '',
            ConditionText: obj.ConditionText || '',
            IsPrecedent: obj.IsPrecedent || false,
            DueDate: obj.DueDate || new Date(),
            ConditionStatus: obj.ConditionStatus || '',
            SatisfiedOn: obj.SatisfiedOn || new Date(),
            EvidenceDocumentId: obj.EvidenceDocumentId || '',
            VerifiedBy: obj.VerifiedBy || 0
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
            CreditDecisionId: formValues.CreditDecisionId || 0,
            ConditionType: formValues.ConditionType || null,
            ConditionText: formValues.ConditionText || null,
            IsPrecedent: formValues.IsPrecedent || false,
            DueDate: formValues.DueDate || null,
            ConditionStatus: formValues.ConditionStatus || null,
            SatisfiedOn: formValues.SatisfiedOn || null,
            EvidenceDocumentId: formValues.EvidenceDocumentId || null,
            VerifiedBy: formValues.VerifiedBy || 0
        } as ICreditCondition;

        this.spinner.show();
        this.creditConditionService.update(this.creditCondition.Id, updatedObj).subscribe({
            next: (data) => {
                //this.messageService.showSuccess(CreditCondition +  'Details Updated sucessfully.');
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
