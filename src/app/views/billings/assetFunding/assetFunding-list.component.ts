import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssetFundingService } from './assetFunding.service';
import { IAssetFunding } from './assetFunding';
@Component({ selector: 'app-asset-funding-list', standalone: false, templateUrl: './assetFunding-list.component.html' })
export class AssetFundingListComponent implements OnInit {
    records: IAssetFunding[] = [];
    total = 0;
    searchTerm = '';
    fundingStatus = '';
    loading = false;
    filtersVisible = false;
    sortBy = 'startDate';
    readonly statuses = [{ label: 'All statuses', value: '' }, ...['DRAFT', 'APPROVED', 'PARTIALLY_DISBURSED', 'ACTIVE', 'CLOSED', 'CANCELLED'].map((value) => ({ label: value.replaceAll('_', ' '), value }))];
    readonly sortOptions = [
        { label: 'Start date', value: 'startDate' },
        { label: 'Funding number', value: 'fundingNumber' },
        { label: 'Lender', value: 'lender' },
        { label: 'Approved amount', value: 'approvedAmount' },
        { label: 'Outstanding amount', value: 'outstandingAmount' },
        { label: 'Status', value: 'status' }
    ];
    constructor(
        private service: AssetFundingService,
        public router: Router
    ) {}
    ngOnInit(): void {
        this.load();
    }
    load(): void {
        this.loading = true;
        this.service.search(this.searchTerm, 0, 100, this.fundingStatus, this.sortBy).subscribe({
            next: (result) => {
                this.records = result.records;
                this.total = result.totalRecords;
            },
            error: () => (this.records = []),
            complete: () => (this.loading = false)
        });
    }
    get hasActiveFilters(): boolean {
        return !!this.fundingStatus;
    }
    clearSearch(): void {
        if (!this.searchTerm) return;
        this.searchTerm = '';
        this.load();
    }
    clearFilters(): void {
        if (!this.fundingStatus) return;
        this.fundingStatus = '';
        this.load();
    }
    open(row: IAssetFunding): void {
        this.router.navigate(['/billing-finance/funding', row.id]);
    }
    edit(row: IAssetFunding): void {
        this.router.navigate(['/billing-finance/funding', row.id, 'edit']);
    }
    create(): void {
        this.router.navigate(['/billing-finance/funding/create']);
    }
}
