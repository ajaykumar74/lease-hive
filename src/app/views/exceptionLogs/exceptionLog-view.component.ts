import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { PickListService } from '@/shared/PicklistService';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { ExceptionLogService } from './exceptionLog.service';
import { IExceptionLog } from './exceptionLog';

@Component({
    templateUrl: './ExceptionLog-view.component.html',
    standalone: false,
    providers: [MessageService]
})
export class ExceptionLogViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    ExceptionLog: IExceptionLog = {} as IExceptionLog;
    Caption: string = 'Loading...';
    pickListServiceOptions: any;
 brandPartner: any;

    constructor(
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private projectService: ExceptionLogService,
        private _location: Location,
        private loggedInUserService: LoggedInUserService,
        private pickListService: PickListService
    ) {

    }

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    objMaster = { ...this.ExceptionLog };
    ngOnInit(): void {
        this.selectedId = this.activatedRouter.snapshot.params['id'];
        this.pickListServiceOptions = this.pickListService;
         this.brandPartner = this.loggedInUserService.loggedInUser.BrandPartner;
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
                this.ExceptionLog = data.data;
                this.permission = data.permission;
                this.objMaster = { ...this.ExceptionLog };
                this.populateUI(this.ExceptionLog);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IExceptionLog): void {
        this.Caption = "Exception Log Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {
            this.router.navigate(['/ExceptionLog/create']);
        }
        else if (key == "Refresh") {
            this.loadUI();
        }
    }





}

