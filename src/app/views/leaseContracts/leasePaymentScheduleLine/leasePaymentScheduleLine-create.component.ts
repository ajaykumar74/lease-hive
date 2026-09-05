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
import { ILeasePaymentScheduleLine } from './leasePaymentScheduleLine';
import { LeasePaymentScheduleLineService } from './leasePaymentScheduleLine.service';

@Component({
  selector: 'app-leasePaymentScheduleLine-create',
  standalone: false,
  templateUrl: './leasePaymentScheduleLine-create.component.html' ,
   providers: [ MessageService]
})
export class LeasePaymentScheduleLineCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  leasePaymentScheduleLine: ILeasePaymentScheduleLine = null;
  leasepaymentscheduleidOptions: ISelectItem[] = [];
billingstatuscodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ILeasePaymentScheduleLine = {} as ILeasePaymentScheduleLine;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private leasePaymentScheduleLineService: LeasePaymentScheduleLineService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.leasePaymentScheduleLine };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
LeasePaymentScheduleId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
InstallmentNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
DueDate: new FormControl(new Date(), [Validators.required]),
BillingStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create LeasePaymentScheduleLine';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'LeasePaymentScheduleId', 'lease-payment-schedules',
      options => this.leasepaymentscheduleidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.billingstatuscodeOptions = this.loggedInUserService.getPicklistOptions('BillingStatusCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.leasePaymentScheduleLineService.getById(this.selectedId).subscribe({
      next: data => {
        this.leasePaymentScheduleLine = data;
        this.objMaster = { ...this.leasePaymentScheduleLine };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ILeasePaymentScheduleLine): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeasePaymentScheduleId: obj.LeasePaymentScheduleId || 0,
InstallmentNo: obj.InstallmentNo || 0,
DueDate:  obj.DueDate || new Date(),
BillingStatusCode: obj.BillingStatusCode || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/leasePaymentScheduleLines/create']);
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
    this.leasePaymentScheduleLine = { ...this.objMaster };
    var obj  = this.leasePaymentScheduleLine;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeasePaymentScheduleId: obj.LeasePaymentScheduleId || 0,
InstallmentNo: obj.InstallmentNo || 0,
DueDate:  obj.DueDate || new Date(),
BillingStatusCode: obj.BillingStatusCode || '',
 
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
     LeasePaymentScheduleId: formValues.LeasePaymentScheduleId || 0,
InstallmentNo: formValues.InstallmentNo || 0,
DueDate: formValues.DueDate || null,
OpeningPrincipal: formValues.OpeningPrincipal || 0,
PrincipalAmount: formValues.PrincipalAmount || 0,
FinanceAmount: formValues.FinanceAmount || 0,
RentalAmount: formValues.RentalAmount || 0,
TaxAmount: formValues.TaxAmount || 0,
ChargeAmount: formValues.ChargeAmount || 0,
TotalDueAmount: formValues.TotalDueAmount || 0,
ClosingPrincipal: formValues.ClosingPrincipal || 0,
BillingStatusCode: formValues.BillingStatusCode || null,

    } as ILeasePaymentScheduleLine ; 
	
	  this.spinner.show(); 
    this.leasePaymentScheduleLineService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(LeasePaymentScheduleLine +  'Details Updated sucessfully.');
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



