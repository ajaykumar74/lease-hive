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
import { ICustomerInvoiceLine } from './customerInvoiceLine';
import { CustomerInvoiceLineService } from './customerInvoiceLine.service';


@Component({
  selector: 'app-customerInvoiceLine-edit',
  standalone: false,
  templateUrl: './customerInvoiceLine-edit.component.html',
  providers: [ MessageService]
})
export class CustomerInvoiceLineEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  customerInvoiceLine: ICustomerInvoiceLine = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  customerinvoiceidOptions: ISelectItem[] = [];
leasecontractidOptions: ISelectItem[] = [];
leasepaymentschedulelineidOptions: ISelectItem[] = [];
leasecontractchargeidOptions: ISelectItem[] = [];
leasecontractassetidOptions: ISelectItem[] = [];
chargetypecodeOptions: ISelectItem[] = [];
uomidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ICustomerInvoiceLine = {} as ICustomerInvoiceLine;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private customerInvoiceLineService: CustomerInvoiceLineService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.customerInvoiceLine };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
CustomerInvoiceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LineNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
LeaseContractId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
LeasePaymentScheduleLineId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
LeaseContractChargeId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
LeaseContractAssetId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ChargeTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Description: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
ServicePeriodFrom: new FormControl(new Date(), []),
ServicePeriodTo: new FormControl(new Date(), []),
UOMId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
UnitPrice: new FormControl(0, [Validators.required]),
TaxableAmount: new FormControl(0, [Validators.required]),
TaxAmount: new FormControl(0, [Validators.required]),
LineGrossAmount: new FormControl(0, [Validators.required]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'CustomerInvoiceId', 'customer-invoices',
      options => this.customerinvoiceidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"LeaseContractId":"LeaseContractId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractId', 'lease-contracts',
      options => this.leasecontractidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'LeasePaymentScheduleLineId', 'lease-payment-schedule-lines',
      options => this.leasepaymentschedulelineidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractChargeId', 'lease-contract-charges',
      options => this.leasecontractchargeidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"LeaseContractId":"LeaseContractId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractAssetId', 'lease-contract-assets',
      options => this.leasecontractassetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"LeaseContractId":"LeaseContractId"});
this.chargetypecodeOptions = this.loggedInUserService.getPicklistOptions('CustomerInvoiceLineChargeTypeCode');
this.uomidOptions.push({Text: 'UOMId1', Value: 'UOMId1' });
this.uomidOptions.push({Text: 'UOMId2', Value: 'UOMId2' });
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
    this.customerInvoiceLineService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.customerInvoiceLine = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.customerInvoiceLine };
        this.populateUI(this.customerInvoiceLine);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ICustomerInvoiceLine): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CustomerInvoiceId: obj.CustomerInvoiceId || 0,
LineNo: obj.LineNo || 0,
LeaseContractId: obj.LeaseContractId || 0,
LeasePaymentScheduleLineId: obj.LeasePaymentScheduleLineId || 0,
LeaseContractChargeId: obj.LeaseContractChargeId || 0,
LeaseContractAssetId: obj.LeaseContractAssetId || 0,
ChargeTypeCode: obj.ChargeTypeCode || '',
Description: obj.Description || '',
ServicePeriodFrom:  obj.ServicePeriodFrom || new Date(),
ServicePeriodTo:  obj.ServicePeriodTo || new Date(),
UOMId: obj.UOMId || 0,
UnitPrice: obj.UnitPrice || 0,
TaxableAmount: obj.TaxableAmount || 0,
TaxAmount: obj.TaxAmount || 0,
LineGrossAmount: obj.LineGrossAmount || 0,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "CustomerInvoiceLine Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/billing-finance/invoices/lines/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.customerInvoiceLine = { ...this.objMaster };
	var obj  = this.customerInvoiceLine;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CustomerInvoiceId: obj.CustomerInvoiceId || 0,
LineNo: obj.LineNo || 0,
LeaseContractId: obj.LeaseContractId || 0,
LeasePaymentScheduleLineId: obj.LeasePaymentScheduleLineId || 0,
LeaseContractChargeId: obj.LeaseContractChargeId || 0,
LeaseContractAssetId: obj.LeaseContractAssetId || 0,
ChargeTypeCode: obj.ChargeTypeCode || '',
Description: obj.Description || '',
ServicePeriodFrom:  obj.ServicePeriodFrom || new Date(),
ServicePeriodTo:  obj.ServicePeriodTo || new Date(),
UOMId: obj.UOMId || 0,
UnitPrice: obj.UnitPrice || 0,
TaxableAmount: obj.TaxableAmount || 0,
TaxAmount: obj.TaxAmount || 0,
LineGrossAmount: obj.LineGrossAmount || 0,
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
     CustomerInvoiceId:  formValues.CustomerInvoiceId || null,
LineNo:  formValues.LineNo || null,
LeaseContractId:  formValues.LeaseContractId || null,
LeasePaymentScheduleLineId:  formValues.LeasePaymentScheduleLineId || null,
LeaseContractChargeId:  formValues.LeaseContractChargeId || null,
LeaseContractAssetId:  formValues.LeaseContractAssetId || null,
ChargeTypeCode:  formValues.ChargeTypeCode || null,
Description:  formValues.Description || null,
ServicePeriodFrom:  formValues.ServicePeriodFrom || null,
ServicePeriodTo:  formValues.ServicePeriodTo || null,
Quantity:  formValues.Quantity || null,
UOMId:  formValues.UOMId || null,
UnitPrice:  formValues.UnitPrice || null,
DiscountAmount:  formValues.DiscountAmount || null,
TaxableAmount:  formValues.TaxableAmount || null,
TaxAmount:  formValues.TaxAmount || null,
LineGrossAmount:  formValues.LineGrossAmount || null,
RecordStatus:  formValues.RecordStatus || null,

    } as ICustomerInvoiceLine ;
	
	this.spinner.show();  	   
    this.customerInvoiceLineService.update(this.customerInvoiceLine.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(CustomerInvoiceLine +  'Details Updated sucessfully.');
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
