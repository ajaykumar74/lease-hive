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
import { IPurchaseOrder } from './purchaseOrder';
import { PurchaseOrderService } from './purchaseOrder.service';

@Component({
  selector: 'app-purchaseOrder-create',
  standalone: false,
  templateUrl: './purchaseOrder-create.component.html' ,
   providers: [ MessageService]
})
export class PurchaseOrderCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  purchaseOrder: IPurchaseOrder = null;
  buyingorganisationidOptions: ISelectItem[] = [];
supplierpartyidOptions: ISelectItem[] = [];
supplierawardidOptions: ISelectItem[] = [];
purchaseorderstatusidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
deliverylocationidOptions: ISelectItem[] = [];
approvalrequestidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IPurchaseOrder = {} as IPurchaseOrder;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private purchaseOrderService: PurchaseOrderService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.purchaseOrder };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
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

    });
    this.Caption = 'Create PurchaseOrder';
    this.buyingorganisationidOptions.push({Text: 'BuyingOrganisationId1', Value: 'BuyingOrganisationId1' });
this.buyingorganisationidOptions.push({Text: 'BuyingOrganisationId2', Value: 'BuyingOrganisationId2' });
this.supplierpartyidOptions.push({Text: 'SupplierPartyId1', Value: 'SupplierPartyId1' });
this.supplierpartyidOptions.push({Text: 'SupplierPartyId2', Value: 'SupplierPartyId2' });
this.supplierawardidOptions.push({Text: 'SupplierAwardId1', Value: 'SupplierAwardId1' });
this.supplierawardidOptions.push({Text: 'SupplierAwardId2', Value: 'SupplierAwardId2' });
this.purchaseorderstatusidOptions.push({Text: 'PurchaseOrderStatusId1', Value: 'PurchaseOrderStatusId1' });
this.purchaseorderstatusidOptions.push({Text: 'PurchaseOrderStatusId2', Value: 'PurchaseOrderStatusId2' });
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.deliverylocationidOptions.push({Text: 'DeliveryLocationId1', Value: 'DeliveryLocationId1' });
this.deliverylocationidOptions.push({Text: 'DeliveryLocationId2', Value: 'DeliveryLocationId2' });
this.approvalrequestidOptions.push({Text: 'ApprovalRequestId1', Value: 'ApprovalRequestId1' });
this.approvalrequestidOptions.push({Text: 'ApprovalRequestId2', Value: 'ApprovalRequestId2' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.purchaseOrderService.getById(this.selectedId).subscribe({
      next: data => {
        this.purchaseOrder = data;
        this.objMaster = { ...this.purchaseOrder };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
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
 
      }
    );
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
    else if (key == "Refresh") {
      this.loadUI();
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
     PONo: formValues.PONo || null,
VersionNo: formValues.VersionNo || 0,
BuyingOrganisationId: formValues.BuyingOrganisationId || 0,
SupplierPartyId: formValues.SupplierPartyId || 0,
SupplierAwardId: formValues.SupplierAwardId || 0,
PurchaseOrderStatusId: formValues.PurchaseOrderStatusId || 0,
PODate: formValues.PODate || null,
CurrencyCode: formValues.CurrencyCode || null,
Subtotal: formValues.Subtotal || 0,
TaxAmount: formValues.TaxAmount || 0,
ChargeAmount: formValues.ChargeAmount || 0,
TotalAmount: formValues.TotalAmount || 0,
PaymentTermCode: formValues.PaymentTermCode || null,
DeliveryLocationId: formValues.DeliveryLocationId || 0,
SupplierNameSnapshot: formValues.SupplierNameSnapshot || null,
SupplierTaxSnapshot: formValues.SupplierTaxSnapshot || null,
ApprovalRequestId: formValues.ApprovalRequestId || 0,
IssuedOn: formValues.IssuedOn || null,
RecordStatus: 'Active',
    } as IPurchaseOrder ; 
	
	  this.spinner.show(); 
    this.purchaseOrderService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(PurchaseOrder +  'Details Updated sucessfully.');
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



