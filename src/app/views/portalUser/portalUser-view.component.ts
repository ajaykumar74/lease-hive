import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { PortalUserService } from './portalUser.service';
import { IPortalUser } from './portalUser';

@Component({
    templateUrl: './portalUser-view.component.html',
    standalone: false,
    providers: [MessageService]
})
export class PortalUserViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    portalUser: IPortalUser = {} as IPortalUser;
    Caption: string = 'Loading...';


    constructor(
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private projectService: PortalUserService,
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
                this.portalUser = data.data;
                this.permission = data.permission;
                this.populateUI(this.portalUser);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IPortalUser): void {
        this.Caption = "PortalUser Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {
            this.router.navigate(['/portalUser/create']);
        }
        else if (key == "Refresh") {
            this.loadUI();
        }
    }





}

