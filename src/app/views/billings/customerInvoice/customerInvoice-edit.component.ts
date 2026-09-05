import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
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
  private readonly entityLookupDestroyRef = inject(DestroyRef);

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

   this.loggedInUserService.bindEntityLookup(this.editForm, 'InvoiceStatusId', 'invoice-statuses',
      options => this.invoicestatusidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'BillingOrganisationId', 'organisations',
      options => this.billingorganisationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'CustomerPartyId', 'parties',
      options => this.customerpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractId', 'lease-contracts',
      options => this.leasecontractidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"CustomerPartyId":"CustomerPartyId"});
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

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
     InvoiceStatusId:  formValues.InvoiceStatusId || 0,
BillingOrganisationId:  formValues.BillingOrganisationId || 0,
CustomerPartyId:  formValues.CustomerPartyId || 0,
LeaseContractId:  formValues.LeaseContractId || 0,
InvoiceDate:  formValues.InvoiceDate || null,
DueDate:  formValues.DueDate || null,
CurrencyCode:  formValues.CurrencyCode || null,
ExchangeRate:  formValues.ExchangeRate || 0,
SubtotalAmount:  formValues.SubtotalAmount || 0,
TaxAmount:  formValues.TaxAmount || 0,
GrossAmount:  formValues.GrossAmount || 0,
OutstandingAmount:  formValues.OutstandingAmount || 0,
PaymentTermDays:  formValues.PaymentTermDays || 0,
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
