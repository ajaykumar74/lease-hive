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
import { IPaymentReceipt } from './paymentReceipt';
import { PaymentReceiptService } from './paymentReceipt.service';


@Component({
  selector: 'app-paymentReceipt-edit',
  standalone: false,
  templateUrl: './paymentReceipt-edit.component.html',
  providers: [ MessageService]
})
export class PaymentReceiptEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  paymentReceipt: IPaymentReceipt = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  receiptstatusidOptions: ISelectItem[] = [];
receivingorganisationidOptions: ISelectItem[] = [];
customerpartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
paymentmethodOptions: ISelectItem[] = [];
organisationbankaccountidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IPaymentReceipt = {} as IPaymentReceipt;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private paymentReceiptService: PaymentReceiptService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.paymentReceipt };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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

   this.receiptstatusidOptions.push({Text: 'ReceiptStatusId1', Value: 'ReceiptStatusId1' });
this.receiptstatusidOptions.push({Text: 'ReceiptStatusId2', Value: 'ReceiptStatusId2' });
this.receivingorganisationidOptions.push({Text: 'ReceivingOrganisationId1', Value: 'ReceivingOrganisationId1' });
this.receivingorganisationidOptions.push({Text: 'ReceivingOrganisationId2', Value: 'ReceivingOrganisationId2' });
this.customerpartyidOptions.push({Text: 'CustomerPartyId1', Value: 'CustomerPartyId1' });
this.customerpartyidOptions.push({Text: 'CustomerPartyId2', Value: 'CustomerPartyId2' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.paymentmethodOptions.push({Text: 'BANK_TRANSFER', Value: 'BANK_TRANSFER' });
this.paymentmethodOptions.push({Text: 'UPI', Value: 'UPI' });
this.paymentmethodOptions.push({Text: 'CARD', Value: 'CARD' });
this.paymentmethodOptions.push({Text: 'CHEQUE', Value: 'CHEQUE' });
this.organisationbankaccountidOptions.push({Text: 'OrganisationBankAccountId1', Value: 'OrganisationBankAccountId1' });
this.organisationbankaccountidOptions.push({Text: 'OrganisationBankAccountId2', Value: 'OrganisationBankAccountId2' });
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
    this.paymentReceiptService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.paymentReceipt = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.paymentReceipt };
        this.populateUI(this.paymentReceipt);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "PaymentReceipt Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/billing-finance/payments/receipts/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     ReceiptStatusId:  formValues.ReceiptStatusId || null,
ReceivingOrganisationId:  formValues.ReceivingOrganisationId || null,
CustomerPartyId:  formValues.CustomerPartyId || null,
ReceiptDate:  formValues.ReceiptDate || null,
CurrencyCode:  formValues.CurrencyCode || null,
ReceiptAmount:  formValues.ReceiptAmount || null,
AllocatedAmount:  formValues.AllocatedAmount || null,
UnappliedAmount:  formValues.UnappliedAmount || null,
PaymentMethod:  formValues.PaymentMethod || null,
OrganisationBankAccountId:  formValues.OrganisationBankAccountId || null,
ExternalTransactionRef:  formValues.ExternalTransactionRef || null,
PayerNameSnapshot:  formValues.PayerNameSnapshot || null,
VerifiedAtUtc:  formValues.VerifiedAtUtc || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IPaymentReceipt ;
	
	this.spinner.show();  	   
    this.paymentReceiptService.update(this.paymentReceipt.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(PaymentReceipt +  'Details Updated sucessfully.');
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
