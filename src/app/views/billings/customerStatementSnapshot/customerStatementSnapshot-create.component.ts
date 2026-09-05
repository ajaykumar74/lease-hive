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
import { ICustomerStatementSnapshot } from './customerStatementSnapshot';
import { CustomerStatementSnapshotService } from './customerStatementSnapshot.service';

@Component({
  selector: 'app-customerStatementSnapshot-create',
  standalone: false,
  templateUrl: './customerStatementSnapshot-create.component.html' ,
   providers: [ MessageService]
})
export class CustomerStatementSnapshotCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  customerStatementSnapshot: ICustomerStatementSnapshot = null;
  billingorganisationidOptions: ISelectItem[] = [];
customerpartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
documentidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ICustomerStatementSnapshot = {} as ICustomerStatementSnapshot;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private customerStatementSnapshotService: CustomerStatementSnapshotService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.customerStatementSnapshot };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
BillingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
StatementDate: new FormControl(new Date(), [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
OpeningBalance: new FormControl(0, [Validators.required]),
DebitAmount: new FormControl(0, [Validators.required]),
CreditAmount: new FormControl(0, [Validators.required]),
ClosingBalance: new FormControl(0, [Validators.required]),
CurrentAmount: new FormControl(0, [Validators.required]),
Days1To30: new FormControl(0, [Validators.required]),
Days31To60: new FormControl(0, [Validators.required]),
Days61To90: new FormControl(0, [Validators.required]),
Days90Plus: new FormControl(0, [Validators.required]),
DocumentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create CustomerStatementSnapshot';
    this.billingorganisationidOptions.push({Text: 'BillingOrganisationId1', Value: 'BillingOrganisationId1' });
this.billingorganisationidOptions.push({Text: 'BillingOrganisationId2', Value: 'BillingOrganisationId2' });
this.customerpartyidOptions.push({Text: 'CustomerPartyId1', Value: 'CustomerPartyId1' });
this.customerpartyidOptions.push({Text: 'CustomerPartyId2', Value: 'CustomerPartyId2' });
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.documentidOptions.push({Text: 'DocumentId1', Value: 'DocumentId1' });
this.documentidOptions.push({Text: 'DocumentId2', Value: 'DocumentId2' });
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.customerStatementSnapshotService.getById(this.selectedId).subscribe({
      next: data => {
        this.customerStatementSnapshot = data;
        this.objMaster = { ...this.customerStatementSnapshot };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ICustomerStatementSnapshot): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  BillingOrganisationId: obj.BillingOrganisationId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
StatementDate:  obj.StatementDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
OpeningBalance: obj.OpeningBalance || 0,
DebitAmount: obj.DebitAmount || 0,
CreditAmount: obj.CreditAmount || 0,
ClosingBalance: obj.ClosingBalance || 0,
CurrentAmount: obj.CurrentAmount || 0,
Days1To30: obj.Days1To30 || 0,
Days31To60: obj.Days31To60 || 0,
Days61To90: obj.Days61To90 || 0,
Days90Plus: obj.Days90Plus || 0,
DocumentId: obj.DocumentId || 0,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/customerStatementSnapshots/create']);
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
    this.customerStatementSnapshot = { ...this.objMaster };
    var obj  = this.customerStatementSnapshot;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  BillingOrganisationId: obj.BillingOrganisationId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
StatementDate:  obj.StatementDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
OpeningBalance: obj.OpeningBalance || 0,
DebitAmount: obj.DebitAmount || 0,
CreditAmount: obj.CreditAmount || 0,
ClosingBalance: obj.ClosingBalance || 0,
CurrentAmount: obj.CurrentAmount || 0,
Days1To30: obj.Days1To30 || 0,
Days31To60: obj.Days31To60 || 0,
Days61To90: obj.Days61To90 || 0,
Days90Plus: obj.Days90Plus || 0,
DocumentId: obj.DocumentId || 0,
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
     BillingOrganisationId: formValues.BillingOrganisationId || 0,
CustomerPartyId: formValues.CustomerPartyId || 0,
StatementDate: formValues.StatementDate || null,
CurrencyCode: formValues.CurrencyCode || null,
OpeningBalance: formValues.OpeningBalance || 0,
DebitAmount: formValues.DebitAmount || 0,
CreditAmount: formValues.CreditAmount || 0,
ClosingBalance: formValues.ClosingBalance || 0,
CurrentAmount: formValues.CurrentAmount || 0,
Days1To30: formValues.Days1To30 || 0,
Days31To60: formValues.Days31To60 || 0,
Days61To90: formValues.Days61To90 || 0,
Days90Plus: formValues.Days90Plus || 0,
DocumentId: formValues.DocumentId || 0,
RecordStatus: formValues.RecordStatus || null,

    } as ICustomerStatementSnapshot ; 
	
	  this.spinner.show(); 
    this.customerStatementSnapshotService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(CustomerStatementSnapshot +  'Details Updated sucessfully.');
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



