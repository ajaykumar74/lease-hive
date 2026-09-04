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
import { ICustomerInvoice } from './customerInvoice';
import { CustomerInvoiceService } from './customerInvoice.service';


@Component({
  selector: 'app-customerInvoice-edit',
  standalone: false,
  templateUrl: './customerInvoice-edit.component.html',
  providers: [ MessageService]
})
export class CustomerInvoiceEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  customerInvoice: ICustomerInvoice = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  invoicestatusidOptions: ISelectItem[] = [];
billingorganisationidOptions: ISelectItem[] = [];
customerpartyidOptions: ISelectItem[] = [];
leasecontractidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ICustomerInvoice = {} as ICustomerInvoice;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private customerInvoiceService: CustomerInvoiceService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.customerInvoice };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
InvoiceStatusId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
BillingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LeaseContractId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
InvoiceDate: new FormControl(new Date(), [Validators.required]),
DueDate: new FormControl(new Date(), [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ExchangeRate: new FormControl(0, [Validators.required]),
SubtotalAmount: new FormControl(0, [Validators.required]),
TaxAmount: new FormControl(0, [Validators.required]),
GrossAmount: new FormControl(0, [Validators.required]),
OutstandingAmount: new FormControl(0, [Validators.required]),
PaymentTermDays: new FormControl(0, [Validators.min(-32768), Validators.max(32767)]),
BillingAddressSnapshot: new FormControl('', [Validators.required, Validators.maxLength(1000), ]),
CustomerTaxRegistrationSnapshot: new FormControl('', [Validators.maxLength(40), ]), 
OrganisationTaxRegistrationSnapshot: new FormControl('', [Validators.maxLength(40), ]), 
PlaceOfSupplyCode: new FormControl('', [Validators.maxLength(20), ]), 
IssuedAtUtc: new FormControl(new Date(), []),
ExternalEInvoiceRef: new FormControl('', [Validators.maxLength(100), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.invoicestatusidOptions.push({Text: 'InvoiceStatusId1', Value: 'InvoiceStatusId1' });
this.invoicestatusidOptions.push({Text: 'InvoiceStatusId2', Value: 'InvoiceStatusId2' });
this.billingorganisationidOptions.push({Text: 'BillingOrganisationId1', Value: 'BillingOrganisationId1' });
this.billingorganisationidOptions.push({Text: 'BillingOrganisationId2', Value: 'BillingOrganisationId2' });
this.customerpartyidOptions.push({Text: 'CustomerPartyId1', Value: 'CustomerPartyId1' });
this.customerpartyidOptions.push({Text: 'CustomerPartyId2', Value: 'CustomerPartyId2' });
this.leasecontractidOptions.push({Text: 'LeaseContractId1', Value: 'LeaseContractId1' });
this.leasecontractidOptions.push({Text: 'LeaseContractId2', Value: 'LeaseContractId2' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
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
    this.customerInvoiceService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.customerInvoice = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.customerInvoice };
        this.populateUI(this.customerInvoice);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ICustomerInvoice): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  InvoiceStatusId: obj.InvoiceStatusId || 0,
BillingOrganisationId: obj.BillingOrganisationId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
LeaseContractId: obj.LeaseContractId || 0,
InvoiceDate:  obj.InvoiceDate || new Date(),
DueDate:  obj.DueDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
ExchangeRate: obj.ExchangeRate || 0,
SubtotalAmount: obj.SubtotalAmount || 0,
TaxAmount: obj.TaxAmount || 0,
GrossAmount: obj.GrossAmount || 0,
OutstandingAmount: obj.OutstandingAmount || 0,
PaymentTermDays: obj.PaymentTermDays || 0,
BillingAddressSnapshot: obj.BillingAddressSnapshot || '',
CustomerTaxRegistrationSnapshot: obj.CustomerTaxRegistrationSnapshot || '',
OrganisationTaxRegistrationSnapshot: obj.OrganisationTaxRegistrationSnapshot || '',
PlaceOfSupplyCode: obj.PlaceOfSupplyCode || '',
IssuedAtUtc:  obj.IssuedAtUtc || new Date(),
ExternalEInvoiceRef: obj.ExternalEInvoiceRef || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "CustomerInvoice Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/billing-finance/invoices/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.customerInvoice = { ...this.objMaster };
	var obj  = this.customerInvoice;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  InvoiceStatusId: obj.InvoiceStatusId || 0,
BillingOrganisationId: obj.BillingOrganisationId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
LeaseContractId: obj.LeaseContractId || 0,
InvoiceDate:  obj.InvoiceDate || new Date(),
DueDate:  obj.DueDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
ExchangeRate: obj.ExchangeRate || 0,
SubtotalAmount: obj.SubtotalAmount || 0,
TaxAmount: obj.TaxAmount || 0,
GrossAmount: obj.GrossAmount || 0,
OutstandingAmount: obj.OutstandingAmount || 0,
PaymentTermDays: obj.PaymentTermDays || 0,
BillingAddressSnapshot: obj.BillingAddressSnapshot || '',
CustomerTaxRegistrationSnapshot: obj.CustomerTaxRegistrationSnapshot || '',
OrganisationTaxRegistrationSnapshot: obj.OrganisationTaxRegistrationSnapshot || '',
PlaceOfSupplyCode: obj.PlaceOfSupplyCode || '',
IssuedAtUtc:  obj.IssuedAtUtc || new Date(),
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     InvoiceStatusId:  formValues.InvoiceStatusId || null,
BillingOrganisationId:  formValues.BillingOrganisationId || null,
CustomerPartyId:  formValues.CustomerPartyId || null,
LeaseContractId:  formValues.LeaseContractId || null,
InvoiceDate:  formValues.InvoiceDate || null,
DueDate:  formValues.DueDate || null,
CurrencyCode:  formValues.CurrencyCode || null,
ExchangeRate:  formValues.ExchangeRate || null,
SubtotalAmount:  formValues.SubtotalAmount || null,
TaxAmount:  formValues.TaxAmount || null,
GrossAmount:  formValues.GrossAmount || null,
OutstandingAmount:  formValues.OutstandingAmount || null,
PaymentTermDays:  formValues.PaymentTermDays || null,
BillingAddressSnapshot:  formValues.BillingAddressSnapshot || null,
CustomerTaxRegistrationSnapshot:  formValues.CustomerTaxRegistrationSnapshot || null,
OrganisationTaxRegistrationSnapshot:  formValues.OrganisationTaxRegistrationSnapshot || null,
PlaceOfSupplyCode:  formValues.PlaceOfSupplyCode || null,
IssuedAtUtc:  formValues.IssuedAtUtc || null,
ExternalEInvoiceRef:  formValues.ExternalEInvoiceRef || null,
RecordStatus:  formValues.RecordStatus || null,

    } as ICustomerInvoice ;
	
	this.spinner.show();  	   
    this.customerInvoiceService.update(this.customerInvoice.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(CustomerInvoice +  'Details Updated sucessfully.');
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
