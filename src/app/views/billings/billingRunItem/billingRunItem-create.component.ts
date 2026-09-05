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
import { IBillingRunItem } from './billingRunItem';
import { BillingRunItemService } from './billingRunItem.service';

@Component({
  selector: 'app-billingRunItem-create',
  standalone: false,
  templateUrl: './billingRunItem-create.component.html' ,
   providers: [ MessageService]
})
export class BillingRunItemCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  billingRunItem: IBillingRunItem = null;
  billingrunidOptions: ISelectItem[] = [];
leasecontractidOptions: ISelectItem[] = [];
leasepaymentschedulelineidOptions: ISelectItem[] = [];
leasecontractchargeidOptions: ISelectItem[] = [];
sourcetypeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
validationstatusOptions: ISelectItem[] = [];
customerinvoiceidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IBillingRunItem = {} as IBillingRunItem;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private billingRunItemService: BillingRunItemService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.billingRunItem };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
BillingRunId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LeaseContractId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LeasePaymentScheduleLineId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
LeaseContractChargeId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
SourceType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
DueDate: new FormControl(new Date(), [Validators.required]),
Amount: new FormControl(0, [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ValidationStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ExclusionReason: new FormControl('', [Validators.maxLength(100), ]), 
CustomerInvoiceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),

    });
    this.Caption = 'Create BillingRunItem';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'BillingRunId', 'billing-runs',
      options => this.billingrunidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractId', 'lease-contracts',
      options => this.leasecontractidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'LeasePaymentScheduleLineId', 'lease-payment-schedule-lines',
      options => this.leasepaymentschedulelineidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractChargeId', 'lease-contract-charges',
      options => this.leasecontractchargeidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"LeaseContractId":"LeaseContractId"});
this.sourcetypeOptions = this.loggedInUserService.getPicklistOptions('SourceType');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.validationstatusOptions = this.loggedInUserService.getPicklistOptions('ValidationStatus');
this.loggedInUserService.bindEntityLookup(this.editForm, 'CustomerInvoiceId', 'customer-invoices',
      options => this.customerinvoiceidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"LeaseContractId":"LeaseContractId"});

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.billingRunItemService.getById(this.selectedId).subscribe({
      next: data => {
        this.billingRunItem = data;
        this.objMaster = { ...this.billingRunItem };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IBillingRunItem): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  BillingRunId: obj.BillingRunId || 0,
LeaseContractId: obj.LeaseContractId || 0,
LeasePaymentScheduleLineId: obj.LeasePaymentScheduleLineId || 0,
LeaseContractChargeId: obj.LeaseContractChargeId || 0,
SourceType: obj.SourceType || '',
DueDate:  obj.DueDate || new Date(),
Amount: obj.Amount || 0,
CurrencyCode: obj.CurrencyCode || '',
ValidationStatus: obj.ValidationStatus || '',
ExclusionReason: obj.ExclusionReason || '',
CustomerInvoiceId: obj.CustomerInvoiceId || 0,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/billingRunItems/create']);
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
    this.billingRunItem = { ...this.objMaster };
    var obj  = this.billingRunItem;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  BillingRunId: obj.BillingRunId || 0,
LeaseContractId: obj.LeaseContractId || 0,
LeasePaymentScheduleLineId: obj.LeasePaymentScheduleLineId || 0,
LeaseContractChargeId: obj.LeaseContractChargeId || 0,
SourceType: obj.SourceType || '',
DueDate:  obj.DueDate || new Date(),
Amount: obj.Amount || 0,
CurrencyCode: obj.CurrencyCode || '',
ValidationStatus: obj.ValidationStatus || '',
ExclusionReason: obj.ExclusionReason || '',
CustomerInvoiceId: obj.CustomerInvoiceId || 0,
 
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
     BillingRunId: formValues.BillingRunId || 0,
LeaseContractId: formValues.LeaseContractId || 0,
LeasePaymentScheduleLineId: formValues.LeasePaymentScheduleLineId || 0,
LeaseContractChargeId: formValues.LeaseContractChargeId || 0,
SourceType: formValues.SourceType || null,
DueDate: formValues.DueDate || null,
Amount: formValues.Amount || 0,
CurrencyCode: formValues.CurrencyCode || null,
ValidationStatus: formValues.ValidationStatus || null,
ExclusionReason: formValues.ExclusionReason || null,
CustomerInvoiceId: formValues.CustomerInvoiceId || 0,
RecordStatus: 'Active',

    } as IBillingRunItem ; 
	
	  this.spinner.show(); 
    this.billingRunItemService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(BillingRunItem +  'Details Updated sucessfully.');
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



