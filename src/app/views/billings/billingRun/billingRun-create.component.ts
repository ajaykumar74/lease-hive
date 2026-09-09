import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IBillingRun } from './billingRun';
import { BillingRunService } from './billingRun.service';
import { IBillingRunItem } from '../billingRunItem/billingRunItem';

@Component({
  selector: 'app-billingRun-create',
  standalone: false,
  templateUrl: './billingRun-create.component.html' ,
   providers: [ MessageService]
})
export class BillingRunCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  billingRun: IBillingRun = null;
  billingorganisationidOptions: ISelectItem[] = [];
billingrunstatusidOptions: ISelectItem[] = [];
runtypeOptions: ISelectItem[] = [];
approvedbyuseridOptions: ISelectItem[] = [];
leasecontractidOptions: ISelectItem[] = [];
leasepaymentschedulelineidOptions: ISelectItem[] = [];
leasecontractchargeidOptions: ISelectItem[] = [];
customerinvoiceidOptions: ISelectItem[] = [];
sourcetypeOptions: ISelectItem[] = [];
validationstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IBillingRun = {} as IBillingRun;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private billingRunService: BillingRunService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.billingRun };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
BillingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
BillingDate: new FormControl(new Date(), [Validators.required]),
PeriodFrom: new FormControl(new Date(), []),
PeriodTo: new FormControl(new Date(), []),
BillingRunStatusId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RunType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CandidateCount: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
InvoiceCount: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
TotalAmount: new FormControl(0, [Validators.required]),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
ApprovedByUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ApprovedAtUtc: new FormControl(new Date(), []),
BillingRunItems: this.fb.array([]),

    });
    this.Caption = 'Create BillingRun';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'BillingOrganisationId', 'organisations',
      options => this.billingorganisationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'BillingRunStatusId', 'billing-run-statuses',
      options => this.billingrunstatusidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.runtypeOptions = this.loggedInUserService.getPicklistOptions('RunType');
