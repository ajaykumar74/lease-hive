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
import { ICreditAssessment } from './creditAssessment';
import { CreditAssessmentService } from './creditAssessment.service';

@Component({
    selector: 'app-creditAssessment-create',
    standalone: false,
    templateUrl: './creditAssessment-create.component.html',
    providers: [MessageService]
})
export class CreditAssessmentCreateComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    creditAssessment: ICreditAssessment = null;
    creditapplicationidOptions: ISelectItem[] = [];
    assessmentversionOptions: ISelectItem[] = [];
    assessmenttypecodeOptions: ISelectItem[] = [];
    assessedbyuseridOptions: ISelectItem[] = [];
    currencycodeOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: ICreditAssessment = {} as ICreditAssessment;

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private creditAssessmentService: CreditAssessmentService,
        private loggedInUserService: LoggedInUserService
    ) {}

    ngOnInit(): void {
        this.objMaster = { ...this.creditAssessment };

        this.editForm = this.fb.group({
            Id: new FormControl(0, []),
            CreditApplicationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            AssessmentVersion: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            AssessmentTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            AssessedByUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            AssessmentDateTime: new FormControl(new Date(), [Validators.required]),
            RiskRatingCode: new FormControl('', [Validators.required, Validators.maxLength(10)]),
            Score: new FormControl(0, [Validators.min(0), Validators.max(255)]),
            ProbabilityOfDefaultPct: new FormControl(0, [Validators.min(0), Validators.max(255)]),
            RecommendedLimitAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20)])
        });
        this.Caption = 'Create CreditAssessment';
        this.loggedInUserService.getLookupOptions('credit-applications').subscribe((options) => (this.creditapplicationidOptions = options));
        this.assessmentversionOptions.push({ Text: 'Party1', Value: 'Party1' });
        this.assessmentversionOptions.push({ Text: 'Party2', Value: 'Party2' });
        this.assessmenttypecodeOptions = this.loggedInUserService.getPicklistOptions('AssessmentTypeCode');
        this.loggedInUserService.getApplicationUserOptions().subscribe((options) => (this.assessedbyuseridOptions = options));
        this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
    }

    loadUI(): void {
        this.isLoading = true;
        this.creditAssessmentService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.creditAssessment = data;
                this.objMaster = { ...this.creditAssessment };
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

    populateUI(obj: ICreditAssessment): void {
        this.editForm.patchValue({
            Id: obj.Id || 0,
            CreditApplicationId: obj.CreditApplicationId || 0,
            AssessmentVersion: obj.AssessmentVersion || '',
            AssessmentTypeCode: obj.AssessmentTypeCode || '',
            AssessedByUserId: obj.AssessedByUserId || 0,
            AssessmentDateTime: obj.AssessmentDateTime || new Date(),
            RiskRatingCode: obj.RiskRatingCode || '',
            Score: obj.Score || 0,
            ProbabilityOfDefaultPct: obj.ProbabilityOfDefaultPct || 0,
            RecommendedLimitAmount: obj.RecommendedLimitAmount || 0,
            CurrencyCode: obj.CurrencyCode || ''
        });
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/creditAssessments/create']);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
        } else if (key == 'Refresh') {
            this.loadUI();
        }
    }

    onCancel(): void {
        this.creditAssessment = { ...this.objMaster };
        var obj = this.creditAssessment;
        this.editForm.patchValue({
            Id: obj.Id || 0,
            CreditApplicationId: obj.CreditApplicationId || 0,
            AssessmentVersion: obj.AssessmentVersion || '',
            AssessmentTypeCode: obj.AssessmentTypeCode || '',
            AssessedByUserId: obj.AssessedByUserId || 0,
            AssessmentDateTime: obj.AssessmentDateTime || new Date(),
            RiskRatingCode: obj.RiskRatingCode || '',
            Score: obj.Score || 0,
            ProbabilityOfDefaultPct: obj.ProbabilityOfDefaultPct || 0,
            RecommendedLimitAmount: obj.RecommendedLimitAmount || 0,
            CurrencyCode: obj.CurrencyCode || ''
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
            AssessmentVersion: formValues.AssessmentVersion || null,
            AssessmentTypeCode: formValues.AssessmentTypeCode || null,
            AssessedByUserId: formValues.AssessedByUserId || 0,
            AssessmentDateTime: formValues.AssessmentDateTime || null,
            RiskRatingCode: formValues.RiskRatingCode || null,
            Score: formValues.Score || 0,
            ProbabilityOfDefaultPct: formValues.ProbabilityOfDefaultPct || 0,
            RecommendedLimitAmount: formValues.RecommendedLimitAmount || 0,
            CurrencyCode: formValues.CurrencyCode || null
        } as ICreditAssessment;

        this.spinner.show();
        this.creditAssessmentService.create(createdObj).subscribe({
            next: (data) => {
                // this.messageService.showSuccess(CreditAssessment +  'Details Updated sucessfully.');
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
