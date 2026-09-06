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
import { ISupplierInvoice } from './supplierInvoice';
import { SupplierInvoiceService } from './supplierInvoice.service';
import { ISupplierInvoiceLine } from '../supplierInvoiceLine/supplierInvoiceLine';


@Component({
  selector: 'app-supplierInvoice-edit',
  standalone: false,
  templateUrl: './supplierInvoice-edit.component.html',
  providers: [ MessageService]
})
export class SupplierInvoiceEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  supplierInvoice: ISupplierInvoice = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  supplierpartyidOptions: ISelectItem[] = [];
buyingorganisationidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
matchstatuscodeOptions: ISelectItem[] = [];
invoicedocumentidOptions: ISelectItem[] = [];
capturedbyOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];
uomidOptions: ISelectItem[] = [];
purchaseorderlineidOptions: ISelectItem[] = [];
goodsreceiptlineidOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ISupplierInvoice = {} as ISupplierInvoice;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private supplierInvoiceService: SupplierInvoiceService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.supplierInvoice };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
SupplierPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
BuyingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SupplierInvoiceNo: new FormControl('', [Validators.required, Validators.maxLength(80), ]),
InvoiceDate: new FormControl(new Date(), [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Subtotal: new FormControl(0, [Validators.required]),
TaxAmount: new FormControl(0, [Validators.required]),
TotalAmount: new FormControl(0, [Validators.required]),
MatchStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
InvoiceDocumentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
APReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CapturedOn: new FormControl(new Date(), [Validators.required]),
CapturedBy: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
LineItems: this.fb.array([], Validators.required),

    });
this.loggedInUserService.bindEntityLookup(this.editForm, 'BuyingOrganisationId', 'organisations',
      options => this.buyingorganisationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'CapturedBy', 'application-users',
      options => this.capturedbyOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'InvoiceDocumentId', 'documents',
      options => this.invoicedocumentidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'SupplierPartyId', 'parties',
      options => this.supplierpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.matchstatuscodeOptions = this.loggedInUserService.getPicklistOptions('SupplierInvoiceMatchStatusCode');
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
    this.supplierInvoiceService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.supplierInvoice = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.supplierInvoice };
        this.populateUI(this.supplierInvoice);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ISupplierInvoice): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  SupplierPartyId: obj.SupplierPartyId || 0,
