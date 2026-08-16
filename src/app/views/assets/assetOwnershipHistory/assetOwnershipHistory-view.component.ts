import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { AssetOwnershipHistoryService } from './assetOwnershipHistory.service';
import { IAssetOwnershipHistory } from './assetOwnershipHistory';

@Component({
    templateUrl: './assetOwnershipHistory-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class AssetOwnershipHistoryViewComponent implements OnInit {
    selectedId: number;
    assetId: number | null = null;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    assetOwnershipHistory: IAssetOwnershipHistory = {} as IAssetOwnershipHistory;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private assetOwnershipHistoryService: AssetOwnershipHistoryService, 
        private _location: Location,
        private loggedInUserService: LoggedInUserService
    ) {

    }

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent; 

       

    ngOnInit(): void { 
        this.selectedId = this.activatedRouter.snapshot.params['id'];
        const routeAssetId = Number(this.activatedRouter.snapshot.paramMap.get('assetId'));
        this.assetId = routeAssetId > 0 ? routeAssetId : null;
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.loadUI();
        }, 1000);
    }

    loadUI(): void {
        this.isLoading = true;
        this.spinner.show();
        this.assetOwnershipHistoryService.getById(this.selectedId).subscribe({
            next: data => {
                this.assetOwnershipHistory = data.data;
                if (this.assetId && this.assetOwnershipHistory.AssetId !== this.assetId) {
                    this.messageService.showError('This record does not belong to the selected asset.');
                    this.router.navigate(['/dashboard/assetOwnershipHistorys/asset', this.assetId]);
                    return;
                }
                this.permission = data.permission; 
                this.populateUI(this.assetOwnershipHistory);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IAssetOwnershipHistory): void { 
        this.Caption = "AssetOwnershipHistory Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/assetOwnershipHistory/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

