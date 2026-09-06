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
import { IPurchaseOrder } from './purchaseOrder';
import { PurchaseOrderService } from './purchaseOrder.service';
import { IPurchaseOrderLine } from '../purchaseOrderLine/purchaseOrderLine';

@Component({
  selector: 'app-purchaseOrder-create',
  standalone: false,
  templateUrl: './purchaseOrder-create.component.html' ,
   providers: [ MessageService]
})
export class PurchaseOrderCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
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
linetypecodeOptions: ISelectItem[] = [];
uomidOptions: ISelectItem[] = [];

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
LineItems: this.fb.array([], Validators.required),

    });
    this.Caption = 'Create PurchaseOrder';
this.loggedInUserService.bindEntityLookup(this.editForm, 'ApprovalRequestId', 'approval-requests',
      options => this.approvalrequestidOptions = options, error => this.showLookupError(error),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'BuyingOrganisationId', 'organisations',
      options => this.buyingorganisationidOptions = options, error => this.showLookupError(error),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'DeliveryLocationId', 'locations',
      options => this.deliverylocationidOptions = options, error => this.showLookupError(error),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'PurchaseOrderStatusId', 'purchase-order-statuses',
      options => this.purchaseorderstatusidOptions = options, error => this.showLookupError(error),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'SupplierAwardId', 'supplier-awards',
      options => this.supplierawardidOptions = options, error => this.showLookupError(error),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'SupplierPartyId', 'parties',
      options => this.supplierpartyidOptions = options, error => this.showLookupError(error),
      this.entityLookupDestroyRef);
this.loadLineItemOptions();
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');

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
    this.setLineItems(obj.LineItems || []);
  }

  get lineItems(): FormArray<FormGroup> {
    return this.editForm.get('LineItems') as FormArray<FormGroup>;
  }

  addLineItem(lineItem?: Partial<IPurchaseOrderLine>): void { 
    const line = this.fb.group({
      Id: new FormControl(lineItem?.Id || 0),
      RowVersionStr: new FormControl(lineItem?.RowVersionStr || ''),
      PurchaseOrderId: new FormControl(lineItem?.PurchaseOrderId || 0),
      LineNo: new FormControl(lineItem?.LineNo || this.lineItems.length + 1),
      LineTypeCode: new FormControl(lineItem?.LineTypeCode || '', [Validators.required, Validators.maxLength(20)]),
      Description: new FormControl(lineItem?.Description || '', [Validators.required, Validators.maxLength(100)]),
      OrderedQuantity: new FormControl(lineItem?.OrderedQuantity || 1, [Validators.required, Validators.min(1)]),
      UOMId: new FormControl(lineItem?.UOMId || 1, [ Validators.min(1)]),
      UnitPrice: new FormControl(lineItem?.UnitPrice || 0, [Validators.required, Validators.min(0)]),
      DiscountAmount: new FormControl(lineItem?.DiscountAmount || 0, [Validators.required, Validators.min(0)]),
      TaxAmount: new FormControl(lineItem?.TaxAmount || 0, [Validators.required, Validators.min(0)]),
      LineTotal: new FormControl({ value: lineItem?.LineTotal || 0, disabled: true }),
      RequiredByDate: new FormControl(lineItem?.RequiredByDate ? new Date(lineItem.RequiredByDate) : null),
      PurchaseRequisitionLineId: new FormControl(lineItem?.PurchaseRequisitionLineId || 0),
      SupplierQuotationLineId: new FormControl(lineItem?.SupplierQuotationLineId || 0),
      AssetCategoryId: new FormControl(lineItem?.AssetCategoryId || 0),
      AssetTypeId: new FormControl(lineItem?.AssetTypeId || 0),
      SpecificationsJson: new FormControl(lineItem?.SpecificationsJson || '')
    });
    line.valueChanges.subscribe(() => this.recalculateLineItems());
    this.lineItems.push(line);
    if (!lineItem) {
      this.lineItems.markAsDirty();
      this.editForm.markAsDirty();
    }
    this.recalculateLineItems();
  }

  removeLineItem(index: number): void {
    this.lineItems.removeAt(index);
    this.lineItems.controls.forEach((line, lineIndex) => line.get('LineNo')?.setValue(lineIndex + 1, { emitEvent: false }));
    this.lineItems.markAsDirty();
    this.editForm.markAsDirty();
    this.recalculateLineItems();
  }

  private loadLineItemOptions(): void {
    this.linetypecodeOptions = this.loggedInUserService.getPicklistOptions('LineTypeCode');
    if (!this.linetypecodeOptions.length) {
      this.loggedInUserService.loadPicklistCache().subscribe({
        next: () => this.linetypecodeOptions = this.loggedInUserService.getPicklistOptions('LineTypeCode'),
        error: error => this.showLookupError(error)
      });
    }

    this.loggedInUserService.getEntityLookupOptions('unit-of-measures').subscribe({
      next: options => this.uomidOptions = options,
      error: error => this.showLookupError(error)
    });
  }

  private showLookupError(error: unknown): void {
    const response = error as { error?: { message?: string; Message?: string } | string; message?: string };
    const message = typeof error === 'string'
      ? error
      : typeof response?.error === 'string'
        ? response.error
        : response?.error?.message || response?.error?.Message || response?.message || 'Unable to load purchase-order options.';
    setTimeout(() => this.messageService?.showError(message));
  }

  private setLineItems(lineItems: IPurchaseOrderLine[]): void {
    this.lineItems.clear();
    lineItems.forEach(lineItem => this.addLineItem(lineItem));
    this.recalculateLineItems();
  }

  private recalculateLineItems(): void {
    const lines = this.lineItems.getRawValue();
    lines.forEach((line: any, index: number) => {
      const lineTotal = (Number(line.OrderedQuantity) * Number(line.UnitPrice)) - Number(line.DiscountAmount) + Number(line.TaxAmount);
      this.lineItems.at(index).get('LineTotal')?.setValue(lineTotal, { emitEvent: false });
    });
    const totals = this.lineItems.getRawValue().reduce((result: any, line: any) => {
      result.subtotal += (Number(line.OrderedQuantity) * Number(line.UnitPrice)) - Number(line.DiscountAmount);
      result.tax += Number(line.TaxAmount);
      return result;
    }, { subtotal: 0, tax: 0 });
    const charges = Number(this.editForm.get('ChargeAmount')?.value || 0);
    this.editForm.patchValue({ Subtotal: totals.subtotal, TaxAmount: totals.tax, TotalAmount: totals.subtotal + totals.tax + charges }, { emitEvent: false });
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
    this.setLineItems(this.objMaster.LineItems || []);
  } 

  Save(): void {    
   
        if (!this.editForm.valid || this.lineItems.length === 0) {
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
LineItems: this.lineItems.getRawValue().map((line: any) => ({ ...line, PurchaseOrderId: 0 })),
    } as IPurchaseOrder ; 
	
	  this.spinner.show(); 
    this.purchaseOrderService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(PurchaseOrder +  'Details Updated sucessfully.');
		 this._location.back();     
      },
      error: err => { 
       this.messageService.showError(this.getErrorMessage(err));
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide(); }
    });
  } 

  private getErrorMessage(error: unknown): string {
    const response = error as { error?: { message?: string; Message?: string } | string; message?: string };
    return typeof error === 'string'
      ? error
      : typeof response?.error === 'string'
        ? response.error
        : response?.error?.message || response?.error?.Message || response?.message || 'Unable to save the purchase order.';
  }

}



