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
import { IPaymentReceipt } from './paymentReceipt';
import { PaymentReceiptService } from './paymentReceipt.service';

@Component({
  selector: 'app-paymentReceipt-create',
  standalone: false,
  templateUrl: './paymentReceipt-create.component.html' ,
   providers: [ MessageService]
})
export class PaymentReceiptCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  paymentReceipt: IPaymentReceipt = null;
  receiptstatusidOptions: ISelectItem[] = [];
receivingorganisationidOptions: ISelectItem[] = [];
customerpartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
paymentmethodOptions: ISelectItem[] = [];
organisationbankaccountidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IPaymentReceipt = {} as IPaymentReceipt;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private paymentReceiptService: PaymentReceiptService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.paymentReceipt };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ReceiptStatusId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ReceivingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ReceiptDate: new FormControl(new Date(), [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ReceiptAmount: new FormControl(0, [Validators.required]),
AllocatedAmount: new FormControl(0, [Validators.required]),
UnappliedAmount: new FormControl(0, [Validators.required]),
PaymentMethod: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
OrganisationBankAccountId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ExternalTransactionRef: new FormControl('', [Validators.maxLength(100), ]), 
PayerNameSnapshot: new FormControl('', [Validators.maxLength(200), ]), 
VerifiedAtUtc: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create PaymentReceipt';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'ReceiptStatusId', 'receipt-statuses',
      options => this.receiptstatusidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ReceivingOrganisationId', 'organisations',
      options => this.receivingorganisationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'CustomerPartyId', 'parties',
      options => this.customerpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.paymentmethodOptions = this.loggedInUserService.getPicklistOptions('PaymentMethod');
this.organisationbankaccountidOptions.push({Text: 'OrganisationBankAccountId1', Value: 'OrganisationBankAccountId1' });
this.organisationbankaccountidOptions.push({Text: 'OrganisationBankAccountId2', Value: 'OrganisationBankAccountId2' });
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.paymentReceiptService.getById(this.selectedId).subscribe({
      next: data => {
        this.paymentReceipt = data;
        this.objMaster = { ...this.paymentReceipt };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IPaymentReceipt): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReceiptStatusId: obj.ReceiptStatusId || 0,
ReceivingOrganisationId: obj.ReceivingOrganisationId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
ReceiptDate:  obj.ReceiptDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
ReceiptAmount: obj.ReceiptAmount || 0,
AllocatedAmount: obj.AllocatedAmount || 0,
UnappliedAmount: obj.UnappliedAmount || 0,
PaymentMethod: obj.PaymentMethod || '',
OrganisationBankAccountId: obj.OrganisationBankAccountId || 0,
ExternalTransactionRef: obj.ExternalTransactionRef || '',
PayerNameSnapshot: obj.PayerNameSnapshot || '',
VerifiedAtUtc:  obj.VerifiedAtUtc || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/paymentReceipts/create']);
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
    this.paymentReceipt = { ...this.objMaster };
    var obj  = this.paymentReceipt;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReceiptStatusId: obj.ReceiptStatusId || 0,
ReceivingOrganisationId: obj.ReceivingOrganisationId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
ReceiptDate:  obj.ReceiptDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
ReceiptAmount: obj.ReceiptAmount || 0,
AllocatedAmount: obj.AllocatedAmount || 0,
UnappliedAmount: obj.UnappliedAmount || 0,
PaymentMethod: obj.PaymentMethod || '',
OrganisationBankAccountId: obj.OrganisationBankAccountId || 0,
ExternalTransactionRef: obj.ExternalTransactionRef || '',
PayerNameSnapshot: obj.PayerNameSnapshot || '',
VerifiedAtUtc:  obj.VerifiedAtUtc || new Date(),
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
     ReceiptStatusId: formValues.ReceiptStatusId || 0,
ReceivingOrganisationId: formValues.ReceivingOrganisationId || 0,
CustomerPartyId: formValues.CustomerPartyId || 0,
ReceiptDate: formValues.ReceiptDate || null,
CurrencyCode: formValues.CurrencyCode || null,
ReceiptAmount: formValues.ReceiptAmount || 0,
AllocatedAmount: formValues.AllocatedAmount || 0,
UnappliedAmount: formValues.UnappliedAmount || 0,
PaymentMethod: formValues.PaymentMethod || null,
OrganisationBankAccountId: formValues.OrganisationBankAccountId || 0,
ExternalTransactionRef: formValues.ExternalTransactionRef || null,
PayerNameSnapshot: formValues.PayerNameSnapshot || null,
VerifiedAtUtc: formValues.VerifiedAtUtc || null,
RecordStatus: formValues.RecordStatus || null,

    } as IPaymentReceipt ; 
	
	  this.spinner.show(); 
    this.paymentReceiptService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(PaymentReceipt +  'Details Updated sucessfully.');
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



