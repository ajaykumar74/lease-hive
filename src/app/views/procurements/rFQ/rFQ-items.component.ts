import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

import { IRFQLineItem } from './rFQ';

@Component({
  selector: 'app-rfq-items',
  standalone: false,
  templateUrl: './rFQ-items.component.html',
  providers: [ConfirmationService]
})
export class RFQItemsComponent {
  @Input() items: IRFQLineItem[] = [];
  @Input() eligibleItems: IRFQLineItem[] = [];
  @Input() editable = true;
  @Input() purchaseRequisitionSelected = false;
  @Output() itemsChange = new EventEmitter<IRFQLineItem[]>();

  selectedItems: IRFQLineItem[] = [];
  selectedEligibleItems: IRFQLineItem[] = [];
  addDialogVisible = false;

  constructor(private readonly confirmationService: ConfirmationService) {}

  get availableItems(): IRFQLineItem[] {
    const selectedLineIds = new Set(this.items.map(item => item.PurchaseRequisitionLineId));
    return this.eligibleItems.filter(item => !selectedLineIds.has(item.PurchaseRequisitionLineId));
  }

  openAddDialog(): void {
    this.selectedEligibleItems = [];
    this.addDialogVisible = true;
  }

  addSelectedItems(): void {
    const existingLineIds = new Set(this.items.map(item => item.PurchaseRequisitionLineId));
    const additions = this.selectedEligibleItems
      .filter(item => !existingLineIds.has(item.PurchaseRequisitionLineId))
      .map(item => ({ ...item, Id: 0, RowVersionStr: '', Quantity: Number(item.PRQuantity) }));

    if (additions.length > 0) {
      this.items = [...this.items, ...additions];
      this.emitItems();
    }

    this.addDialogVisible = false;
    this.selectedEligibleItems = [];
  }

  confirmDelete(): void {
    if (!this.selectedItems.length) return;

    this.confirmationService.confirm({
      key: 'rfq-items-delete',
      header: 'Delete RFQ items?',
      message: `Remove ${this.selectedItems.length} selected RFQ item${this.selectedItems.length === 1 ? '' : 's'}?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const selectedIds = new Set(this.selectedItems.map(item => item.PurchaseRequisitionLineId));
        this.items = this.items.filter(item => !selectedIds.has(item.PurchaseRequisitionLineId));
        this.selectedItems = [];
        this.emitItems();
      }
    });
  }

  quantityChanged(item: IRFQLineItem): void {
    const quantity = Number(item.Quantity);
    item.Quantity = Number.isFinite(quantity) ? quantity : 0;
    this.emitItems();
  }

  private emitItems(): void {
    this.itemsChange.emit(this.items.map(item => ({ ...item })));
  }
}
