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
import { ILeasePaymentSchedule } from './leasePaymentSchedule';
import { LeasePaymentScheduleService } from './leasePaymentSchedule.service';


@Component({
  selector: 'app-leasePaymentSchedule-edit',
  standalone: false,
  templateUrl: './leasePaymentSchedule-edit.component.html',
  providers: [ MessageService]
})
export class LeasePaymentScheduleEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  leasePaymentSchedule: ILeasePaymentSchedule = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  leasecontractidOptions: ISelectItem[] = [];
schedulestatuscodeOptions: ISelectItem[] = [];
calculationmethodcodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
generatedbyOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ILeasePaymentSchedule = {} as ILeasePaymentSchedule;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private leasePaymentScheduleService: LeasePaymentScheduleService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.leasePaymentSchedule };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
LeaseContractId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ScheduleVersionNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
ScheduleStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CalculationMethodCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
StartDate: new FormControl(new Date(), [Validators.required]),
EndDate: new FormControl(new Date(), [Validators.required]),
NumberOfPayments: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
GeneratedOn: new FormControl(new Date(), [Validators.required]),
GeneratedBy: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractId', 'lease-contracts',
      options => this.leasecontractidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.schedulestatuscodeOptions = this.loggedInUserService.getPicklistOptions('ScheduleStatusCode');
this.calculationmethodcodeOptions = this.loggedInUserService.getPicklistOptions('CalculationMethodCode');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.generatedbyOptions.push({Text: 'GeneratedBy1', Value: 'GeneratedBy1' });
this.generatedbyOptions.push({Text: 'GeneratedBy2', Value: 'GeneratedBy2' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.leasePaymentScheduleService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.leasePaymentSchedule = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.leasePaymentSchedule };
        this.populateUI(this.leasePaymentSchedule);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ILeasePaymentSchedule): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
ScheduleVersionNo: obj.ScheduleVersionNo || 0,
ScheduleStatusCode: obj.ScheduleStatusCode || '',
CalculationMethodCode: obj.CalculationMethodCode || '',
StartDate:  obj.StartDate || new Date(),
EndDate:  obj.EndDate || new Date(),
NumberOfPayments: obj.NumberOfPayments || 0,
CurrencyCode: obj.CurrencyCode || '',
GeneratedOn:  obj.GeneratedOn || new Date(),
GeneratedBy: obj.GeneratedBy || 0,
 
      }
    );
   
	 this.Caption = "LeasePaymentSchedule Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contracts/payment-schedules/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.leasePaymentSchedule = { ...this.objMaster };
	var obj  = this.leasePaymentSchedule;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
ScheduleVersionNo: obj.ScheduleVersionNo || 0,
ScheduleStatusCode: obj.ScheduleStatusCode || '',
CalculationMethodCode: obj.CalculationMethodCode || '',
StartDate:  obj.StartDate || new Date(),
EndDate:  obj.EndDate || new Date(),
NumberOfPayments: obj.NumberOfPayments || 0,
CurrencyCode: obj.CurrencyCode || '',
GeneratedOn:  obj.GeneratedOn || new Date(),
GeneratedBy: obj.GeneratedBy || 0,
 
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
     LeaseContractId:  formValues.LeaseContractId || 0,
ScheduleVersionNo:  formValues.ScheduleVersionNo || 0,
ScheduleStatusCode:  formValues.ScheduleStatusCode || null,
CalculationMethodCode:  formValues.CalculationMethodCode || null,
StartDate:  formValues.StartDate || null,
EndDate:  formValues.EndDate || null,
NumberOfPayments:  formValues.NumberOfPayments || 0,
CurrencyCode:  formValues.CurrencyCode || null,
TotalRentalAmount:  formValues.TotalRentalAmount || 0,
TotalTaxAmount:  formValues.TotalTaxAmount || 0,
GeneratedOn:  formValues.GeneratedOn || null,
GeneratedBy:  formValues.GeneratedBy || 0,

    } as ILeasePaymentSchedule ;
	
	this.spinner.show();  	   
    this.leasePaymentScheduleService.update(this.leasePaymentSchedule.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(LeasePaymentSchedule +  'Details Updated sucessfully.');
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
