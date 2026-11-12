import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { ISupplierInvoice, ISupplierInvoiceEligibleLine, ISupplierInvoicePurchaseOrderContext } from './supplierInvoice';
import { SupplierInvoiceReview, SupplierInvoiceService } from './supplierInvoice.service';
import { ISupplierInvoiceLine } from '../supplierInvoiceLine/supplierInvoiceLine';

type SupplierInvoiceLineContext = Partial<ISupplierInvoiceLine> & { GRNNo?: string; AcceptedQuantity?: number; EligibleQuantity?: number; };

@Component({ selector: 'app-supplierInvoice-edit', standalone: false, templateUrl: './supplierInvoice-edit.component.html', providers: [MessageService, ConfirmationService] })
export class SupplierInvoiceEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);
  selectedId: number;
  isLoading = false;
  supplierInvoice: ISupplierInvoice = null;
  permission = {} as IPermission;
  Caption = 'Loading...';
  supplierpartyidOptions: ISelectItem[] = [];
  buyingorganisationidOptions: ISelectItem[] = [];
  purchaseorderidOptions: ISelectItem[] = [];
  matchstatuscodeOptions: ISelectItem[] = [];
  invoicedocumentidOptions: ISelectItem[] = [];
  capturedbyOptions: ISelectItem[] = [];
  recordstatusOptions: ISelectItem[] = [];
  uomidOptions: ISelectItem[] = [];
  purchaseorderlineidOptions: ISelectItem[] = [];
  goodsreceiptlineidOptions: ISelectItem[] = [];
  currentPurchaseOrderId: number | null = null;
  editForm: any;
  objMaster: ISupplierInvoice = {} as ISupplierInvoice;
  review?: SupplierInvoiceReview;
  reviewActionInProgress = false;
  reviewRemarks = new FormControl('', [Validators.maxLength(1000)]);

  constructor(private readonly activatedRouter: ActivatedRoute, private readonly fb: FormBuilder, private readonly router: Router, private readonly location: Location, private readonly supplierInvoiceService: SupplierInvoiceService, private readonly loggedInUserService: LoggedInUserService, private readonly confirmationService: ConfirmationService) {}
  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  ngOnInit(): void {
    this.editForm = this.fb.group({
      Id: new FormControl(0, [Validators.required]), SupplierPartyId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
      BuyingOrganisationId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]), PurchaseOrderId: new FormControl<number | null>(null),
      SupplierInvoiceNo: new FormControl('', [Validators.required, Validators.maxLength(80)]), InvoiceDate: new FormControl(new Date(), [Validators.required]),
      CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20)]), Subtotal: new FormControl({ value: 0, disabled: true }, [Validators.required]),
      TaxAmount: new FormControl({ value: 0, disabled: true }, [Validators.required]), TotalAmount: new FormControl({ value: 0, disabled: true }, [Validators.required]),
      MatchStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20)]), InvoiceDocumentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
      APReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]), CapturedOn: new FormControl(new Date(), [Validators.required]),
      CapturedBy: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]), RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      LineItems: this.fb.array([], Validators.required)
    });
    this.bindLookups(); this.loadLineItemOptions();
    this.editForm.get('PurchaseOrderId')?.valueChanges.subscribe((id: number | null) => this.onPurchaseOrderChanged(id));
    this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void { setTimeout(() => this.loadUI(), 500); }
  get lineItems(): FormArray<FormGroup> { return this.editForm.get('LineItems') as FormArray<FormGroup>; }

  loadUI(): void {
    this.isLoading = true;
    this.supplierInvoiceService.getById(this.selectedId).subscribe({
      next: data => { this.supplierInvoice = data.data; this.permission = data.permission; this.objMaster = { ...this.supplierInvoice, LineItems: (this.supplierInvoice.LineItems || []).map(line => ({ ...line })) }; this.populateUI(this.supplierInvoice); this.enrichExistingPurchaseOrderLines(); this.loadReview(); },
      error: err => this.messageService.showError(err), complete: () => this.isLoading = false
    });
  }

  populateUI(obj: ISupplierInvoice): void {
    this.editForm.patchValue({
      Id: obj.Id || 0, SupplierPartyId: obj.SupplierPartyId || 0, BuyingOrganisationId: obj.BuyingOrganisationId || 0, PurchaseOrderId: obj.PurchaseOrderId || null,
      SupplierInvoiceNo: obj.SupplierInvoiceNo || '', InvoiceDate: obj.InvoiceDate || null, CurrencyCode: obj.CurrencyCode || '', Subtotal: obj.Subtotal || 0,
      TaxAmount: obj.TaxAmount || 0, TotalAmount: obj.TotalAmount || 0, MatchStatusCode: obj.MatchStatusCode || '', InvoiceDocumentId: obj.InvoiceDocumentId || 0,
      APReferenceId: obj.APReferenceId || 0, CapturedOn: obj.CapturedOn || null, CapturedBy: obj.CapturedBy || 0, RecordStatus: obj.RecordStatus || ''
    }, { emitEvent: false });
    this.currentPurchaseOrderId = obj.PurchaseOrderId || null;
    this.setPurchaseOrderFieldsLocked(!!this.currentPurchaseOrderId);
    this.setLineItems(obj.LineItems || [], !!this.currentPurchaseOrderId);
    this.Caption = `SupplierInvoice Details #${obj.Id}`;
  }

  addLineItem(lineItem?: SupplierInvoiceLineContext, lockReferences = false): void {
    const eligibleQuantity = Number(lineItem?.EligibleQuantity || 0);
    const quantityValidators = [Validators.required, Validators.min(1)];
    if (eligibleQuantity > 0) quantityValidators.push(Validators.max(eligibleQuantity));
    const line = this.fb.group({
      Id: new FormControl(lineItem?.Id || 0), RowVersionStr: new FormControl(lineItem?.RowVersionStr || ''), SupplierInvoiceId: new FormControl(lineItem?.SupplierInvoiceId || this.selectedId), LineNo: new FormControl(lineItem?.LineNo || this.lineItems.length + 1),
      PurchaseOrderLineId: new FormControl(lineItem?.PurchaseOrderLineId || 0), GoodsReceiptLineId: new FormControl(lineItem?.GoodsReceiptLineId || 0), Description: new FormControl(lineItem?.Description || '', [Validators.required, Validators.maxLength(100)]),
      InvoicedQuantity: new FormControl(lineItem?.InvoicedQuantity || 1, quantityValidators), UOMId: new FormControl(lineItem?.UOMId || 1, [Validators.min(1)]), UnitPrice: new FormControl(lineItem?.UnitPrice || 0, [Validators.required, Validators.min(0)]), TaxAmount: new FormControl(lineItem?.TaxAmount || 0, [Validators.required, Validators.min(0)]),
      LineTotal: new FormControl({ value: lineItem?.LineTotal || 0, disabled: true }), GRNNo: new FormControl({ value: lineItem?.GRNNo || '', disabled: true }), AcceptedQuantity: new FormControl({ value: lineItem?.AcceptedQuantity || 0, disabled: true }), EligibleQuantity: new FormControl({ value: eligibleQuantity, disabled: true })
    });
    if (lockReferences) ['PurchaseOrderLineId', 'GoodsReceiptLineId', 'Description', 'UOMId'].forEach(control => line.get(control)?.disable({ emitEvent: false }));
    line.valueChanges.subscribe(() => this.recalculateLineItems()); this.lineItems.push(line);
    if (!lineItem) { this.lineItems.markAsDirty(); this.editForm.markAsDirty(); }
    this.recalculateLineItems();
  }

  removeLineItem(index: number): void { this.lineItems.removeAt(index); this.lineItems.controls.forEach((line, lineIndex) => line.get('LineNo')?.setValue(lineIndex + 1, { emitEvent: false })); this.lineItems.markAsDirty(); this.editForm.markAsDirty(); this.recalculateLineItems(); }
  onOptionItemClicked(key: string): void { if (key === 'Create') this.router.navigate(['/business/procurement/supplier-invoices/create']); else if (key === 'Save') this.Save(); else if (key === 'Cancel') this.onCancel(); }
  onCancel(): void { this.supplierInvoice = { ...this.objMaster, LineItems: (this.objMaster.LineItems || []).map(line => ({ ...line })) }; this.populateUI(this.supplierInvoice); this.editForm.markAsPristine(); }

  reviewInvoice(action: 'APPROVE' | 'REJECT' | 'REQUEST_CORRECTION'): void {
    const remarks = String(this.reviewRemarks.value || '').trim();
    if ((action === 'REJECT' || action === 'REQUEST_CORRECTION') && !remarks) {
      this.messageService.showError('Enter a reason before rejecting an invoice or requesting correction.');
      return;
    }
    if (this.reviewActionInProgress) return;
    this.reviewActionInProgress = true;
    this.supplierInvoiceService.review(this.selectedId, action, remarks).subscribe({
      next: response => { this.messageService.showSuccess(`Supplier invoice ${response.status.toLowerCase().replace(/_/g, ' ')}.`); this.reviewRemarks.setValue(''); this.loadUI(); },
      error: error => this.messageService.showError(error),
      complete: () => this.reviewActionInProgress = false
    });
  }

  private loadReview(): void {
    this.supplierInvoiceService.getReview(this.selectedId).subscribe({
      next: response => { this.review = response.data; this.editForm.disable({ emitEvent: false }); },
      error: () => undefined
    });
  }

  Save(): void {
    if (this.review) { this.messageService.showError('Supplier portal invoices are updated through the supplier correction workflow, not this generic edit form.'); return; }
    if (!this.editForm.valid || this.lineItems.length === 0) { this.messageService.showError('One or more validation failed. Please clear error to continue...'); return; }
    const value = this.editForm.getRawValue();
    const updatedObj = {
      Id: this.objMaster.Id, RowVersionStr: this.objMaster.RowVersionStr, SupplierPartyId: value.SupplierPartyId || 0, BuyingOrganisationId: value.BuyingOrganisationId || 0, PurchaseOrderId: value.PurchaseOrderId || null,
      SupplierInvoiceNo: value.SupplierInvoiceNo || null, InvoiceDate: value.InvoiceDate || null, CurrencyCode: value.CurrencyCode || null, Subtotal: value.Subtotal || 0, TaxAmount: value.TaxAmount || 0, TotalAmount: value.TotalAmount || 0,
      MatchStatusCode: value.MatchStatusCode || null, InvoiceDocumentId: value.InvoiceDocumentId || 0, APReferenceId: value.APReferenceId || 0, CapturedOn: value.CapturedOn || null, CapturedBy: value.CapturedBy || 0, RecordStatus: value.RecordStatus || null, LineItems: this.serializeLineItems(value.LineItems || [])
    } as ISupplierInvoice;
    this.spinner.show();
    this.supplierInvoiceService.update(this.supplierInvoice.Id, updatedObj).subscribe({ next: () => this.location.back(), error: err => { this.messageService.showError(err); this.spinner.hide(); }, complete: () => this.spinner.hide() });
  }

  private bindLookups(): void {
    this.loggedInUserService.bindEntityLookup(this.editForm, 'BuyingOrganisationId', 'organisations', options => this.buyingorganisationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)), this.entityLookupDestroyRef);
    this.loggedInUserService.bindEntityLookup(this.editForm, 'CapturedBy', 'application-users', options => this.capturedbyOptions = options, error => setTimeout(() => this.messageService?.showError(error)), this.entityLookupDestroyRef);
    this.loggedInUserService.bindEntityLookup(this.editForm, 'InvoiceDocumentId', 'documents', options => this.invoicedocumentidOptions = options, error => setTimeout(() => this.messageService?.showError(error)), this.entityLookupDestroyRef);
    this.loggedInUserService.bindEntityLookup(this.editForm, 'SupplierPartyId', 'supplier-parties', options => this.supplierpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)), this.entityLookupDestroyRef);
    this.loggedInUserService.bindEntityLookup(this.editForm, 'PurchaseOrderId', 'purchase-orders', options => this.purchaseorderidOptions = options, error => setTimeout(() => this.messageService?.showError(error)), this.entityLookupDestroyRef);
    this.matchstatuscodeOptions = this.loggedInUserService.getPicklistOptions('SupplierInvoiceMatchStatusCode'); this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');
  }

  private onPurchaseOrderChanged(value: number | null): void {
    const purchaseOrderId = Number(value) || null;
    if (purchaseOrderId === this.currentPurchaseOrderId) return;
    const applyChange = () => purchaseOrderId ? this.loadPurchaseOrderContext(purchaseOrderId) : this.clearPurchaseOrderContext();
    if (this.lineItems.length > 0) this.confirmationService.confirm({ key: 'supplier-invoice-purchase-order', message: 'Changing the purchase order will replace the current invoice lines. Continue?', header: 'Replace invoice lines?', icon: 'pi pi-exclamation-triangle', accept: applyChange, reject: () => this.editForm.get('PurchaseOrderId')?.setValue(this.currentPurchaseOrderId, { emitEvent: false }) }); else applyChange();
  }

  private loadPurchaseOrderContext(purchaseOrderId: number): void {
    this.spinner.show();
    this.supplierInvoiceService.getPurchaseOrderContext(purchaseOrderId, this.selectedId).subscribe({
      next: response => { const context = response.data; if (!context.LineItems?.length) { this.messageService.showError('The selected purchase order has no accepted goods receipt quantities available to invoice.'); this.editForm.get('PurchaseOrderId')?.setValue(this.currentPurchaseOrderId, { emitEvent: false }); return; } this.applyPurchaseOrderContext(context); },
      error: err => { this.messageService.showError(err); this.editForm.get('PurchaseOrderId')?.setValue(this.currentPurchaseOrderId, { emitEvent: false }); }, complete: () => this.spinner.hide()
    });
  }

  private applyPurchaseOrderContext(context: ISupplierInvoicePurchaseOrderContext): void {
    this.currentPurchaseOrderId = context.PurchaseOrderId;
    this.editForm.patchValue({ PurchaseOrderId: context.PurchaseOrderId, SupplierPartyId: context.SupplierPartyId, BuyingOrganisationId: context.BuyingOrganisationId, CurrencyCode: context.CurrencyCode }, { emitEvent: false });
    this.setPurchaseOrderFieldsLocked(true); this.setLineItems(context.LineItems.map(line => this.toInvoiceLine(line)), true); this.editForm.markAsDirty();
  }
  private enrichExistingPurchaseOrderLines(): void {
    if (!this.currentPurchaseOrderId) return;
    this.supplierInvoiceService.getPurchaseOrderContext(this.currentPurchaseOrderId, this.selectedId).subscribe({
      next: response => {
        const contextByReference = new Map(response.data.LineItems.map(item => [`${item.PurchaseOrderLineId}:${item.GoodsReceiptLineId}`, item]));
        this.lineItems.controls.forEach(line => {
          const context = contextByReference.get(`${line.get('PurchaseOrderLineId')?.value}:${line.get('GoodsReceiptLineId')?.value}`);
          if (!context) return;
          line.patchValue({ GRNNo: context.GRNNo, AcceptedQuantity: context.AcceptedQuantity, EligibleQuantity: context.EligibleQuantity }, { emitEvent: false });
          const quantity = line.get('InvoicedQuantity');
          quantity?.setValidators([Validators.required, Validators.min(1), Validators.max(context.EligibleQuantity)]);
          quantity?.updateValueAndValidity({ emitEvent: false });
        });
      }
    });
  }
  private clearPurchaseOrderContext(): void { this.currentPurchaseOrderId = null; this.setPurchaseOrderFieldsLocked(false); this.setLineItems([]); this.editForm.markAsDirty(); }
  private setPurchaseOrderFieldsLocked(locked: boolean): void { ['SupplierPartyId', 'BuyingOrganisationId', 'CurrencyCode'].forEach(control => { const field = this.editForm.get(control); locked ? field?.disable({ emitEvent: false }) : field?.enable({ emitEvent: false }); }); }
  private toInvoiceLine(line: ISupplierInvoiceEligibleLine): SupplierInvoiceLineContext { return { PurchaseOrderLineId: line.PurchaseOrderLineId, GoodsReceiptLineId: line.GoodsReceiptLineId, Description: line.Description, InvoicedQuantity: line.EligibleQuantity, UOMId: line.UOMId, UnitPrice: line.UnitPrice, TaxAmount: line.DefaultTaxAmount, GRNNo: line.GRNNo, AcceptedQuantity: line.AcceptedQuantity, EligibleQuantity: line.EligibleQuantity }; }
  private setLineItems(lineItems: SupplierInvoiceLineContext[], lockReferences = false): void { this.lineItems.clear(); lineItems.forEach(lineItem => this.addLineItem(lineItem, lockReferences)); this.recalculateLineItems(); }
  private recalculateLineItems(): void {
    const lines = this.lineItems.getRawValue();
    lines.forEach((line: any, index: number) => this.lineItems.at(index).get('LineTotal')?.setValue((Number(line.InvoicedQuantity) * Number(line.UnitPrice)) + Number(line.TaxAmount), { emitEvent: false }));
    const totals = lines.reduce((result: { subtotal: number; tax: number }, line: any) => ({ subtotal: result.subtotal + (Number(line.InvoicedQuantity) * Number(line.UnitPrice)), tax: result.tax + Number(line.TaxAmount) }), { subtotal: 0, tax: 0 });
    this.editForm.patchValue({ Subtotal: totals.subtotal, TaxAmount: totals.tax, TotalAmount: totals.subtotal + totals.tax }, { emitEvent: false });
  }
  private serializeLineItems(lines: any[]): ISupplierInvoiceLine[] { return lines.map(({ GRNNo, AcceptedQuantity, EligibleQuantity, ...line }) => ({ ...line, SupplierInvoiceId: this.supplierInvoice.Id })); }
  private loadLineItemOptions(): void {
    this.loggedInUserService.getEntityLookupOptions('unit-of-measures').subscribe({ next: options => this.uomidOptions = options, error: error => this.showLookupError(error) });
    this.loggedInUserService.getEntityLookupOptions('purchase-order-lines').subscribe({ next: options => this.purchaseorderlineidOptions = options, error: error => this.showLookupError(error) });
    this.loggedInUserService.getEntityLookupOptions('goods-receipt-lines').subscribe({ next: options => this.goodsreceiptlineidOptions = options, error: error => this.showLookupError(error) });
  }
  private showLookupError(error: unknown): void { const response = error as { error?: { message?: string; Message?: string } | string; message?: string }; const message = typeof error === 'string' ? error : typeof response?.error === 'string' ? response.error : response?.error?.message || response?.error?.Message || response?.message || 'Unable to load supplier-invoice options.'; setTimeout(() => this.messageService?.showError(message)); }
}
