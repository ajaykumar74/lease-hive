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
import { IGoodsReceipt } from './goodsReceipt';
import { GoodsReceiptService } from './goodsReceipt.service';

@Component({
  selector: 'app-goodsReceipt-create',
  standalone: false,
  templateUrl: './goodsReceipt-create.component.html' ,
   providers: [ MessageService]
})
export class GoodsReceiptCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  goodsReceipt: IGoodsReceipt = null;
  purchaseorderidOptions: ISelectItem[] = [];
supplierpartyidOptions: ISelectItem[] = [];
receivingorganisationunitidOptions: ISelectItem[] = [];
receiptlocationidOptions: ISelectItem[] = [];
goodsreceiptstatusidOptions: ISelectItem[] = [];
receivedbyuseridOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IGoodsReceipt = {} as IGoodsReceipt;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private goodsReceiptService: GoodsReceiptService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.goodsReceipt };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
GRNNo: new FormControl('', [Validators.required, Validators.maxLength(40), ]),
PurchaseOrderId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SupplierPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ReceivingOrganisationUnitId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ReceiptLocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
GoodsReceiptStatusId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ReceiptDateTime: new FormControl(new Date(), [Validators.required]),
SupplierDeliveryNoteNo: new FormControl('', [Validators.maxLength(80), ]), 
ReceivedByUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
Remarks: new FormControl('', [Validators.maxLength(100), ]), 

    });
    this.Caption = 'Create GoodsReceipt';
this.loggedInUserService.bindEntityLookup(this.editForm, 'GoodsReceiptStatusId', 'goods-receipt-statuses',
      options => this.goodsreceiptstatusidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'PurchaseOrderId', 'purchase-orders',
      options => this.purchaseorderidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ReceiptLocationId', 'locations',
      options => this.receiptlocationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ReceivedByUserId', 'application-users',
      options => this.receivedbyuseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ReceivingOrganisationUnitId', 'organisation-units',
      options => this.receivingorganisationunitidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'SupplierPartyId', 'parties',
      options => this.supplierpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.goodsReceiptService.getById(this.selectedId).subscribe({
      next: data => {
        this.goodsReceipt = data;
        this.objMaster = { ...this.goodsReceipt };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IGoodsReceipt): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  GRNNo: obj.GRNNo || '',
PurchaseOrderId: obj.PurchaseOrderId || 0,
SupplierPartyId: obj.SupplierPartyId || 0,
ReceivingOrganisationUnitId: obj.ReceivingOrganisationUnitId || 0,
ReceiptLocationId: obj.ReceiptLocationId || 0,
GoodsReceiptStatusId: obj.GoodsReceiptStatusId || 0,
ReceiptDateTime:  obj.ReceiptDateTime || new Date(),
SupplierDeliveryNoteNo: obj.SupplierDeliveryNoteNo || '',
ReceivedByUserId: obj.ReceivedByUserId || 0,
Remarks: obj.Remarks || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/goods-receipts/create']);
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
    this.goodsReceipt = { ...this.objMaster };
    var obj  = this.goodsReceipt;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  GRNNo: obj.GRNNo || '',
PurchaseOrderId: obj.PurchaseOrderId || 0,
SupplierPartyId: obj.SupplierPartyId || 0,
ReceivingOrganisationUnitId: obj.ReceivingOrganisationUnitId || 0,
ReceiptLocationId: obj.ReceiptLocationId || 0,
GoodsReceiptStatusId: obj.GoodsReceiptStatusId || 0,
ReceiptDateTime:  obj.ReceiptDateTime || new Date(),
SupplierDeliveryNoteNo: obj.SupplierDeliveryNoteNo || '',
ReceivedByUserId: obj.ReceivedByUserId || 0,
Remarks: obj.Remarks || '',
 
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
     GRNNo: formValues.GRNNo || null,
PurchaseOrderId: formValues.PurchaseOrderId || 0,
SupplierPartyId: formValues.SupplierPartyId || 0,
ReceivingOrganisationUnitId: formValues.ReceivingOrganisationUnitId || 0,
ReceiptLocationId: formValues.ReceiptLocationId || 0,
GoodsReceiptStatusId: formValues.GoodsReceiptStatusId || 0,
ReceiptDateTime: formValues.ReceiptDateTime || null,
SupplierDeliveryNoteNo: formValues.SupplierDeliveryNoteNo || null,
ReceivedByUserId: formValues.ReceivedByUserId || 0,
Remarks: formValues.Remarks || null,
RecordStatus: 'Active',
    } as IGoodsReceipt ; 
	
	  this.spinner.show(); 
    this.goodsReceiptService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(GoodsReceipt +  'Details Updated sucessfully.');
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



