import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionService } from '@/shared/security/permission.service';
import { AssetCatalogueService } from './assetCatalogue.service';

@Component({ templateUrl: './assetCatalogue-list.component.html', standalone: false })
export class AssetCatalogueListComponent implements OnInit {
    rows: any[] = []; total = 0; loading = false; searchText = ''; publicationStatus = ''; sortBy = 'CatalogueName'; isDescending = false; first = 0; pageSize = 20;
    constructor(private readonly catalogue: AssetCatalogueService, private readonly router: Router, private readonly permissions: PermissionService) { }
    get canCreate(): boolean { return this.permissions.hasPermission('asset.assetcatalogueitem.create'); }
    get canUpdate(): boolean { return this.permissions.hasPermission('asset.assetcatalogueitem.update'); }
    get canPublish(): boolean { return this.permissions.hasPermission('asset.assetcatalogueitem.publish'); }
    ngOnInit(): void { this.load(); }
    load(reset = false): void {
        if (reset) this.first = 0;
        this.loading = true;
        this.catalogue.search({ Skip: this.first, Take: this.pageSize, SortBy: this.sortBy, IsDescending: this.isDescending, SearchText: this.searchText.trim(), PublicationStatus: this.publicationStatus }).subscribe({ next: (result: any) => { this.rows = result?.data?.Records || []; this.total = result?.data?.TotalRecords || 0; }, error: () => { this.rows = []; this.total = 0; }, complete: () => this.loading = false });
    }
    clear(): void { this.searchText = ''; this.publicationStatus = ''; this.sortBy = 'CatalogueName'; this.isDescending = false; this.load(true); }
    page(event: any): void { this.first = event.first; this.pageSize = event.rows; this.load(); }
    view(row: any): void { this.router.navigate(['/business/assets/catalogue/view', row.Id]); }
    edit(row: any): void { this.router.navigate(['/business/assets/catalogue/edit', row.Id]); }
    create(): void { this.router.navigate(['/business/assets/catalogue/create']); }
    changeStatus(row: any, action: 'publish'|'unpublish'|'archive'): void { this.catalogue.status(row.Id, action).subscribe({ next: () => this.load() }); }
}
