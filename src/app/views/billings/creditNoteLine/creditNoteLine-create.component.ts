import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { ICreditNoteLine } from './creditNoteLine';
import { CreditNoteLineService } from './creditNoteLine.service';

@Component({
  selector: 'app-creditNoteLine-create',
  standalone: false,
  templateUrl: './creditNoteLine-create.component.html' ,
   providers: [ MessageService]
})
export class CreditNoteLineCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  creditNoteLine: ICreditNoteLine = null;
  creditnoteidOptions: ISelectItem[] = [];
customerinvoicelineidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ICreditNoteLine = {} as ICreditNoteLine;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private creditNoteLineService: CreditNoteLineService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.creditNoteLine };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
CreditNoteId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerInvoiceLineId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Description: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
Quantity: new FormControl(0, [Validators.required]),
NetAmount: new FormControl(0, [Validators.required]),
TaxAmount: new FormControl(0, [Validators.required]),
GrossAmount: new FormControl(0, [Validators.required]),

    });
    this.Caption = 'Create CreditNoteLine';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'CreditNoteId', 'credit-notes',
      options => this.creditnoteidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'CustomerInvoiceLineId', 'customer-invoice-lines',
      options => this.customerinvoicelineidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.creditNoteLineService.getById(this.selectedId).subscribe({
      next: data => {
        this.creditNoteLine = data;
        this.objMaster = { ...this.creditNoteLine };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ICreditNoteLine): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CreditNoteId: obj.CreditNoteId || 0,
CustomerInvoiceLineId: obj.CustomerInvoiceLineId || 0,
Description: obj.Description || '',
Quantity: obj.Quantity || 0,
NetAmount: obj.NetAmount || 0,
TaxAmount: obj.TaxAmount || 0,
GrossAmount: obj.GrossAmount || 0,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/creditNoteLines/create']);
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
    this.creditNoteLine = { ...this.objMaster };
    var obj  = this.creditNoteLine;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CreditNoteId: obj.CreditNoteId || 0,
CustomerInvoiceLineId: obj.CustomerInvoiceLineId || 0,
Description: obj.Description || '',
Quantity: obj.Quantity || 0,
NetAmount: obj.NetAmount || 0,
TaxAmount: obj.TaxAmount || 0,
GrossAmount: obj.GrossAmount || 0,
 
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     CreditNoteId: formValues.CreditNoteId || 0,
CustomerInvoiceLineId: formValues.CustomerInvoiceLineId || 0,
Description: formValues.Description || null,
Quantity: formValues.Quantity || 0,
NetAmount: formValues.NetAmount || 0,
TaxAmount: formValues.TaxAmount || 0,
GrossAmount: formValues.GrossAmount || 0,
RecordStatus: 'Active',

    } as ICreditNoteLine ; 
	
	  this.spinner.show(); 
    this.creditNoteLineService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(CreditNoteLine +  'Details Updated sucessfully.');
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



