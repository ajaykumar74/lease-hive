import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { PickListService } from '@/shared/PicklistService';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { LoggedInUserService } from '@/shared/LoggedInUserService';

import { NotificationService } from './notification.service';
import { INotification } from './notification';

@Component({
    templateUrl: './notification-view.component.html',
    standalone: false,
    providers: [MessageService]
})
export class NotificationViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    notification: INotification = {} as INotification;
    Caption: string = 'Loading...';
    pickListServiceOptions: any;

    constructor(
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private projectService: NotificationService,
        private _location: Location,
        private loggedInUserService: LoggedInUserService,
        private pickListService: PickListService
    ) { }

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;
    brandPartner: any;

    objMaster = { ...this.notification };

    ngOnInit(): void {
        this.brandPartner = this.loggedInUserService.loggedInUser.BrandPartner;
        this.selectedId = this.activatedRouter.snapshot.params['id'];
        this.pickListServiceOptions = this.pickListService;
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
                this.notification = data.data;
                this.permission = data.permission;
                this.objMaster = { ...this.notification };
                this.populateUI(this.notification);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: INotification): void {
        this.Caption = "Notification Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {
            this.router.navigate(['/notification/create']);
        }
        else if (key == "Refresh") {
            this.loadUI();
        }
    }
}