BuyingOrganisationId: obj.BuyingOrganisationId || 0,
SupplierInvoiceNo: obj.SupplierInvoiceNo || '',
InvoiceDate:  obj.InvoiceDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
Subtotal: obj.Subtotal || 0,
TaxAmount: obj.TaxAmount || 0,
TotalAmount: obj.TotalAmount || 0,
MatchStatusCode: obj.MatchStatusCode || '',
InvoiceDocumentId: obj.InvoiceDocumentId || 0,
APReferenceId: obj.APReferenceId || 0,
CapturedOn:  obj.CapturedOn || new Date(),
CapturedBy: obj.CapturedBy || 0,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
    this.setLineItems(obj.LineItems || []);
   
	 this.Caption = "SupplierInvoice Details #" + obj.Id;
  } 

  get lineItems(): FormArray<FormGroup> { return this.editForm.get('LineItems') as FormArray<FormGroup>; }

  addLineItem(lineItem?: Partial<ISupplierInvoiceLine>): void {
    const line = this.fb.group({
      Id: new FormControl(lineItem?.Id || 0), RowVersionStr: new FormControl(lineItem?.RowVersionStr || ''),
      SupplierInvoiceId: new FormControl(lineItem?.SupplierInvoiceId || this.selectedId), LineNo: new FormControl(lineItem?.LineNo || this.lineItems.length + 1),
      PurchaseOrderLineId: new FormControl(lineItem?.PurchaseOrderLineId || 0), GoodsReceiptLineId: new FormControl(lineItem?.GoodsReceiptLineId || 0),
      Description: new FormControl(lineItem?.Description || '', [Validators.required, Validators.maxLength(100)]),
      InvoicedQuantity: new FormControl(lineItem?.InvoicedQuantity || 1, [Validators.required, Validators.min(1)]), UOMId: new FormControl(lineItem?.UOMId || 1, [Validators.min(1)]),
      UnitPrice: new FormControl(lineItem?.UnitPrice || 0, [Validators.required, Validators.min(0)]), TaxAmount: new FormControl(lineItem?.TaxAmount || 0, [Validators.required, Validators.min(0)]),
      LineTotal: new FormControl({ value: lineItem?.LineTotal || 0, disabled: true })
    });
    line.valueChanges.subscribe(() => this.recalculateLineItems()); this.lineItems.push(line);
    if (!lineItem) { this.lineItems.markAsDirty(); this.editForm.markAsDirty(); }
    this.recalculateLineItems();
  }

  removeLineItem(index: number): void {
    this.lineItems.removeAt(index); this.lineItems.controls.forEach((line, lineIndex) => line.get('LineNo')?.setValue(lineIndex + 1, { emitEvent: false }));
    this.lineItems.markAsDirty(); this.editForm.markAsDirty(); this.recalculateLineItems();
  }

  private loadLineItemOptions(): void {
    this.loggedInUserService.getEntityLookupOptions('unit-of-measures').subscribe({ next: options => this.uomidOptions = options, error: error => this.showLookupError(error) });
    this.loggedInUserService.getEntityLookupOptions('purchase-order-lines').subscribe({ next: options => this.purchaseorderlineidOptions = options, error: error => this.showLookupError(error) });
    this.loggedInUserService.getEntityLookupOptions('goods-receipt-lines').subscribe({ next: options => this.goodsreceiptlineidOptions = options, error: error => this.showLookupError(error) });
  }

  private showLookupError(error: unknown): void {
    const response = error as { error?: { message?: string; Message?: string } | string; message?: string };
    const message = typeof error === 'string' ? error : typeof response?.error === 'string' ? response.error : response?.error?.message || response?.error?.Message || response?.message || 'Unable to load supplier-invoice options.';
    setTimeout(() => this.messageService?.showError(message));
  }

  private setLineItems(lineItems: ISupplierInvoiceLine[]): void { this.lineItems.clear(); lineItems.forEach(lineItem => this.addLineItem(lineItem)); this.recalculateLineItems(); }
  private recalculateLineItems(): void {
    const lines = this.lineItems.getRawValue();
    lines.forEach((line: any, index: number) => this.lineItems.at(index).get('LineTotal')?.setValue((Number(line.InvoicedQuantity) * Number(line.UnitPrice)) + Number(line.TaxAmount), { emitEvent: false }));
    const totals = lines.reduce((result: { subtotal: number; tax: number }, line: any) => ({ subtotal: result.subtotal + (Number(line.InvoicedQuantity) * Number(line.UnitPrice)), tax: result.tax + Number(line.TaxAmount) }), { subtotal: 0, tax: 0 });
    this.editForm.patchValue({ Subtotal: totals.subtotal, TaxAmount: totals.tax, TotalAmount: totals.subtotal + totals.tax }, { emitEvent: false });
  }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/supplier-invoices/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.supplierInvoice = { ...this.objMaster };
	var obj  = this.supplierInvoice;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  SupplierPartyId: obj.SupplierPartyId || 0,
BuyingOrganisationId: obj.BuyingOrganisationId || 0,
SupplierInvoiceNo: obj.SupplierInvoiceNo || '',
InvoiceDate:  obj.InvoiceDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
Subtotal: obj.Subtotal || 0,
TaxAmount: obj.TaxAmount || 0,
TotalAmount: obj.TotalAmount || 0,
MatchStatusCode: obj.MatchStatusCode || '',
InvoiceDocumentId: obj.InvoiceDocumentId || 0,
APReferenceId: obj.APReferenceId || 0,
CapturedOn:  obj.CapturedOn || new Date(),
CapturedBy: obj.CapturedBy || 0,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
    this.setLineItems(this.objMaster.LineItems || []);
  }



  Save(): void {
  
        if (!this.editForm.valid || this.lineItems.length === 0) {
            this.messageService.showError('One or more validation failed. Please clear error to continue...');
            return;
        }
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     SupplierPartyId:  formValues.SupplierPartyId || 0,
BuyingOrganisationId:  formValues.BuyingOrganisationId || 0,
SupplierInvoiceNo:  formValues.SupplierInvoiceNo || null,
InvoiceDate:  formValues.InvoiceDate || null,
CurrencyCode:  formValues.CurrencyCode || null,
Subtotal:  formValues.Subtotal || 0,
TaxAmount:  formValues.TaxAmount || 0,
TotalAmount:  formValues.TotalAmount || 0,
MatchStatusCode:  formValues.MatchStatusCode || null,
InvoiceDocumentId:  formValues.InvoiceDocumentId || 0,
APReferenceId:  formValues.APReferenceId || 0,
CapturedOn:  formValues.CapturedOn || null,
CapturedBy:  formValues.CapturedBy || 0,
LineItems: this.lineItems.getRawValue().map((line: any) => ({ ...line, SupplierInvoiceId: this.supplierInvoice.Id })),
RecordStatus:  formValues.RecordStatus || null,

    } as ISupplierInvoice ;
	
	this.spinner.show();  	   
    this.supplierInvoiceService.update(this.supplierInvoice.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(SupplierInvoice +  'Details Updated sucessfully.');
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
