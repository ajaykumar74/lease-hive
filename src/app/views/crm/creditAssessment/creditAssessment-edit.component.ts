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
import { ICreditAssessment } from './creditAssessment';
import { CreditAssessmentService } from './creditAssessment.service';

@Component({
    selector: 'app-creditAssessment-edit',
    standalone: false,
    templateUrl: './creditAssessment-edit.component.html',
    providers: [MessageService]
})
export class CreditAssessmentEditComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    creditAssessment: ICreditAssessment = null;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    creditapplicationidOptions: ISelectItem[] = [];
    assessmentversionOptions: ISelectItem[] = [];
    assessmenttypecodeOptions: ISelectItem[] = [];
    assessedbyuseridOptions: ISelectItem[] = [];
    currencycodeOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: ICreditAssessment = {} as ICreditAssessment;

    constructor(
        private activatedRouter: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private creditAssessmentService: CreditAssessmentService,
        private loggedInUserService: LoggedInUserService
    ) {}

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    ngOnInit(): void {
        this.objMaster = { ...this.creditAssessment };

        this.editForm = this.fb.group({
            Id: new FormControl(0, [Validators.required]),
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
        this.loggedInUserService.getLookupOptions('credit-applications').subscribe((options) => (this.creditapplicationidOptions = options));
        this.assessmentversionOptions.push({ Text: 'Party1', Value: 'Party1' });
        this.assessmentversionOptions.push({ Text: 'Party2', Value: 'Party2' });
        this.assessmenttypecodeOptions.push({ Text: 'MANUAL', Value: 'MANUAL' });
        this.assessmenttypecodeOptions.push({ Text: 'MODEL', Value: 'MODEL' });
        this.assessmenttypecodeOptions.push({ Text: 'HYBRID', Value: 'HYBRID' });
        this.loggedInUserService.getApplicationUserOptions().subscribe((options) => (this.assessedbyuseridOptions = options));
        this.currencycodeOptions.push({ Text: 'INR', Value: 'INR' });
        this.currencycodeOptions.push({ Text: 'USD', Value: 'USD' });

        this.selectedId = this.activatedRouter.snapshot.params['id'];
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.loadUI();
        }, 500);
    }

    loadUI(): void {
        this.isLoading = true;
        this.creditAssessmentService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.creditAssessment = data.data;
                this.permission = data.permission;
                this.objMaster = { ...this.creditAssessment };
                this.populateUI(this.creditAssessment);
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
        this.loggedInUserService.getLookupOptions('credit-applications', obj.CreditApplicationId).subscribe((options) => (this.creditapplicationidOptions = options));
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

        this.Caption = 'CreditAssessment Details #' + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['business/origination/credit/review/create', { id: -1 }]);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
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
        var updatedObj = {
            Id: this.objMaster.Id,
            RowVersionStr: this.objMaster.RowVersionStr,
            CreditApplicationId: formValues.CreditApplicationId || null,
            AssessmentVersion: formValues.AssessmentVersion || null,
            AssessmentTypeCode: formValues.AssessmentTypeCode || null,
            AssessedByUserId: formValues.AssessedByUserId || null,
            AssessmentDateTime: formValues.AssessmentDateTime || null,
            RiskRatingCode: formValues.RiskRatingCode || null,
            Score: formValues.Score || null,
            ProbabilityOfDefaultPct: formValues.ProbabilityOfDefaultPct || null,
            RecommendedLimitAmount: formValues.RecommendedLimitAmount || null,
            CurrencyCode: formValues.CurrencyCode || null
        } as ICreditAssessment;

        this.spinner.show();
        this.creditAssessmentService.update(this.creditAssessment.Id, updatedObj).subscribe({
            next: (data) => {
                //this.messageService.showSuccess(CreditAssessment +  'Details Updated sucessfully.');
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
