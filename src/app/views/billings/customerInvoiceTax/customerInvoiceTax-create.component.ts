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
import { ICustomerInvoiceTax } from './customerInvoiceTax';
import { CustomerInvoiceTaxService } from './customerInvoiceTax.service';

@Component({
  selector: 'app-customerInvoiceTax-create',
  standalone: false,
  templateUrl: './customerInvoiceTax-create.component.html' ,
   providers: [ MessageService]
})
export class CustomerInvoiceTaxCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  customerInvoiceTax: ICustomerInvoiceTax = null;
  customerinvoiceidOptions: ISelectItem[] = [];
customerinvoicelineidOptions: ISelectItem[] = [];
taxtypeidOptions: ISelectItem[] = [];
taxjurisdictionidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ICustomerInvoiceTax = {} as ICustomerInvoiceTax;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private customerInvoiceTaxService: CustomerInvoiceTaxService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.customerInvoiceTax };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
CustomerInvoiceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerInvoiceLineId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
TaxTypeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
TaxJurisdictionId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
TaxCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
TaxRate: new FormControl(0, [Validators.required]),
TaxableAmount: new FormControl(0, [Validators.required]),
TaxAmount: new FormControl(0, [Validators.required]),
TaxRegistrationSnapshot: new FormControl('', [Validators.maxLength(40), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create CustomerInvoiceTax';
    this.customerinvoiceidOptions.push({Text: 'CustomerInvoiceId1', Value: 'CustomerInvoiceId1' });
this.customerinvoiceidOptions.push({Text: 'CustomerInvoiceId2', Value: 'CustomerInvoiceId2' });
this.customerinvoicelineidOptions.push({Text: 'CustomerInvoiceLineId1', Value: 'CustomerInvoiceLineId1' });
this.customerinvoicelineidOptions.push({Text: 'CustomerInvoiceLineId2', Value: 'CustomerInvoiceLineId2' });
this.taxtypeidOptions.push({Text: 'TaxTypeId1', Value: 'TaxTypeId1' });
this.taxtypeidOptions.push({Text: 'TaxTypeId2', Value: 'TaxTypeId2' });
this.taxjurisdictionidOptions.push({Text: 'TaxJurisdictionId1', Value: 'TaxJurisdictionId1' });
this.taxjurisdictionidOptions.push({Text: 'TaxJurisdictionId2', Value: 'TaxJurisdictionId2' });
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.customerInvoiceTaxService.getById(this.selectedId).subscribe({
      next: data => {
        this.customerInvoiceTax = data;
        this.objMaster = { ...this.customerInvoiceTax };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ICustomerInvoiceTax): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CustomerInvoiceId: obj.CustomerInvoiceId || 0,
CustomerInvoiceLineId: obj.CustomerInvoiceLineId || 0,
TaxTypeId: obj.TaxTypeId || 0,
TaxJurisdictionId: obj.TaxJurisdictionId || 0,
TaxCode: obj.TaxCode || '',
TaxRate: obj.TaxRate || 0,
TaxableAmount: obj.TaxableAmount || 0,
TaxAmount: obj.TaxAmount || 0,
TaxRegistrationSnapshot: obj.TaxRegistrationSnapshot || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/customerInvoiceTaxs/create']);
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
    this.customerInvoiceTax = { ...this.objMaster };
    var obj  = this.customerInvoiceTax;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CustomerInvoiceId: obj.CustomerInvoiceId || 0,
CustomerInvoiceLineId: obj.CustomerInvoiceLineId || 0,
TaxTypeId: obj.TaxTypeId || 0,
TaxJurisdictionId: obj.TaxJurisdictionId || 0,
TaxCode: obj.TaxCode || '',
TaxRate: obj.TaxRate || 0,
TaxableAmount: obj.TaxableAmount || 0,
TaxAmount: obj.TaxAmount || 0,
TaxRegistrationSnapshot: obj.TaxRegistrationSnapshot || '',
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
     CustomerInvoiceId: formValues.CustomerInvoiceId || 0,
CustomerInvoiceLineId: formValues.CustomerInvoiceLineId || 0,
TaxTypeId: formValues.TaxTypeId || 0,
TaxJurisdictionId: formValues.TaxJurisdictionId || 0,
TaxCode: formValues.TaxCode || null,
TaxRate: formValues.TaxRate || 0,
TaxableAmount: formValues.TaxableAmount || 0,
TaxAmount: formValues.TaxAmount || 0,
TaxRegistrationSnapshot: formValues.TaxRegistrationSnapshot || null,
RecordStatus: formValues.RecordStatus || null,

    } as ICustomerInvoiceTax ; 
	
	  this.spinner.show(); 
    this.customerInvoiceTaxService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(CustomerInvoiceTax +  'Details Updated sucessfully.');
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



