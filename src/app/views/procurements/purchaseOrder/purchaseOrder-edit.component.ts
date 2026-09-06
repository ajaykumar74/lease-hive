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
import { IPurchaseOrder } from './purchaseOrder';
import { PurchaseOrderService } from './purchaseOrder.service';


@Component({
  selector: 'app-purchaseOrder-edit',
  standalone: false,
  templateUrl: './purchaseOrder-edit.component.html',
  providers: [ MessageService]
})
export class PurchaseOrderEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  purchaseOrder: IPurchaseOrder = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  buyingorganisationidOptions: ISelectItem[] = [];
supplierpartyidOptions: ISelectItem[] = [];
supplierawardidOptions: ISelectItem[] = [];
purchaseorderstatusidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
deliverylocationidOptions: ISelectItem[] = [];
approvalrequestidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IPurchaseOrder = {} as IPurchaseOrder;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private purchaseOrderService: PurchaseOrderService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.purchaseOrder };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
PONo: new FormControl('', [Validators.required, Validators.maxLength(40), ]),
VersionNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
BuyingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SupplierPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SupplierAwardId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
PurchaseOrderStatusId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PODate: new FormControl(new Date(), [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Subtotal: new FormControl(0, [Validators.required]),
TaxAmount: new FormControl(0, [Validators.required]),
ChargeAmount: new FormControl(0, [Validators.required]),
TotalAmount: new FormControl(0, [Validators.required]),
PaymentTermCode: new FormControl('', [Validators.maxLength(20), ]), 
DeliveryLocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
SupplierNameSnapshot: new FormControl('', [Validators.required, Validators.maxLength(200), ]),
SupplierTaxSnapshot: new FormControl('', [Validators.maxLength(100), ]), 
ApprovalRequestId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
IssuedOn: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
this.loggedInUserService.bindEntityLookup(this.editForm, 'ApprovalRequestId', 'approval-requests',
      options => this.approvalrequestidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'BuyingOrganisationId', 'organisations',
      options => this.buyingorganisationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'DeliveryLocationId', 'locations',
      options => this.deliverylocationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'PurchaseOrderStatusId', 'purchase-order-statuses',
      options => this.purchaseorderstatusidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'SupplierAwardId', 'supplier-awards',
      options => this.supplierawardidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'SupplierPartyId', 'parties',
      options => this.supplierpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
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
    this.purchaseOrderService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.purchaseOrder = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.purchaseOrder };
        this.populateUI(this.purchaseOrder);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IPurchaseOrder): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PONo: obj.PONo || '',
VersionNo: obj.VersionNo || 0,
BuyingOrganisationId: obj.BuyingOrganisationId || 0,
SupplierPartyId: obj.SupplierPartyId || 0,
SupplierAwardId: obj.SupplierAwardId || 0,
PurchaseOrderStatusId: obj.PurchaseOrderStatusId || 0,
PODate:  obj.PODate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
Subtotal: obj.Subtotal || 0,
TaxAmount: obj.TaxAmount || 0,
ChargeAmount: obj.ChargeAmount || 0,
TotalAmount: obj.TotalAmount || 0,
PaymentTermCode: obj.PaymentTermCode || '',
DeliveryLocationId: obj.DeliveryLocationId || 0,
SupplierNameSnapshot: obj.SupplierNameSnapshot || '',
SupplierTaxSnapshot: obj.SupplierTaxSnapshot || '',
ApprovalRequestId: obj.ApprovalRequestId || 0,
IssuedOn:  obj.IssuedOn || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "PurchaseOrder Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/purchase-orders/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.purchaseOrder = { ...this.objMaster };
	var obj  = this.purchaseOrder;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PONo: obj.PONo || '',
VersionNo: obj.VersionNo || 0,
BuyingOrganisationId: obj.BuyingOrganisationId || 0,
SupplierPartyId: obj.SupplierPartyId || 0,
SupplierAwardId: obj.SupplierAwardId || 0,
PurchaseOrderStatusId: obj.PurchaseOrderStatusId || 0,
PODate:  obj.PODate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
Subtotal: obj.Subtotal || 0,
TaxAmount: obj.TaxAmount || 0,
ChargeAmount: obj.ChargeAmount || 0,
TotalAmount: obj.TotalAmount || 0,
PaymentTermCode: obj.PaymentTermCode || '',
DeliveryLocationId: obj.DeliveryLocationId || 0,
SupplierNameSnapshot: obj.SupplierNameSnapshot || '',
SupplierTaxSnapshot: obj.SupplierTaxSnapshot || '',
ApprovalRequestId: obj.ApprovalRequestId || 0,
IssuedOn:  obj.IssuedOn || new Date(),
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
     PONo:  formValues.PONo || null,
VersionNo:  formValues.VersionNo || 0,
BuyingOrganisationId:  formValues.BuyingOrganisationId || 0,
SupplierPartyId:  formValues.SupplierPartyId || 0,
SupplierAwardId:  formValues.SupplierAwardId || 0,
PurchaseOrderStatusId:  formValues.PurchaseOrderStatusId || 0,
PODate:  formValues.PODate || null,
CurrencyCode:  formValues.CurrencyCode || null,
Subtotal:  formValues.Subtotal || 0,
TaxAmount:  formValues.TaxAmount || 0,
ChargeAmount:  formValues.ChargeAmount || 0,
TotalAmount:  formValues.TotalAmount || 0,
PaymentTermCode:  formValues.PaymentTermCode || null,
DeliveryLocationId:  formValues.DeliveryLocationId || 0,
SupplierNameSnapshot:  formValues.SupplierNameSnapshot || null,
SupplierTaxSnapshot:  formValues.SupplierTaxSnapshot || null,
ApprovalRequestId:  formValues.ApprovalRequestId || 0,
IssuedOn:  formValues.IssuedOn || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IPurchaseOrder ;
	
	this.spinner.show();  	   
    this.purchaseOrderService.update(this.purchaseOrder.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(PurchaseOrder +  'Details Updated sucessfully.');
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
