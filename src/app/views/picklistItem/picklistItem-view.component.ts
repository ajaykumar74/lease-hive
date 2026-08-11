import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { PicklistItemService } from './picklistItem.service';
import { IPicklistItem } from './picklistItem';

@Component({
    templateUrl: './picklistItem-view.component.html',
    providers: [MessageService]
})
export class PicklistItemViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    picklistItem: IPicklistItem = {} as IPicklistItem;
    Caption: string = 'Loading...'; 

    constructor(
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private projectService: PicklistItemService,
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
        this.projectService.getById(this.selectedId).subscribe({
            next: data => {
                this.picklistItem = data.data;
                this.permission = data.permission; 
                this.populateUI(this.picklistItem);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IPicklistItem): void {
        this.Caption = "PicklistItem Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {
            this.router.navigate(['/picklistItem/create']);
        }
        else if (key == "Refresh") {
            this.loadUI();
        }
    }





}

