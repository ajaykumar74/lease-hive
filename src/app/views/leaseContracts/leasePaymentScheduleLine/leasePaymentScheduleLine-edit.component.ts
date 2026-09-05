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
import { ILeasePaymentScheduleLine } from './leasePaymentScheduleLine';
import { LeasePaymentScheduleLineService } from './leasePaymentScheduleLine.service';


@Component({
  selector: 'app-leasePaymentScheduleLine-edit',
  standalone: false,
  templateUrl: './leasePaymentScheduleLine-edit.component.html',
  providers: [ MessageService]
})
export class LeasePaymentScheduleLineEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  leasePaymentScheduleLine: ILeasePaymentScheduleLine = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  leasepaymentscheduleidOptions: ISelectItem[] = [];
billingstatuscodeOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ILeasePaymentScheduleLine = {} as ILeasePaymentScheduleLine;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private leasePaymentScheduleLineService: LeasePaymentScheduleLineService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.leasePaymentScheduleLine };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
LeasePaymentScheduleId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
InstallmentNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
DueDate: new FormControl(new Date(), [Validators.required]),
BillingStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'LeasePaymentScheduleId', 'lease-payment-schedules',
      options => this.leasepaymentscheduleidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.billingstatuscodeOptions = this.loggedInUserService.getPicklistOptions('BillingStatusCode');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.leasePaymentScheduleLineService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.leasePaymentScheduleLine = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.leasePaymentScheduleLine };
        this.populateUI(this.leasePaymentScheduleLine);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "LeasePaymentScheduleLine Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contracts/payment-schedules/lines/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     LeasePaymentScheduleId:  formValues.LeasePaymentScheduleId || null,
InstallmentNo:  formValues.InstallmentNo || null,
DueDate:  formValues.DueDate || null,
OpeningPrincipal:  formValues.OpeningPrincipal || null,
PrincipalAmount:  formValues.PrincipalAmount || null,
FinanceAmount:  formValues.FinanceAmount || null,
RentalAmount:  formValues.RentalAmount || null,
TaxAmount:  formValues.TaxAmount || null,
ChargeAmount:  formValues.ChargeAmount || null,
TotalDueAmount:  formValues.TotalDueAmount || null,
ClosingPrincipal:  formValues.ClosingPrincipal || null,
BillingStatusCode:  formValues.BillingStatusCode || null,

    } as ILeasePaymentScheduleLine ;
	
	this.spinner.show();  	   
    this.leasePaymentScheduleLineService.update(this.leasePaymentScheduleLine.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(LeasePaymentScheduleLine +  'Details Updated sucessfully.');
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
