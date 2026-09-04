import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
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
  selector: 'app-bankStatement-edit',
  standalone: false,
  templateUrl: './bankStatement-edit.component.html',
  providers: [ MessageService]
})
export class BankStatementEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  bankStatement: IBankStatement = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  organisationbankaccountidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
importsourceOptions: ISelectItem[] = [];
reconciliationstatusOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IBankStatement = {} as IBankStatement;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private bankStatementService: BankStatementService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.bankStatement };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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

   this.organisationbankaccountidOptions.push({Text: 'OrganisationBankAccountId1', Value: 'OrganisationBankAccountId1' });
this.organisationbankaccountidOptions.push({Text: 'OrganisationBankAccountId2', Value: 'OrganisationBankAccountId2' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.importsourceOptions.push({Text: 'API', Value: 'API' });
this.importsourceOptions.push({Text: 'FILE', Value: 'FILE' });
this.importsourceOptions.push({Text: 'MANUAL', Value: 'MANUAL' });
this.reconciliationstatusOptions.push({Text: 'NEW', Value: 'NEW' });
this.reconciliationstatusOptions.push({Text: 'PART_MATCHED', Value: 'PART_MATCHED' });
this.reconciliationstatusOptions.push({Text: 'RECONCILED', Value: 'RECONCILED' });
this.reconciliationstatusOptions.push({Text: 'EXCEPTION', Value: 'EXCEPTION' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.bankStatementService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.bankStatement = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.bankStatement };
        this.populateUI(this.bankStatement);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "BankStatement Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/billing-finance/bank/statements/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     OrganisationBankAccountId:  formValues.OrganisationBankAccountId || null,
StatementNo:  formValues.StatementNo || null,
StatementDate:  formValues.StatementDate || null,
CurrencyCode:  formValues.CurrencyCode || null,
OpeningBalance:  formValues.OpeningBalance || null,
ClosingBalance:  formValues.ClosingBalance || null,
ImportSource:  formValues.ImportSource || null,
ImportBatchRef:  formValues.ImportBatchRef || null,
ReconciliationStatus:  formValues.ReconciliationStatus || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IBankStatement ;
	
	this.spinner.show();  	   
    this.bankStatementService.update(this.bankStatement.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(BankStatement +  'Details Updated sucessfully.');
		//this.editForm.reset();
		this._location.back();
      },
      error: err => { 
       this.messageService.showError(err);
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide();}
    });
  }
}
