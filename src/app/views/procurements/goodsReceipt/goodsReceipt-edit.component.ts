import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';  


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IGoodsReceipt } from './goodsReceipt';
import { GoodsReceiptService } from './goodsReceipt.service';
import { IGoodsReceiptLine } from '../goodsReceiptLine/goodsReceiptLine';
import { IPurchaseOrderLine } from '../purchaseOrderLine/purchaseOrderLine';


@Component({
  selector: 'app-goodsReceipt-edit',
  standalone: false,
  templateUrl: './goodsReceipt-edit.component.html',
  providers: [ MessageService]
})
export class GoodsReceiptEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  goodsReceipt: IGoodsReceipt = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  purchaseorderidOptions: ISelectItem[] = [];
supplierpartyidOptions: ISelectItem[] = [];
receivingorganisationunitidOptions: ISelectItem[] = [];
receiptlocationidOptions: ISelectItem[] = [];
goodsreceiptstatusidOptions: ISelectItem[] = [];
receivedbyuseridOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];
inspectionstatuscodeOptions: ISelectItem[] = [];
uomidOptions: ISelectItem[] = [];
purchaseOrderLines: IPurchaseOrderLine[] = [];
selectedLineIndexes: number[] = [];

   editForm: any; 
  objMaster : IGoodsReceipt = {} as IGoodsReceipt;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private goodsReceiptService: GoodsReceiptService, 
	private loggedInUserService : LoggedInUserService
	) {
  }

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;



  ngOnInit(): void {
   this.objMaster = { ...this.goodsReceipt };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
GRNNo: new FormControl('', [Validators.required, Validators.maxLength(40), ]),
PurchaseOrderId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
SupplierPartyId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
ReceivingOrganisationUnitId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ReceiptLocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
GoodsReceiptStatusId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
ReceiptDateTime: new FormControl(new Date(), [Validators.required]),
SupplierDeliveryNoteNo: new FormControl('', [Validators.maxLength(80), ]), 
ReceivedByUserId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
Remarks: new FormControl('', [Validators.maxLength(100), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
LineItems: this.fb.array([], Validators.required),

    });
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
this.loggedInUserService.bindEntityLookup(this.editForm, 'SupplierPartyId', 'supplier-parties',
      options => this.supplierpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');
    this.loadLineItemOptions();

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.goodsReceiptService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.goodsReceipt = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.goodsReceipt };
        this.populateUI(this.goodsReceipt);
        this.loadPurchaseOrderLines();
      },
      error: err => { this.messageService.showSuccess(err); },
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
ReceiptDateTime:  obj.ReceiptDateTime || null,
SupplierDeliveryNoteNo: obj.SupplierDeliveryNoteNo || '',
ReceivedByUserId: obj.ReceivedByUserId || 0,
Remarks: obj.Remarks || '',
RecordStatus: obj.RecordStatus || '',

      }
    );

	 this.Caption = "GoodsReceipt Details #" + obj.Id;
    this.editForm.get('PurchaseOrderId')?.disable({ emitEvent: false });
  } 

  get lineItems(): FormArray<FormGroup> {
    return this.editForm.get('LineItems') as FormArray<FormGroup>;
  }

  get availablePurchaseOrderLines(): IPurchaseOrderLine[] {
    const includedLineIds = new Set(this.lineItems.getRawValue().map((line: any) => Number(line.PurchaseOrderLineId)));
    return this.purchaseOrderLines.filter(line => !includedLineIds.has(Number(line.Id)));
  }

  private loadPurchaseOrderLines(): void {
    if (!this.goodsReceipt?.Id) return;
    this.goodsReceiptService.getPurchaseOrderLines(this.goodsReceipt.Id).subscribe({
      next: response => {
        this.purchaseOrderLines = response?.data || [];
        const savedLineItems = this.goodsReceipt?.LineItems || [];
        this.setLineItems(savedLineItems.length
          ? savedLineItems
          : this.purchaseOrderLines.map(line => this.createReceiptLineFromPurchaseOrderLine(line)));
        // PO lines are a prefilled draft until the user saves the GR aggregate.
        if (!savedLineItems.length && this.lineItems.length) {
          this.lineItems.markAsDirty();
          this.editForm.markAsDirty();
        }
      },
      error: error => this.messageService.showError(this.getErrorMessage(error))
    });
  }

  addNextPurchaseOrderLine(): void {
    const purchaseOrderLine = this.availablePurchaseOrderLines[0];
    if (!purchaseOrderLine) {
      this.messageService.showError('All purchase-order lines have already been added to this goods receipt.');
      return;
    }

    this.addLineItem(this.createReceiptLineFromPurchaseOrderLine(purchaseOrderLine), true);
  }

  removeSelectedLineItems(): void {
    if (!this.selectedLineIndexes.length) return;
    [...this.selectedLineIndexes]
      .sort((left, right) => right - left)
      .forEach(index => this.lineItems.removeAt(index));
    this.selectedLineIndexes = [];
    this.renumberLineItems();
    this.lineItems.markAsDirty();
    this.editForm.markAsDirty();
  }

  removeLineItem(index: number): void {
    this.lineItems.removeAt(index);
    this.selectedLineIndexes = this.selectedLineIndexes
      .filter(selectedIndex => selectedIndex !== index)
      .map(selectedIndex => selectedIndex > index ? selectedIndex - 1 : selectedIndex);
    this.renumberLineItems();
    this.lineItems.markAsDirty();
    this.editForm.markAsDirty();
  }

  isLineSelected(index: number): boolean {
    return this.selectedLineIndexes.includes(index);
  }

  setLineSelected(index: number, selected?: boolean): void {
    this.selectedLineIndexes = selected === true
      ? [...new Set([...this.selectedLineIndexes, index])]
      : this.selectedLineIndexes.filter(selectedIndex => selectedIndex !== index);
  }

  getPurchaseOrderLineDescription(purchaseOrderLineId: number): string {
    const purchaseOrderLine = this.purchaseOrderLines.find(line => Number(line.Id) === Number(purchaseOrderLineId));
    return purchaseOrderLine?.Description || `PO line #${purchaseOrderLineId}`;
  }

  getOrderedQuantity(purchaseOrderLineId: number): number {
    return Number(this.purchaseOrderLines.find(line => Number(line.Id) === Number(purchaseOrderLineId))?.OrderedQuantity || 0);
  }

  getUomLabel(uomId: number): string {
    return this.uomidOptions.find(option => Number(option.Value) === Number(uomId))?.Text || '—';
  }

  private createReceiptLineFromPurchaseOrderLine(purchaseOrderLine: IPurchaseOrderLine): Partial<IGoodsReceiptLine> {
    return {
      GoodsReceiptId: this.selectedId,
      PurchaseOrderLineId: purchaseOrderLine.Id,
      LineNo: this.lineItems.length + 1,
      ReceivedQuantity: Number(purchaseOrderLine.OrderedQuantity || 0),
      AcceptedQuantity: Number(purchaseOrderLine.OrderedQuantity || 0),
      RejectedQuantity: 0,
      UOMId: purchaseOrderLine.UOMId,
      InspectionRequired: false,
      InspectionStatusCode: 'PENDING',
      RejectionReason: ''
    };
  }

  private addLineItem(lineItem: Partial<IGoodsReceiptLine>, markDirty = false): void {
    this.lineItems.push(this.fb.group({
      Id: new FormControl(lineItem.Id || 0),
      RowVersionStr: new FormControl(lineItem.RowVersionStr || ''),
      GoodsReceiptLineId: new FormControl(lineItem.GoodsReceiptLineId || ''),
      GoodsReceiptId: new FormControl(lineItem.GoodsReceiptId || this.selectedId),
      PurchaseOrderLineId: new FormControl(lineItem.PurchaseOrderLineId || 0, [Validators.required, Validators.min(1)]),
      LineNo: new FormControl(lineItem.LineNo || this.lineItems.length + 1),
      ReceivedQuantity: new FormControl(lineItem.ReceivedQuantity ?? 0, [Validators.required, Validators.min(0)]),
      AcceptedQuantity: new FormControl(lineItem.AcceptedQuantity ?? 0, [Validators.required, Validators.min(0)]),
      RejectedQuantity: new FormControl(lineItem.RejectedQuantity ?? 0, [Validators.required, Validators.min(0)]),
      UOMId: new FormControl(lineItem.UOMId || 0, [Validators.required, Validators.min(1)]),
      InspectionRequired: new FormControl(lineItem.InspectionRequired || false),
      InspectionStatusCode: new FormControl(lineItem.InspectionStatusCode || 'PENDING', [Validators.maxLength(20)]),
      RejectionReason: new FormControl(lineItem.RejectionReason || '', [Validators.maxLength(100)])
    }));
    if (markDirty) {
      this.lineItems.markAsDirty();
      this.editForm.markAsDirty();
    }
  }

  private setLineItems(lineItems: IGoodsReceiptLine[] | Partial<IGoodsReceiptLine>[]): void {
    this.lineItems.clear();
    this.selectedLineIndexes = [];
    lineItems.forEach(lineItem => this.addLineItem(lineItem));
    this.renumberLineItems();
  }

  private renumberLineItems(): void {
    this.lineItems.controls.forEach((line, index) => line.get('LineNo')?.setValue(index + 1, { emitEvent: false }));
  }

  private loadLineItemOptions(): void {
    this.inspectionstatuscodeOptions = this.loggedInUserService.getPicklistOptions('GoodsReceiptLineInspectionStatusCode');
    if (!this.inspectionstatuscodeOptions.length) {
      this.loggedInUserService.loadPicklistCache().subscribe({
        next: () => this.inspectionstatuscodeOptions = this.loggedInUserService.getPicklistOptions('GoodsReceiptLineInspectionStatusCode'),
        error: error => this.messageService.showError(this.getErrorMessage(error))
      });
    }
    this.loggedInUserService.getEntityLookupOptions('unit-of-measures').subscribe({
      next: options => this.uomidOptions = options,
      error: error => this.messageService.showError(this.getErrorMessage(error))
    });
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
ReceiptDateTime:  obj.ReceiptDateTime || null,
SupplierDeliveryNoteNo: obj.SupplierDeliveryNoteNo || '',
ReceivedByUserId: obj.ReceivedByUserId || 0,
Remarks: obj.Remarks || '',
RecordStatus: obj.RecordStatus || '',

      }
    );

    const savedLineItems = this.objMaster.LineItems || [];
    this.setLineItems(savedLineItems.length
      ? savedLineItems
      : this.purchaseOrderLines.map(line => this.createReceiptLineFromPurchaseOrderLine(line)));

    if (!savedLineItems.length && this.lineItems.length) {
      this.lineItems.markAsDirty();
      this.editForm.markAsDirty();
    } else {
      this.editForm.markAsPristine();
    }

    this.editForm.markAsUntouched();
  }



  Save(): void {

        if (!this.editForm.valid || this.lineItems.length === 0) {
            this.messageService.showError('One or more validation failed. Please clear error to continue...');
            return;
        }

     const formValues = this.editForm.getRawValue(); 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     GRNNo:  formValues.GRNNo || null,
PurchaseOrderId:  formValues.PurchaseOrderId || 0,
SupplierPartyId:  formValues.SupplierPartyId || 0,
ReceivingOrganisationUnitId:  formValues.ReceivingOrganisationUnitId || 0,
ReceiptLocationId:  formValues.ReceiptLocationId || 0,
GoodsReceiptStatusId:  formValues.GoodsReceiptStatusId || 0,
ReceiptDateTime:  formValues.ReceiptDateTime || null,
SupplierDeliveryNoteNo:  formValues.SupplierDeliveryNoteNo || null,
ReceivedByUserId:  formValues.ReceivedByUserId || 0,
Remarks:  formValues.Remarks || null,
RecordStatus:  formValues.RecordStatus || null,
LineItems: this.lineItems.getRawValue().map((line: any) => ({
  Id: line.Id || 0,
  RowVersionStr: line.RowVersionStr || '',
  GoodsReceiptLineId: line.GoodsReceiptLineId || '',
  GoodsReceiptId: this.goodsReceipt.Id,
  PurchaseOrderLineId: line.PurchaseOrderLineId || 0,
  LineNo: line.LineNo || 0,
  ReceivedQuantity: line.ReceivedQuantity ?? 0,
  AcceptedQuantity: line.AcceptedQuantity ?? 0,
  RejectedQuantity: line.RejectedQuantity ?? 0,
  UOMId: line.UOMId || 0,
  InspectionRequired: !!line.InspectionRequired,
  InspectionStatusCode: line.InspectionStatusCode || null,
  RejectionReason: line.RejectionReason || null
})),

    } as IGoodsReceipt ;

	this.spinner.show();  	   
    this.goodsReceiptService.update(this.goodsReceipt.Id, updatedObj).subscribe({
      next: data => {
        this.messageService.showSuccess('Goods receipt line items saved successfully.');
        this.loadUI();
      },
      error: err => { 
       this.messageService.showError(this.getErrorMessage(err));
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide();}
    });
  }

  private getErrorMessage(error: unknown): string {
    const response = error as { error?: { message?: string; Message?: string } | string; message?: string };
    return typeof error === 'string'
      ? error
      : typeof response?.error === 'string'
        ? response.error
        : response?.error?.message || response?.error?.Message || response?.message || 'Unable to save the goods receipt.';
  }
}
