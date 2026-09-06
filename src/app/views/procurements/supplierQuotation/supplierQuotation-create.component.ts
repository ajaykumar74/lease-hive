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
import { ISupplierQuotation } from './supplierQuotation';
import { SupplierQuotationService } from './supplierQuotation.service';

@Component({
  selector: 'app-supplierQuotation-create',
  standalone: false,
  templateUrl: './supplierQuotation-create.component.html' ,
   providers: [ MessageService]
})
export class SupplierQuotationCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  supplierQuotation: ISupplierQuotation = null;
  rfqidOptions: ISelectItem[] = [];
supplierpartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
quotationstatuscodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ISupplierQuotation = {} as ISupplierQuotation;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private supplierQuotationService: SupplierQuotationService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.supplierQuotation };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
RFQId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SupplierPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SupplierQuoteNo: new FormControl('', [Validators.maxLength(80), ]), 
VersionNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
QuoteDate: new FormControl(new Date(), [Validators.required]),
ValidUntil: new FormControl(new Date(), []),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Subtotal: new FormControl(0, [Validators.required]),
TaxAmount: new FormControl(0, [Validators.required]),
TotalAmount: new FormControl(0, [Validators.required]),
PaymentTermCode: new FormControl('', [Validators.maxLength(20), ]), 
DeliveryDays: new FormControl(0, [Validators.min(-32768), Validators.max(32767)]),
QuotationStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create SupplierQuotation';
    this.rfqidOptions.push({Text: 'RFQId1', Value: 'RFQId1' });
this.rfqidOptions.push({Text: 'RFQId2', Value: 'RFQId2' });
this.supplierpartyidOptions.push({Text: 'SupplierPartyId1', Value: 'SupplierPartyId1' });
this.supplierpartyidOptions.push({Text: 'SupplierPartyId2', Value: 'SupplierPartyId2' });
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.quotationstatuscodeOptions = this.loggedInUserService.getPicklistOptions('SupplierQuotationQuotationStatusCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.supplierQuotationService.getById(this.selectedId).subscribe({
      next: data => {
        this.supplierQuotation = data;
        this.objMaster = { ...this.supplierQuotation };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ISupplierQuotation): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  RFQId: obj.RFQId || 0,
SupplierPartyId: obj.SupplierPartyId || 0,
SupplierQuoteNo: obj.SupplierQuoteNo || '',
VersionNo: obj.VersionNo || 0,
QuoteDate:  obj.QuoteDate || new Date(),
ValidUntil:  obj.ValidUntil || new Date(),
CurrencyCode: obj.CurrencyCode || '',
Subtotal: obj.Subtotal || 0,
TaxAmount: obj.TaxAmount || 0,
TotalAmount: obj.TotalAmount || 0,
PaymentTermCode: obj.PaymentTermCode || '',
DeliveryDays: obj.DeliveryDays || 0,
QuotationStatusCode: obj.QuotationStatusCode || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/supplier-quotations/create']);
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
    this.supplierQuotation = { ...this.objMaster };
    var obj  = this.supplierQuotation;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  RFQId: obj.RFQId || 0,
SupplierPartyId: obj.SupplierPartyId || 0,
SupplierQuoteNo: obj.SupplierQuoteNo || '',
VersionNo: obj.VersionNo || 0,
QuoteDate:  obj.QuoteDate || new Date(),
ValidUntil:  obj.ValidUntil || new Date(),
CurrencyCode: obj.CurrencyCode || '',
Subtotal: obj.Subtotal || 0,
TaxAmount: obj.TaxAmount || 0,
TotalAmount: obj.TotalAmount || 0,
PaymentTermCode: obj.PaymentTermCode || '',
DeliveryDays: obj.DeliveryDays || 0,
QuotationStatusCode: obj.QuotationStatusCode || '',
 
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
     RFQId: formValues.RFQId || 0,
SupplierPartyId: formValues.SupplierPartyId || 0,
SupplierQuoteNo: formValues.SupplierQuoteNo || null,
VersionNo: formValues.VersionNo || 0,
QuoteDate: formValues.QuoteDate || null,
ValidUntil: formValues.ValidUntil || null,
CurrencyCode: formValues.CurrencyCode || null,
Subtotal: formValues.Subtotal || 0,
TaxAmount: formValues.TaxAmount || 0,
TotalAmount: formValues.TotalAmount || 0,
PaymentTermCode: formValues.PaymentTermCode || null,
DeliveryDays: formValues.DeliveryDays || 0,
QuotationStatusCode: formValues.QuotationStatusCode || null,
RecordStatus: 'Active',
    } as ISupplierQuotation ; 
	
	  this.spinner.show(); 
    this.supplierQuotationService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(SupplierQuotation +  'Details Updated sucessfully.');
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



