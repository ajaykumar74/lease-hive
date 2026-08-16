import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { PropertyAssetService } from './propertyAsset.service';
import { IPropertyAsset } from './propertyAsset';

@Component({
    templateUrl: './propertyAsset-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class PropertyAssetViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    propertyAsset: IPropertyAsset = {} as IPropertyAsset;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private propertyAssetService: PropertyAssetService, 
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
        this.propertyAssetService.getById(this.selectedId).subscribe({
            next: data => {
                this.propertyAsset = data.data;
                this.permission = data.permission; 
                this.populateUI(this.propertyAsset);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IPropertyAsset): void { 
        this.Caption = "PropertyAsset Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/propertyAsset/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

