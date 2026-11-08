import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { BillingRunService } from './billingRun.service';

@Component({
    selector: 'app-billingRun-create',
    standalone: false,
    templateUrl: './billingRun-create.component.html',
    styleUrls: ['./billingRun-create.component.css'],
    providers: [MessageService]
})
export class BillingRunCreateComponent implements OnInit {
    private readonly entityLookupDestroyRef = inject(DestroyRef);
    Caption = 'Create Billing Run';
    isLoading = false;
    permission = {} as IPermission;
    billingorganisationidOptions: ISelectItem[] = [];
    runtypeOptions: ISelectItem[] = [];
    editForm: any;

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    constructor(
        private readonly fb: FormBuilder,
        private readonly router: Router,
        private readonly location: Location,
        private readonly billingRunService: BillingRunService,
        private readonly loggedInUserService: LoggedInUserService
    ) {}

    ngOnInit(): void {
        const today = new Date();
        this.editForm = this.fb.group({
            BillingOrganisationId: new FormControl(0, [Validators.required, Validators.min(1)]),
            BillingDate: new FormControl(today, [Validators.required]),
            PeriodFrom: new FormControl(today, [Validators.required]),
            PeriodTo: new FormControl(today, [Validators.required]),
            RunType: new FormControl('ADHOC', [Validators.required, Validators.maxLength(20)])
        });
        this.loggedInUserService.bindEntityLookup(
            this.editForm, 'BillingOrganisationId', 'organisations',
            options => (this.billingorganisationidOptions = options),
            error => setTimeout(() => this.messageService?.showError(error)),
            this.entityLookupDestroyRef
        );
        this.runtypeOptions = this.loggedInUserService.getPicklistOptions('RunType');
    }

    onOptionItemClicked(key: string): void {
        if (key === 'Save') this.save();
        else if (key === 'Cancel') this.location.back();
        else if (key === 'Create') this.router.navigate(['/billing-finance/billing/runs/create']);
    }

    save(): void {
        if (this.editForm.invalid) {
            this.editForm.markAllAsTouched();
            this.messageService?.showError('Complete the billing run details before continuing.');
            return;
        }
        const value = this.editForm.getRawValue();
        this.isLoading = true;
        this.spinner.show();
        this.billingRunService.create({
            BillingOrganisationId: value.BillingOrganisationId,
            BillingDate: value.BillingDate,
            PeriodFrom: value.PeriodFrom,
            PeriodTo: value.PeriodTo,
            RunType: value.RunType || 'ADHOC'
        }).subscribe({
            next: response => {
                const id = Number(response?.Id || response?.id || response?.data?.Id || response?.data?.id);
                if (id > 0) this.router.navigate(['/billing-finance/billing/runs/view', id]);
                else this.location.back();
            },
            error: error => this.messageService?.showError(this.getErrorMessage(error)),
            complete: () => {
                this.isLoading = false;
                this.spinner.hide();
            }
        });
    }

    private getErrorMessage(error: any): string {
        const payload = error?.error || error;
        const errors = payload?.Errors || payload?.errors;
        return Array.isArray(errors) && errors.length ? errors.join(' ') : payload?.Message || payload?.message || 'The billing run could not be created.';
    }
}
