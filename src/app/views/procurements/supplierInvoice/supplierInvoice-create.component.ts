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
import { ISupplierInvoice } from './supplierInvoice';
import { SupplierInvoiceService } from './supplierInvoice.service';

@Component({
  selector: 'app-supplierInvoice-create',
  standalone: false,
  templateUrl: './supplierInvoice-create.component.html' ,
   providers: [ MessageService]
})
export class SupplierInvoiceCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  supplierInvoice: ISupplierInvoice = null;
  supplierpartyidOptions: ISelectItem[] = [];
buyingorganisationidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
matchstatuscodeOptions: ISelectItem[] = [];
invoicedocumentidOptions: ISelectItem[] = [];
capturedbyOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ISupplierInvoice = {} as ISupplierInvoice;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private supplierInvoiceService: SupplierInvoiceService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.supplierInvoice };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
SupplierPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
BuyingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SupplierInvoiceNo: new FormControl('', [Validators.required, Validators.maxLength(80), ]),
InvoiceDate: new FormControl(new Date(), [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Subtotal: new FormControl(0, [Validators.required]),
TaxAmount: new FormControl(0, [Validators.required]),
TotalAmount: new FormControl(0, [Validators.required]),
MatchStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
InvoiceDocumentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
APReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CapturedOn: new FormControl(new Date(), [Validators.required]),
CapturedBy: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),

    });
    this.Caption = 'Create SupplierInvoice';
this.loggedInUserService.bindEntityLookup(this.editForm, 'BuyingOrganisationId', 'organisations',
      options => this.buyingorganisationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'CapturedBy', 'application-users',
      options => this.capturedbyOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'InvoiceDocumentId', 'documents',
      options => this.invoicedocumentidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'SupplierPartyId', 'parties',
      options => this.supplierpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.matchstatuscodeOptions = this.loggedInUserService.getPicklistOptions('SupplierInvoiceMatchStatusCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.supplierInvoiceService.getById(this.selectedId).subscribe({
      next: data => {
        this.supplierInvoice = data;
        this.objMaster = { ...this.supplierInvoice };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ISupplierInvoice): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  SupplierPartyId: obj.SupplierPartyId || 0,
BuyingOrganisationId: obj.BuyingOrganisationId || 0,
SupplierInvoiceNo: obj.SupplierInvoiceNo || '',
InvoiceDate:  obj.InvoiceDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
Subtotal: obj.Subtotal || 0,
TaxAmount: obj.TaxAmount || 0,
TotalAmount: obj.TotalAmount || 0,
MatchStatusCode: obj.MatchStatusCode || '',
InvoiceDocumentId: obj.InvoiceDocumentId || 0,
APReferenceId: obj.APReferenceId || 0,
CapturedOn:  obj.CapturedOn || new Date(),
CapturedBy: obj.CapturedBy || 0,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/supplier-invoices/create']);
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
    this.supplierInvoice = { ...this.objMaster };
    var obj  = this.supplierInvoice;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  SupplierPartyId: obj.SupplierPartyId || 0,
BuyingOrganisationId: obj.BuyingOrganisationId || 0,
SupplierInvoiceNo: obj.SupplierInvoiceNo || '',
InvoiceDate:  obj.InvoiceDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
Subtotal: obj.Subtotal || 0,
TaxAmount: obj.TaxAmount || 0,
TotalAmount: obj.TotalAmount || 0,
MatchStatusCode: obj.MatchStatusCode || '',
InvoiceDocumentId: obj.InvoiceDocumentId || 0,
APReferenceId: obj.APReferenceId || 0,
CapturedOn:  obj.CapturedOn || new Date(),
CapturedBy: obj.CapturedBy || 0,
 
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
     SupplierPartyId: formValues.SupplierPartyId || 0,
BuyingOrganisationId: formValues.BuyingOrganisationId || 0,
SupplierInvoiceNo: formValues.SupplierInvoiceNo || null,
InvoiceDate: formValues.InvoiceDate || null,
CurrencyCode: formValues.CurrencyCode || null,
Subtotal: formValues.Subtotal || 0,
TaxAmount: formValues.TaxAmount || 0,
TotalAmount: formValues.TotalAmount || 0,
MatchStatusCode: formValues.MatchStatusCode || null,
InvoiceDocumentId: formValues.InvoiceDocumentId || 0,
APReferenceId: formValues.APReferenceId || 0,
CapturedOn: formValues.CapturedOn || null,
CapturedBy: formValues.CapturedBy || 0,
RecordStatus: 'Active',
    } as ISupplierInvoice ; 
	
	  this.spinner.show(); 
    this.supplierInvoiceService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(SupplierInvoice +  'Details Updated sucessfully.');
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



