import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InternalSupplierDelivery, InternalSupplierDeliveryService } from './internal-supplier-delivery.service';

@Component({ selector: 'app-internal-supplier-delivery-list', standalone: false, templateUrl: './supplierDelivery-list.component.html' })
export class SupplierDeliveryListComponent implements OnInit {
    deliveries: InternalSupplierDelivery[] = [];
    search = '';
    status = '';
    loading = false;
    error = '';
    readonly statuses = [{ label: 'All statuses', value: '' }, { label: 'Submitted', value: 'SUBMITTED' }];

    constructor(private readonly service: InternalSupplierDeliveryService, private readonly router: Router) {}
    ngOnInit(): void { this.load(); }
    load(): void {
        this.loading = true; this.error = '';
        this.service.list(this.search, this.status).subscribe({
            next: items => this.deliveries = items,
            error: error => this.error = error?.error?.message || error?.error?.Message || 'Supplier deliveries could not be loaded.',
            complete: () => this.loading = false
        });
    }
    clear(): void { this.search = ''; this.status = ''; this.load(); }
    view(delivery: InternalSupplierDelivery): void { this.router.navigate(['/business/procurement/supplier-deliveries', delivery.SupplierDeliveryId]); }
}
