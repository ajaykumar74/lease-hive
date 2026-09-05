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
import { IDepositTransaction } from './depositTransaction';
import { DepositTransactionService } from './depositTransaction.service';


@Component({
  selector: 'app-depositTransaction-edit',
  standalone: false,
  templateUrl: './depositTransaction-edit.component.html',
  providers: [ MessageService]
})
export class DepositTransactionEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  depositTransaction: IDepositTransaction = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  customerdepositidOptions: ISelectItem[] = [];
transactiontypeOptions: ISelectItem[] = [];
paymentreceiptidOptions: ISelectItem[] = [];
receivableidOptions: ISelectItem[] = [];
approvalrequestidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IDepositTransaction = {} as IDepositTransaction;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private depositTransactionService: DepositTransactionService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.depositTransaction };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
CustomerDepositId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
TransactionType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
TransactionDate: new FormControl(new Date(), [Validators.required]),
Amount: new FormControl(0, [Validators.required]),
PaymentReceiptId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ReceivableId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ReferenceType: new FormControl('', [Validators.maxLength(30), ]), 
ReferenceId: new FormControl(0, []),
ApprovalRequestId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

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
    this.depositTransactionService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.depositTransaction = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.depositTransaction };
        this.populateUI(this.depositTransaction);
      },
      error: err => { this.messageService.showSuccess(err); },
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
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "DepositTransaction Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/billing-finance/deposits/transactions/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
     CustomerDepositId:  formValues.CustomerDepositId || null,
TransactionType:  formValues.TransactionType || null,
TransactionDate:  formValues.TransactionDate || null,
Amount:  formValues.Amount || null,
PaymentReceiptId:  formValues.PaymentReceiptId || null,
ReceivableId:  formValues.ReceivableId || null,
ReferenceType:  formValues.ReferenceType || null,
ReferenceId:  formValues.ReferenceId || null,
ApprovalRequestId:  formValues.ApprovalRequestId || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IDepositTransaction ;
	
	this.spinner.show();  	   
    this.depositTransactionService.update(this.depositTransaction.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(DepositTransaction +  'Details Updated sucessfully.');
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
