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
import { IBillingRunItem } from './billingRunItem';
import { BillingRunItemService } from './billingRunItem.service';


@Component({
  selector: 'app-billingRunItem-edit',
  standalone: false,
  templateUrl: './billingRunItem-edit.component.html',
  providers: [ MessageService]
})
export class BillingRunItemEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  billingRunItem: IBillingRunItem = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
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


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private billingRunItemService: BillingRunItemService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.billingRunItem };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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
    this.billingRunItemService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.billingRunItem = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.billingRunItem };
        this.populateUI(this.billingRunItem);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "BillingRunItem Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/billing-finance/billing/candidates/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     BillingRunId:  formValues.BillingRunId || 0,
LeaseContractId:  formValues.LeaseContractId || 0,
LeasePaymentScheduleLineId:  formValues.LeasePaymentScheduleLineId || 0,
LeaseContractChargeId:  formValues.LeaseContractChargeId || 0,
SourceType:  formValues.SourceType || null,
DueDate:  formValues.DueDate || null,
Amount:  formValues.Amount || 0,
CurrencyCode:  formValues.CurrencyCode || null,
ValidationStatus:  formValues.ValidationStatus || null,
ExclusionReason:  formValues.ExclusionReason || null,
CustomerInvoiceId:  formValues.CustomerInvoiceId || 0,
RecordStatus:  formValues.RecordStatus || null,

    } as IBillingRunItem ;
	
	this.spinner.show();  	   
    this.billingRunItemService.update(this.billingRunItem.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(BillingRunItem +  'Details Updated sucessfully.');
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
