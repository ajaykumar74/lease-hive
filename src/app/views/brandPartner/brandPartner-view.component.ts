import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { IStateData, LoggedInUserService } from '@/shared/LoggedInUserService'
import { BrandPartnerService } from './brandPartner.service';
import { IBrandPartner } from './brandPartner';
import { AppConstants } from '@/shared/constants/AppConstants'
import { environment } from '../../../environments/environment';
@Component({
    templateUrl: './brandPartner-view.component.html',
    standalone: false,
    providers: [MessageService]
})
export class BrandPartnerViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    brandPartner: IBrandPartner = {} as IBrandPartner;
    Caption: string = 'Loading...';


    constructor(
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private brandPartnerService: BrandPartnerService,
        private _location: Location,
        private loggedInUserService: LoggedInUserService,
        private readonly appConstants: AppConstants,
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
        this.brandPartnerService.getById(this.selectedId).subscribe({
            next: data => {
                this.brandPartner = data.data;
                this.permission = data.permission;
                this.populateUI(this.brandPartner);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IBrandPartner): void {
        this.Caption = "BrandPartner Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        const obj: IStateData = {} as IStateData;
        obj.Id = this.brandPartner.Id;
        obj.Name = this.brandPartner.BusinessName;
        obj.RecordType = this.appConstants.RecordType.BrandPartner;
        if (key == "Refresh") {

            this.router.navigate(['/brandPartner/create']);
        }
        else if (key == "Refresh") {
            this.loadUI();
        }
        else if (key == "TaxDetails") {
            this.router.navigate(['dashboard/taxDetails/list'], { state: { stateData: obj } });
        }
        else if (key == "Contact") {
            this.router.navigate(['/dashboard/contacts/list'], { state: { stateData: obj } });
        }
        else if (key == "ConnectXero") {
            window.location.href = `${environment.vlootApiUrl}/api/xero/connect?usertype=brandpartner`;
        }
        else if (key == "Document") {
            this.router.navigate(['/dashboard/document/list'], { state: { stateData: obj } });
        }
    }





}

