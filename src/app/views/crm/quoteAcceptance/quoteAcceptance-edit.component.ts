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
import { IQuoteAcceptance } from './quoteAcceptance';
import { QuoteAcceptanceService } from './quoteAcceptance.service';

@Component({
    selector: 'app-quoteAcceptance-edit',
    standalone: false,
    templateUrl: './quoteAcceptance-edit.component.html',
    providers: [MessageService]
})
export class QuoteAcceptanceEditComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    quoteAcceptance: IQuoteAcceptance = null;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    quoteidOptions: ISelectItem[] = [];
    decisioncodeOptions: ISelectItem[] = [];
    acceptedbypartycontactidOptions: ISelectItem[] = [];
    acceptancemethodcodeOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: IQuoteAcceptance = {} as IQuoteAcceptance;

    constructor(
        private activatedRouter: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private quoteAcceptanceService: QuoteAcceptanceService,
        private loggedInUserService: LoggedInUserService
    ) {}

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    ngOnInit(): void {
        this.objMaster = { ...this.quoteAcceptance };

        this.editForm = this.fb.group({
            Id: new FormControl(0, [Validators.required]),
            QuoteId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            DecisionCode: new FormControl('', [Validators.maxLength(20)]),
            DecisionDateTime: new FormControl(new Date(), []),
            AcceptedByName: new FormControl('', [Validators.required, Validators.maxLength(30)]),
            AcceptedByPartyContactId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            AcceptanceMethodCode: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            DocumentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            Remarks: new FormControl('', [Validators.maxLength(100)])
        });
        this.loggedInUserService.getLookupOptions('quotes').subscribe((options) => (this.quoteidOptions = options));
        this.decisioncodeOptions = this.loggedInUserService.getPicklistOptions('QuoteAcceptanceDecisionCode');
        this.loggedInUserService.getLookupOptions('party-contacts').subscribe((options) => (this.acceptedbypartycontactidOptions = options));
        this.acceptancemethodcodeOptions = this.loggedInUserService.getPicklistOptions('AcceptanceMethodCode');

        this.selectedId = this.activatedRouter.snapshot.params['id'];
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.loadUI();
        }, 500);
    }

    loadUI(): void {
        this.isLoading = true;
        this.quoteAcceptanceService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.quoteAcceptance = data.data;
                this.permission = data.permission;
                this.objMaster = { ...this.quoteAcceptance };
                this.populateUI(this.quoteAcceptance);
            },
            error: (err) => {
                this.messageService.showSuccess(err);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    populateUI(obj: IQuoteAcceptance): void {
        this.loggedInUserService.getLookupOptions('quotes', obj.QuoteId).subscribe((options) => (this.quoteidOptions = options));
        this.editForm.patchValue({
            Id: obj.Id || 0,
            QuoteId: obj.QuoteId || 0,
            DecisionCode: obj.DecisionCode || '',
            DecisionDateTime: obj.DecisionDateTime || new Date(),
            AcceptedByName: obj.AcceptedByName || '',
            AcceptedByPartyContactId: obj.AcceptedByPartyContactId || 0,
            AcceptanceMethodCode: obj.AcceptanceMethodCode || '',
            DocumentId: obj.DocumentId || 0,
            Remarks: obj.Remarks || ''
        });

        this.Caption = 'QuoteAcceptance Details #' + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['origination/quotes/acceptances/create', { id: -1 }]);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
        }
    }

    onCancel(): void {
        this.quoteAcceptance = { ...this.objMaster };
        var obj = this.quoteAcceptance;
        this.editForm.patchValue({
            Id: obj.Id || 0,
            QuoteId: obj.QuoteId || 0,
            DecisionCode: obj.DecisionCode || '',
            DecisionDateTime: obj.DecisionDateTime || new Date(),
            AcceptedByName: obj.AcceptedByName || '',
            AcceptedByPartyContactId: obj.AcceptedByPartyContactId || 0,
            AcceptanceMethodCode: obj.AcceptanceMethodCode || '',
            DocumentId: obj.DocumentId || 0,
            Remarks: obj.Remarks || ''
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
            QuoteId: formValues.QuoteId || null,
            DecisionCode: formValues.DecisionCode || null,
            DecisionDateTime: formValues.DecisionDateTime || null,
            AcceptedByName: formValues.AcceptedByName || null,
            AcceptedByPartyContactId: formValues.AcceptedByPartyContactId || null,
            AcceptanceMethodCode: formValues.AcceptanceMethodCode || null,
            DocumentId: formValues.DocumentId || null,
            Remarks: formValues.Remarks || null
        } as IQuoteAcceptance;

        this.spinner.show();
        this.quoteAcceptanceService.update(this.quoteAcceptance.Id, updatedObj).subscribe({
            next: (data) => {
                //this.messageService.showSuccess(QuoteAcceptance +  'Details Updated sucessfully.');
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
