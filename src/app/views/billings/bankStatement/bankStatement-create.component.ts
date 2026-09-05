import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IBankStatement } from './bankStatement';
import { BankStatementService } from './bankStatement.service';

@Component({
  selector: 'app-bankStatement-create',
  standalone: false,
  templateUrl: './bankStatement-create.component.html' ,
   providers: [ MessageService]
})
export class BankStatementCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  bankStatement: IBankStatement = null;
  organisationbankaccountidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
importsourceOptions: ISelectItem[] = [];
reconciliationstatusOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IBankStatement = {} as IBankStatement;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private bankStatementService: BankStatementService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.bankStatement };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
OrganisationBankAccountId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
StatementNo: new FormControl('', [Validators.maxLength(60), ]), 
StatementDate: new FormControl(new Date(), [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
OpeningBalance: new FormControl(0, []),
ClosingBalance: new FormControl(0, []),
ImportSource: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
ImportBatchRef: new FormControl('', [Validators.maxLength(100), ]), 
ReconciliationStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create BankStatement';
    this.organisationbankaccountidOptions.push({Text: 'OrganisationBankAccountId1', Value: 'OrganisationBankAccountId1' });
this.organisationbankaccountidOptions.push({Text: 'OrganisationBankAccountId2', Value: 'OrganisationBankAccountId2' });
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.importsourceOptions = this.loggedInUserService.getPicklistOptions('ImportSource');
this.reconciliationstatusOptions = this.loggedInUserService.getPicklistOptions('ReconciliationStatus');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.bankStatementService.getById(this.selectedId).subscribe({
      next: data => {
        this.bankStatement = data;
        this.objMaster = { ...this.bankStatement };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IBankStatement): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  OrganisationBankAccountId: obj.OrganisationBankAccountId || 0,
StatementNo: obj.StatementNo || '',
StatementDate:  obj.StatementDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
OpeningBalance: obj.OpeningBalance || 0,
ClosingBalance: obj.ClosingBalance || 0,
ImportSource: obj.ImportSource || '',
ImportBatchRef: obj.ImportBatchRef || '',
ReconciliationStatus: obj.ReconciliationStatus || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/bankStatements/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }
    else if (key == "Refresh") {
      this.loadUI();
    }
  }

  onCancel(): void {
    this.bankStatement = { ...this.objMaster };
    var obj  = this.bankStatement;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  OrganisationBankAccountId: obj.OrganisationBankAccountId || 0,
StatementNo: obj.StatementNo || '',
StatementDate:  obj.StatementDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
OpeningBalance: obj.OpeningBalance || 0,
ClosingBalance: obj.ClosingBalance || 0,
ImportSource: obj.ImportSource || '',
ImportBatchRef: obj.ImportBatchRef || '',
ReconciliationStatus: obj.ReconciliationStatus || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
    this.editForm.reset(); 
  } 

  Save(): void {    
   
        if (!this.editForm.valid) {
            this.messageService.showError('One or more validation failed. Please clear error to continue...');
            return;
        }	
  
  
	const formValues  = this.editForm.value ;
	var createdObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     OrganisationBankAccountId: formValues.OrganisationBankAccountId || 0,
StatementNo: formValues.StatementNo || null,
StatementDate: formValues.StatementDate || null,
CurrencyCode: formValues.CurrencyCode || null,
OpeningBalance: formValues.OpeningBalance || 0,
ClosingBalance: formValues.ClosingBalance || 0,
ImportSource: formValues.ImportSource || null,
ImportBatchRef: formValues.ImportBatchRef || null,
ReconciliationStatus: formValues.ReconciliationStatus || null,
RecordStatus: formValues.RecordStatus || null,

    } as IBankStatement ; 
	
	  this.spinner.show(); 
    this.bankStatementService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(BankStatement +  'Details Updated sucessfully.');
		 this._location.back();     
      },
      error: err => { 
	   this.messageService.showError(err);
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide(); }
    });
  } 

}



