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
import { IPaymentAllocation } from './paymentAllocation';
import { PaymentAllocationService } from './paymentAllocation.service';


@Component({
  selector: 'app-paymentAllocation-edit',
  standalone: false,
  templateUrl: './paymentAllocation-edit.component.html',
  providers: [ MessageService]
})
export class PaymentAllocationEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  paymentAllocation: IPaymentAllocation = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  paymentreceiptidOptions: ISelectItem[] = [];
receivableidOptions: ISelectItem[] = [];
allocationtypeOptions: ISelectItem[] = [];
reversalofallocationidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IPaymentAllocation = {} as IPaymentAllocation;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private paymentAllocationService: PaymentAllocationService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.paymentAllocation };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
PaymentReceiptId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ReceivableId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AllocationDate: new FormControl(new Date(), [Validators.required]),
AllocatedAmount: new FormControl(0, [Validators.required]),
ExchangeRate: new FormControl(0, []),
AllocationType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ReversalOfAllocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ReversedAtUtc: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.paymentreceiptidOptions.push({Text: 'PaymentReceiptId1', Value: 'PaymentReceiptId1' });
this.paymentreceiptidOptions.push({Text: 'PaymentReceiptId2', Value: 'PaymentReceiptId2' });
this.receivableidOptions.push({Text: 'ReceivableId1', Value: 'ReceivableId1' });
this.receivableidOptions.push({Text: 'ReceivableId2', Value: 'ReceivableId2' });
this.allocationtypeOptions = this.loggedInUserService.getPicklistOptions('AllocationType');
this.reversalofallocationidOptions.push({Text: 'ReversalOfAllocationId1', Value: 'ReversalOfAllocationId1' });
this.reversalofallocationidOptions.push({Text: 'ReversalOfAllocationId2', Value: 'ReversalOfAllocationId2' });
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
    this.paymentAllocationService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.paymentAllocation = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.paymentAllocation };
        this.populateUI(this.paymentAllocation);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IPaymentAllocation): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PaymentReceiptId: obj.PaymentReceiptId || 0,
ReceivableId: obj.ReceivableId || 0,
AllocationDate:  obj.AllocationDate || new Date(),
AllocatedAmount: obj.AllocatedAmount || 0,
ExchangeRate: obj.ExchangeRate || 0,
AllocationType: obj.AllocationType || '',
ReversalOfAllocationId: obj.ReversalOfAllocationId || 0,
ReversedAtUtc:  obj.ReversedAtUtc || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "PaymentAllocation Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/billing-finance/payments/allocation/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.paymentAllocation = { ...this.objMaster };
	var obj  = this.paymentAllocation;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PaymentReceiptId: obj.PaymentReceiptId || 0,
ReceivableId: obj.ReceivableId || 0,
AllocationDate:  obj.AllocationDate || new Date(),
AllocatedAmount: obj.AllocatedAmount || 0,
ExchangeRate: obj.ExchangeRate || 0,
AllocationType: obj.AllocationType || '',
ReversalOfAllocationId: obj.ReversalOfAllocationId || 0,
ReversedAtUtc:  obj.ReversedAtUtc || new Date(),
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
     PaymentReceiptId:  formValues.PaymentReceiptId || null,
ReceivableId:  formValues.ReceivableId || null,
AllocationDate:  formValues.AllocationDate || null,
AllocatedAmount:  formValues.AllocatedAmount || null,
ExchangeRate:  formValues.ExchangeRate || null,
AllocationType:  formValues.AllocationType || null,
ReversalOfAllocationId:  formValues.ReversalOfAllocationId || null,
ReversedAtUtc:  formValues.ReversedAtUtc || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IPaymentAllocation ;
	
	this.spinner.show();  	   
    this.paymentAllocationService.update(this.paymentAllocation.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(PaymentAllocation +  'Details Updated sucessfully.');
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
