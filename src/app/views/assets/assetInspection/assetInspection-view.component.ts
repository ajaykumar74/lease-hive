import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { AssetInspectionService } from './assetInspection.service';
import { IAssetInspection } from './assetInspection';

@Component({
    templateUrl: './assetInspection-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class AssetInspectionViewComponent implements OnInit {
    selectedId: number;
    assetId: number | null = null;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    assetInspection: IAssetInspection = {} as IAssetInspection;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private assetInspectionService: AssetInspectionService, 
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
        this.assetInspectionService.getById(this.selectedId).subscribe({
            next: data => {
                this.assetInspection = data.data;
                if (this.assetId && this.assetInspection.AssetId !== this.assetId) {
                    this.messageService.showError('This record does not belong to the selected asset.');
                    this.router.navigate(['/dashboard/assetInspections/asset', this.assetId]);
                    return;
                }
                this.permission = data.permission; 
                this.populateUI(this.assetInspection);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IAssetInspection): void { 
        this.Caption = "AssetInspection Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/assetInspection/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

