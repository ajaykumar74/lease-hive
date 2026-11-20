import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { finalize } from 'rxjs';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { AssetService } from './asset.service';
import { IAsset } from './asset';
import { createAssetQuickOptions } from './asset-quick-options';
import { AssetFundingService } from '@/views/billings/assetFunding/assetFunding.service';
import { IAssetFundingAssetSummary } from '@/views/billings/assetFunding/assetFunding';

@Component({
    templateUrl: './asset-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class AssetViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    asset: IAsset = {} as IAsset;
    Caption: string = 'Loading...';
    menuItems: MenuItem[] = [];
    activeTab: 'details' | 'funding' = 'details';
    fundingFacilities: IAssetFundingAssetSummary[] = [];
    fundingLoading: boolean = false;
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private assetService: AssetService, 
        private _location: Location,
        private loggedInUserService: LoggedInUserService,
        private fundingService: AssetFundingService
    ) {
        this.menuItems = createAssetQuickOptions(
            () => this.asset?.Id,
            commands => this.router.navigate(commands));
    }

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent; 

       

    ngOnInit(): void { 
        this.selectedId = this.activatedRouter.snapshot.params['id']; 
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.loadUI();
        }, 1000);
    }

    loadUI(): void {
        this.isLoading = true;
        this.spinner.show();
        this.assetService.getById(this.selectedId).subscribe({
            next: data => {
                this.asset = data.data;
                this.permission = data.permission; 
                this.populateUI(this.asset);
                if (this.asset?.Id) this.loadFunding();
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IAsset): void { 
        this.Caption = "Asset Details #" + obj.Id;
    }

    selectTab(tab: 'details' | 'funding'): void {
        this.activeTab = tab;
        if (tab === 'funding') this.loadFunding();
    }

    loadFunding(): void {
        const assetId = Number(this.asset?.Id);
        if (!Number.isInteger(assetId) || assetId <= 0 || this.fundingLoading) return;

        this.fundingLoading = true;
        this.fundingService.assetSummary(assetId).pipe(
            finalize(() => this.fundingLoading = false)
        ).subscribe({
            next: rows => this.fundingFacilities = Array.isArray(rows) ? rows : [],
            error: () => this.fundingFacilities = []
        });
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/asset/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

