import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InternalSupplierDelivery, InternalSupplierDeliveryService } from './internal-supplier-delivery.service';

@Component({ selector: 'app-internal-supplier-delivery-detail', standalone: false, templateUrl: './supplierDelivery-detail.component.html' })
export class SupplierDeliveryDetailComponent implements OnInit {
    delivery?: InternalSupplierDelivery;
    loading = true;
    creating = false;
    error = '';
    constructor(private readonly route: ActivatedRoute, private readonly router: Router, private readonly service: InternalSupplierDeliveryService) {}
    ngOnInit(): void { this.load(); }
    load(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!id) { this.router.navigate(['/business/procurement/supplier-deliveries']); return; }
        this.loading = true; this.error = '';
        this.service.get(id).subscribe({ next: delivery => this.delivery = delivery, error: error => this.error = error?.error?.message || error?.error?.Message || 'Supplier delivery could not be loaded.', complete: () => this.loading = false });
    }
    createGoodsReceipt(): void {
        if (!this.delivery || this.creating) return;
        this.creating = true; this.error = '';
        this.service.createGoodsReceipt(this.delivery.SupplierDeliveryId).subscribe({
            next: id => id > 0 ? this.router.navigate(['/business/procurement/goods-receipts/edit', id]) : this.error = 'The goods receipt was not created.',
            error: error => { this.error = error?.error?.message || error?.error?.Message || 'Goods receipt could not be created.'; this.creating = false; }
        });
    }
    back(): void { this.router.navigate(['/business/procurement/supplier-deliveries']); }
}