this.loggedInUserService.bindEntityLookup(this.editForm, 'ApprovedByUserId', 'application-users',
      options => this.approvedbyuseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loadBillingRunItemOptions();

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.billingRunService.getById(this.selectedId).subscribe({
      next: data => {
        this.billingRun = data;
        this.objMaster = { ...this.billingRun };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IBillingRun): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  BillingOrganisationId: obj.BillingOrganisationId || 0,
BillingDate:  obj.BillingDate || new Date(),
PeriodFrom:  obj.PeriodFrom || new Date(),
PeriodTo:  obj.PeriodTo || new Date(),
BillingRunStatusId: obj.BillingRunStatusId || 0,
RunType: obj.RunType || '',
CandidateCount: obj.CandidateCount || 0,
InvoiceCount: obj.InvoiceCount || 0,
TotalAmount: obj.TotalAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
ApprovedByUserId: obj.ApprovedByUserId || 0,
ApprovedAtUtc:  obj.ApprovedAtUtc || new Date(),
 
      }
    );
    this.setBillingRunItems(obj.BillingRunItems || []);
  }

  get billingRunItems(): FormArray<FormGroup> { return this.editForm.get('BillingRunItems') as FormArray<FormGroup>; }

  addBillingRunItem(item?: Partial<IBillingRunItem>): void {
    const line = this.fb.group({
      Id: new FormControl(item?.Id || 0),
      RowVersionStr: new FormControl(item?.RowVersionStr || ''),
      LeaseContractId: new FormControl(item?.LeaseContractId || 0, [Validators.required, Validators.min(1)]),
      LeasePaymentScheduleLineId: new FormControl(item?.LeasePaymentScheduleLineId || 0, [Validators.min(0)]),
      LeaseContractChargeId: new FormControl(item?.LeaseContractChargeId || 0, [Validators.min(0)]),
      SourceType: new FormControl(item?.SourceType || '', [Validators.required, Validators.maxLength(20)]),
      DueDate: new FormControl(item?.DueDate || new Date(), [Validators.required]),
      Amount: new FormControl(item?.Amount || 0, [Validators.required, Validators.min(0)]),
      CurrencyCode: new FormControl(item?.CurrencyCode || '', [Validators.required, Validators.maxLength(20)]),
      ValidationStatus: new FormControl(item?.ValidationStatus || '', [Validators.required, Validators.maxLength(20)]),
      ExclusionReason: new FormControl(item?.ExclusionReason || '', [Validators.maxLength(100)]),
      CustomerInvoiceId: new FormControl(item?.CustomerInvoiceId || 0, [Validators.min(0)]),
      RecordStatus: new FormControl(item?.RecordStatus || 'Active', [Validators.required, Validators.maxLength(20)])
    });
    line.valueChanges.subscribe(() => this.recalculateBillingRunItems());
    this.billingRunItems.push(line);
    this.recalculateBillingRunItems();
  }

  removeBillingRunItem(index: number): void {
    this.billingRunItems.removeAt(index);
    this.recalculateBillingRunItems();
  }

  private setBillingRunItems(items: IBillingRunItem[]): void {
    this.billingRunItems.clear();
    items.forEach(item => this.addBillingRunItem(item));
    this.recalculateBillingRunItems();
  }

  private recalculateBillingRunItems(): void {
    const items = this.billingRunItems.getRawValue() as IBillingRunItem[];
    this.editForm.patchValue({
      CandidateCount: items.length,
      InvoiceCount: items.filter((item: IBillingRunItem) => Number(item.CustomerInvoiceId) > 0).length,
      TotalAmount: items.reduce((total: number, item: IBillingRunItem) => total + Number(item.Amount || 0), 0)
    }, { emitEvent: false });
  }

  private loadBillingRunItemOptions(): void {
    const load = (lookupType: string, assign: (options: ISelectItem[]) => void) =>
      this.loggedInUserService.getEntityLookupOptions(lookupType).subscribe({ next: assign, error: error => setTimeout(() => this.messageService?.showError(error)) });
    load('lease-contracts', options => this.leasecontractidOptions = options);
    load('lease-payment-schedule-lines', options => this.leasepaymentschedulelineidOptions = options);
    load('lease-contract-charges', options => this.leasecontractchargeidOptions = options);
    load('customer-invoices', options => this.customerinvoiceidOptions = options);
    this.sourcetypeOptions = this.loggedInUserService.getPicklistOptions('SourceType');
    this.validationstatusOptions = this.loggedInUserService.getPicklistOptions('ValidationStatus');
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/billingRuns/create']);
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
    this.billingRun = { ...this.objMaster };
    var obj  = this.billingRun;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  BillingOrganisationId: obj.BillingOrganisationId || 0,
BillingDate:  obj.BillingDate || new Date(),
PeriodFrom:  obj.PeriodFrom || new Date(),
PeriodTo:  obj.PeriodTo || new Date(),
BillingRunStatusId: obj.BillingRunStatusId || 0,
RunType: obj.RunType || '',
CandidateCount: obj.CandidateCount || 0,
InvoiceCount: obj.InvoiceCount || 0,
TotalAmount: obj.TotalAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
ApprovedByUserId: obj.ApprovedByUserId || 0,
ApprovedAtUtc:  obj.ApprovedAtUtc || new Date(),
 
      }
    );
    this.setBillingRunItems(this.objMaster.BillingRunItems || []);
  } 

  Save(): void {    
   
        if (!this.editForm.valid || this.billingRunItems.length === 0) {
            this.messageService.showError('One or more validation failed. Please clear error to continue...');
            return;
        }	
  
  
	const formValues  = this.editForm.value ;
	var createdObj = { 
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     BillingOrganisationId: formValues.BillingOrganisationId || 0,
BillingDate: formValues.BillingDate || null,
PeriodFrom: formValues.PeriodFrom || null,
PeriodTo: formValues.PeriodTo || null,
BillingRunStatusId: formValues.BillingRunStatusId || 0,
RunType: formValues.RunType || null,
CandidateCount: formValues.CandidateCount || 0,
InvoiceCount: formValues.InvoiceCount || 0,
TotalAmount: formValues.TotalAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
ApprovedByUserId: formValues.ApprovedByUserId || 0,
ApprovedAtUtc: formValues.ApprovedAtUtc || null,
BillingRunItems: this.billingRunItems.getRawValue().map((item: any) => ({ ...item, BillingRunId: 0, TenantId: this.loggedInUserService.loggedInUser.Tenant.Id })),
RecordStatus: 'Active',

    } as IBillingRun ; 
	
	  this.spinner.show(); 
    this.billingRunService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(BillingRun +  'Details Updated sucessfully.');
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
