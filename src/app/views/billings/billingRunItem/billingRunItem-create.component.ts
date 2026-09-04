import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
recordstatusOptions: ISelectItem[] = [];

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
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create BillingRunItem';
    this.billingrunidOptions.push({Text: 'BillingRunId1', Value: 'BillingRunId1' });
this.billingrunidOptions.push({Text: 'BillingRunId2', Value: 'BillingRunId2' });
this.leasecontractidOptions.push({Text: 'LeaseContractId1', Value: 'LeaseContractId1' });
this.leasecontractidOptions.push({Text: 'LeaseContractId2', Value: 'LeaseContractId2' });
this.leasepaymentschedulelineidOptions.push({Text: 'LeasePaymentScheduleLineId1', Value: 'LeasePaymentScheduleLineId1' });
this.leasepaymentschedulelineidOptions.push({Text: 'LeasePaymentScheduleLineId2', Value: 'LeasePaymentScheduleLineId2' });
this.leasecontractchargeidOptions.push({Text: 'LeaseContractChargeId1', Value: 'LeaseContractChargeId1' });
this.leasecontractchargeidOptions.push({Text: 'LeaseContractChargeId2', Value: 'LeaseContractChargeId2' });
this.sourcetypeOptions.push({Text: 'SCHEDULE', Value: 'SCHEDULE' });
this.sourcetypeOptions.push({Text: 'CHARGE', Value: 'CHARGE' });
this.sourcetypeOptions.push({Text: 'TERMINATION', Value: 'TERMINATION' });
this.sourcetypeOptions.push({Text: 'ADJUSTMENT', Value: 'ADJUSTMENT' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.validationstatusOptions.push({Text: 'PENDING', Value: 'PENDING' });
this.validationstatusOptions.push({Text: 'VALID', Value: 'VALID' });
this.validationstatusOptions.push({Text: 'EXCLUDED', Value: 'EXCLUDED' });
this.validationstatusOptions.push({Text: 'ERROR', Value: 'ERROR' });
this.validationstatusOptions.push({Text: 'INVOICED', Value: 'INVOICED' });
this.customerinvoiceidOptions.push({Text: 'CustomerInvoiceId1', Value: 'CustomerInvoiceId1' });
this.customerinvoiceidOptions.push({Text: 'CustomerInvoiceId2', Value: 'CustomerInvoiceId2' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

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
RecordStatus: obj.RecordStatus || '',
 
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
RecordStatus: formValues.RecordStatus || null,

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



