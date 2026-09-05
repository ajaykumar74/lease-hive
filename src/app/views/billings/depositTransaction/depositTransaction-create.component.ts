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
import { IDepositTransaction } from './depositTransaction';
import { DepositTransactionService } from './depositTransaction.service';

@Component({
  selector: 'app-depositTransaction-create',
  standalone: false,
  templateUrl: './depositTransaction-create.component.html' ,
   providers: [ MessageService]
})
export class DepositTransactionCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  depositTransaction: IDepositTransaction = null;
  customerdepositidOptions: ISelectItem[] = [];
transactiontypeOptions: ISelectItem[] = [];
paymentreceiptidOptions: ISelectItem[] = [];
receivableidOptions: ISelectItem[] = [];
approvalrequestidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IDepositTransaction = {} as IDepositTransaction;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private depositTransactionService: DepositTransactionService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.depositTransaction };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
CustomerDepositId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
TransactionType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
TransactionDate: new FormControl(new Date(), [Validators.required]),
Amount: new FormControl(0, [Validators.required]),
PaymentReceiptId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ReceivableId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ReferenceType: new FormControl('', [Validators.maxLength(30), ]), 
ReferenceId: new FormControl(0, []),
ApprovalRequestId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),

    });
    this.Caption = 'Create DepositTransaction';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'CustomerDepositId', 'customer-deposits',
      options => this.customerdepositidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.transactiontypeOptions = this.loggedInUserService.getPicklistOptions('TransactionType');
this.loggedInUserService.bindEntityLookup(this.editForm, 'PaymentReceiptId', 'payment-receipts',
      options => this.paymentreceiptidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ReceivableId', 'receivables',
      options => this.receivableidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ApprovalRequestId', 'approval-requests',
      options => this.approvalrequestidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.depositTransactionService.getById(this.selectedId).subscribe({
      next: data => {
        this.depositTransaction = data;
        this.objMaster = { ...this.depositTransaction };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IDepositTransaction): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CustomerDepositId: obj.CustomerDepositId || 0,
TransactionType: obj.TransactionType || '',
TransactionDate:  obj.TransactionDate || new Date(),
Amount: obj.Amount || 0,
PaymentReceiptId: obj.PaymentReceiptId || 0,
ReceivableId: obj.ReceivableId || 0,
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
ApprovalRequestId: obj.ApprovalRequestId || 0,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/depositTransactions/create']);
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
    this.depositTransaction = { ...this.objMaster };
    var obj  = this.depositTransaction;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CustomerDepositId: obj.CustomerDepositId || 0,
TransactionType: obj.TransactionType || '',
TransactionDate:  obj.TransactionDate || new Date(),
Amount: obj.Amount || 0,
PaymentReceiptId: obj.PaymentReceiptId || 0,
ReceivableId: obj.ReceivableId || 0,
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
ApprovalRequestId: obj.ApprovalRequestId || 0,
 
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
     CustomerDepositId: formValues.CustomerDepositId || 0,
TransactionType: formValues.TransactionType || null,
TransactionDate: formValues.TransactionDate || null,
Amount: formValues.Amount || 0,
PaymentReceiptId: formValues.PaymentReceiptId || 0,
ReceivableId: formValues.ReceivableId || 0,
ReferenceType: formValues.ReferenceType || null,
ReferenceId: formValues.ReferenceId || 0,
ApprovalRequestId: formValues.ApprovalRequestId || 0,
RecordStatus: 'Active',

    } as IDepositTransaction ; 
	
	  this.spinner.show(); 
    this.depositTransactionService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(DepositTransaction +  'Details Updated sucessfully.');
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



