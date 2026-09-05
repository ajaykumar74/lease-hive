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
import { ICreditNote } from './creditNote';
import { CreditNoteService } from './creditNote.service';

@Component({
  selector: 'app-creditNote-create',
  standalone: false,
  templateUrl: './creditNote-create.component.html' ,
   providers: [ MessageService]
})
export class CreditNoteCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  creditNote: ICreditNote = null;
  billingorganisationidOptions: ISelectItem[] = [];
customerpartyidOptions: ISelectItem[] = [];
customerinvoiceidOptions: ISelectItem[] = [];
leasecontractidOptions: ISelectItem[] = [];
reasoncodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ICreditNote = {} as ICreditNote;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private creditNoteService: CreditNoteService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.creditNote };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
BillingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerInvoiceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
LeaseContractId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CreditNoteDate: new FormControl(new Date(), [Validators.required]),
ReasonCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
NetAmount: new FormControl(0, [Validators.required]),
TaxAmount: new FormControl(0, [Validators.required]),
GrossAmount: new FormControl(0, [Validators.required]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ExternalEInvoiceRef: new FormControl('', [Validators.maxLength(100), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create CreditNote';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'BillingOrganisationId', 'organisations',
      options => this.billingorganisationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'CustomerPartyId', 'parties',
      options => this.customerpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'CustomerInvoiceId', 'customer-invoices',
      options => this.customerinvoiceidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"BillingOrganisationId":"BillingOrganisationId","LeaseContractId":"LeaseContractId","CustomerPartyId":"CustomerPartyId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractId', 'lease-contracts',
      options => this.leasecontractidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"CustomerPartyId":"CustomerPartyId"});
this.reasoncodeOptions = this.loggedInUserService.getPicklistOptions('CreditNoteReasonCode');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('CreditNoteStatusCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.creditNoteService.getById(this.selectedId).subscribe({
      next: data => {
        this.creditNote = data;
        this.objMaster = { ...this.creditNote };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ICreditNote): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  BillingOrganisationId: obj.BillingOrganisationId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
CustomerInvoiceId: obj.CustomerInvoiceId || 0,
LeaseContractId: obj.LeaseContractId || 0,
CreditNoteDate:  obj.CreditNoteDate || new Date(),
ReasonCode: obj.ReasonCode || '',
CurrencyCode: obj.CurrencyCode || '',
NetAmount: obj.NetAmount || 0,
TaxAmount: obj.TaxAmount || 0,
GrossAmount: obj.GrossAmount || 0,
StatusCode: obj.StatusCode || '',
ExternalEInvoiceRef: obj.ExternalEInvoiceRef || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/creditNotes/create']);
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
    this.creditNote = { ...this.objMaster };
    var obj  = this.creditNote;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  BillingOrganisationId: obj.BillingOrganisationId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
CustomerInvoiceId: obj.CustomerInvoiceId || 0,
LeaseContractId: obj.LeaseContractId || 0,
CreditNoteDate:  obj.CreditNoteDate || new Date(),
ReasonCode: obj.ReasonCode || '',
CurrencyCode: obj.CurrencyCode || '',
NetAmount: obj.NetAmount || 0,
TaxAmount: obj.TaxAmount || 0,
GrossAmount: obj.GrossAmount || 0,
StatusCode: obj.StatusCode || '',
ExternalEInvoiceRef: obj.ExternalEInvoiceRef || '',
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     BillingOrganisationId: formValues.BillingOrganisationId || 0,
CustomerPartyId: formValues.CustomerPartyId || 0,
CustomerInvoiceId: formValues.CustomerInvoiceId || 0,
LeaseContractId: formValues.LeaseContractId || 0,
CreditNoteDate: formValues.CreditNoteDate || null,
ReasonCode: formValues.ReasonCode || null,
CurrencyCode: formValues.CurrencyCode || null,
NetAmount: formValues.NetAmount || 0,
TaxAmount: formValues.TaxAmount || 0,
GrossAmount: formValues.GrossAmount || 0,
StatusCode: formValues.StatusCode || null,
ExternalEInvoiceRef: formValues.ExternalEInvoiceRef || null,
RecordStatus: formValues.RecordStatus || null,

    } as ICreditNote ; 
	
	  this.spinner.show(); 
    this.creditNoteService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(CreditNote +  'Details Updated sucessfully.');
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



