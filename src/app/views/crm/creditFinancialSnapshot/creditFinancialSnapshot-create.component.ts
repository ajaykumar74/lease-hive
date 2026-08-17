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
import { ICreditFinancialSnapshot } from './creditFinancialSnapshot';
import { CreditFinancialSnapshotService } from './creditFinancialSnapshot.service';

@Component({
  selector: 'app-creditFinancialSnapshot-create',
  standalone: false,
  templateUrl: './creditFinancialSnapshot-create.component.html' ,
   providers: [ MessageService]
})
export class CreditFinancialSnapshotCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  creditFinancialSnapshot: ICreditFinancialSnapshot = null;
  creditassessmentidOptions: ISelectItem[] = [];
currencyidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ICreditFinancialSnapshot = {} as ICreditFinancialSnapshot;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private creditFinancialSnapshotService: CreditFinancialSnapshotService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.creditFinancialSnapshot };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
CreditAssessmentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
FinancialPeriodEnd: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
CurrencyId: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RevenueAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
EBITDAAmount: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
NetProfitAmount: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
NetWorthAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
TotalDebtAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CurrentRatio: new FormControl('', [Validators.maxLength(10), ]), 
DebtEquityRatio: new FormControl('', [Validators.required, Validators.maxLength(10), ]),
DSCR: new FormControl('', [Validators.maxLength(10), ]), 
SourceDocumentId: new FormControl('', [Validators.maxLength(20), ]), 

    });
    this.Caption = 'Create CreditFinancialSnapshot';
    this.creditassessmentidOptions.push({Text: 'Application1', Value: 'Application1' });
this.creditassessmentidOptions.push({Text: 'Application2', Value: 'Application2' });
this.currencyidOptions.push({Text: 'INR', Value: 'INR' });
this.currencyidOptions.push({Text: 'USD', Value: 'USD' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.creditFinancialSnapshotService.getById(this.selectedId).subscribe({
      next: data => {
        this.creditFinancialSnapshot = data;
        this.objMaster = { ...this.creditFinancialSnapshot };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ICreditFinancialSnapshot): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CreditAssessmentId: obj.CreditAssessmentId || 0,
FinancialPeriodEnd: obj.FinancialPeriodEnd || 0,
CurrencyId: obj.CurrencyId || '',
RevenueAmount: obj.RevenueAmount || 0,
EBITDAAmount: obj.EBITDAAmount || 0,
NetProfitAmount: obj.NetProfitAmount || 0,
NetWorthAmount: obj.NetWorthAmount || 0,
TotalDebtAmount: obj.TotalDebtAmount || 0,
CurrentRatio: obj.CurrentRatio || '',
DebtEquityRatio: obj.DebtEquityRatio || '',
DSCR: obj.DSCR || '',
SourceDocumentId: obj.SourceDocumentId || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/creditFinancialSnapshots/create']);
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
    this.creditFinancialSnapshot = { ...this.objMaster };
    var obj  = this.creditFinancialSnapshot;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CreditAssessmentId: obj.CreditAssessmentId || 0,
FinancialPeriodEnd: obj.FinancialPeriodEnd || 0,
CurrencyId: obj.CurrencyId || '',
RevenueAmount: obj.RevenueAmount || 0,
EBITDAAmount: obj.EBITDAAmount || 0,
NetProfitAmount: obj.NetProfitAmount || 0,
NetWorthAmount: obj.NetWorthAmount || 0,
TotalDebtAmount: obj.TotalDebtAmount || 0,
CurrentRatio: obj.CurrentRatio || '',
DebtEquityRatio: obj.DebtEquityRatio || '',
DSCR: obj.DSCR || '',
SourceDocumentId: obj.SourceDocumentId || '',
 
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
     CreditAssessmentId: formValues.CreditAssessmentId || 0,
FinancialPeriodEnd: formValues.FinancialPeriodEnd || null,
CurrencyId: formValues.CurrencyId || null,
RevenueAmount: formValues.RevenueAmount || 0,
EBITDAAmount: formValues.EBITDAAmount || 0,
NetProfitAmount: formValues.NetProfitAmount || 0,
NetWorthAmount: formValues.NetWorthAmount || 0,
TotalDebtAmount: formValues.TotalDebtAmount || 0,
CurrentRatio: formValues.CurrentRatio || null,
DebtEquityRatio: formValues.DebtEquityRatio || null,
DSCR: formValues.DSCR || null,
SourceDocumentId: formValues.SourceDocumentId || null,

    } as ICreditFinancialSnapshot ; 
	
	  this.spinner.show(); 
    this.creditFinancialSnapshotService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(CreditFinancialSnapshot +  'Details Updated sucessfully.');
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



