import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { AssetDocumentLinkService } from './assetDocumentLink.service';
import { IAssetDocumentLink } from './assetDocumentLink';

@Component({
    templateUrl: './assetDocumentLink-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class AssetDocumentLinkViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    assetDocumentLink: IAssetDocumentLink = {} as IAssetDocumentLink;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private assetDocumentLinkService: AssetDocumentLinkService, 
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
        this.assetDocumentLinkService.getById(this.selectedId).subscribe({
            next: data => {
                this.assetDocumentLink = data.data;
                this.permission = data.permission; 
                this.populateUI(this.assetDocumentLink);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IAssetDocumentLink): void { 
        this.Caption = "AssetDocumentLink Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/business/assets/documents/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

