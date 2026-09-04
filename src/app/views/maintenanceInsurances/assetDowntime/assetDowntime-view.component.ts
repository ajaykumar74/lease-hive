import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { AssetDowntimeService } from './assetDowntime.service';
import { IAssetDowntime } from './assetDowntime';

@Component({
    templateUrl: './assetDowntime-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class AssetDowntimeViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    assetDowntime: IAssetDowntime = {} as IAssetDowntime;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private assetDowntimeService: AssetDowntimeService, 
        private _location: Location,
        private loggedInUserService: LoggedInUserService
    ) {

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
        this.assetDowntimeService.getById(this.selectedId).subscribe({
            next: data => {
                this.assetDowntime = data.data;
                this.permission = data.permission; 
                this.populateUI(this.assetDowntime);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IAssetDowntime): void { 
        this.Caption = "AssetDowntime Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/maintenance-insurance/maintenance/history/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

