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
import { ICreditDocumentChecklist } from './creditDocumentChecklist';
import { CreditDocumentChecklistService } from './creditDocumentChecklist.service';

@Component({
    selector: 'app-creditDocumentChecklist-edit',
    standalone: false,
    templateUrl: './creditDocumentChecklist-edit.component.html',
    providers: [MessageService]
})
export class CreditDocumentChecklistEditComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    creditDocumentChecklist: ICreditDocumentChecklist = null;
    permission = {} as IPermission;
    Caption: string = 'Loading...';
    creditapplicationidOptions: ISelectItem[] = [];
    documenttypeOptions: ISelectItem[] = [];
    checkliststatusOptions: ISelectItem[] = [];
    verifiedbyOptions: ISelectItem[] = [];

    editForm: any;
    objMaster: ICreditDocumentChecklist = {} as ICreditDocumentChecklist;

    constructor(
        private activatedRouter: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private _location: Location,
        private creditDocumentChecklistService: CreditDocumentChecklistService,
        private loggedInUserService: LoggedInUserService
    ) {}

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    ngOnInit(): void {
        this.objMaster = { ...this.creditDocumentChecklist };

        this.editForm = this.fb.group({
            Id: new FormControl(0, [Validators.required]),
            CreditApplicationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
            DocumentType: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            IsRequired: new FormControl(false, [Validators.required]),
            DocumentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            ChecklistStatus: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            VerifiedBy: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
            VerifiedOn: new FormControl(new Date(), [])
        });
        this.loggedInUserService.getLookupOptions('credit-applications').subscribe((options) => (this.creditapplicationidOptions = options));
        this.documenttypeOptions.push({ Text: 'DocType1', Value: 'DocType1' });
        this.documenttypeOptions.push({ Text: 'DocType2', Value: 'DocType2' });
        this.checkliststatusOptions = this.loggedInUserService.getPicklistOptions('ChecklistStatus');
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
        this.creditDocumentChecklistService.getById(this.selectedId).subscribe({
            next: (data) => {
                this.creditDocumentChecklist = data.data;
                this.permission = data.permission;
                this.objMaster = { ...this.creditDocumentChecklist };
                this.populateUI(this.creditDocumentChecklist);
            },
            error: (err) => {
                this.messageService.showSuccess(err);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    populateUI(obj: ICreditDocumentChecklist): void {
        this.loggedInUserService.getLookupOptions('credit-applications', obj.CreditApplicationId).subscribe((options) => (this.creditapplicationidOptions = options));
        this.editForm.patchValue({
            Id: obj.Id || 0,
            CreditApplicationId: obj.CreditApplicationId || 0,
            DocumentType: obj.DocumentType || '',
            IsRequired: obj.IsRequired || false,
            DocumentId: obj.DocumentId || 0,
            ChecklistStatus: obj.ChecklistStatus || '',
            VerifiedBy: obj.VerifiedBy || 0,
            VerifiedOn: obj.VerifiedOn || new Date()
        });

        this.Caption = 'CreditDocumentChecklist Details #' + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['origination/credit/document/create', { id: -1 }]);
        } else if (key == 'Save') {
            this.Save();
        } else if (key == 'Cancel') {
            this.onCancel();
        }
    }

    onCancel(): void {
        this.creditDocumentChecklist = { ...this.objMaster };
        var obj = this.creditDocumentChecklist;
        this.editForm.patchValue({
            Id: obj.Id || 0,
            CreditApplicationId: obj.CreditApplicationId || 0,
            DocumentType: obj.DocumentType || '',
            IsRequired: obj.IsRequired || false,
            DocumentId: obj.DocumentId || 0,
            ChecklistStatus: obj.ChecklistStatus || '',
            VerifiedBy: obj.VerifiedBy || 0,
            VerifiedOn: obj.VerifiedOn || new Date()
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
            CreditApplicationId: formValues.CreditApplicationId || 0,
            DocumentType: formValues.DocumentType || null,
            IsRequired: formValues.IsRequired || false,
            DocumentId: formValues.DocumentId || 0,
            ChecklistStatus: formValues.ChecklistStatus || null,
            VerifiedBy: formValues.VerifiedBy || 0,
            VerifiedOn: formValues.VerifiedOn || null
        } as ICreditDocumentChecklist;

        this.spinner.show();
        this.creditDocumentChecklistService.update(this.creditDocumentChecklist.Id, updatedObj).subscribe({
            next: (data) => {
                //this.messageService.showSuccess(CreditDocumentChecklist +  'Details Updated sucessfully.');
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
