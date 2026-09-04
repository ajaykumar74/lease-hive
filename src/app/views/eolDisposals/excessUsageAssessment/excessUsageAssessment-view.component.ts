import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { ExcessUsageAssessmentService } from './excessUsageAssessment.service';
import { IExcessUsageAssessment } from './excessUsageAssessment';

@Component({
    templateUrl: './excessUsageAssessment-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class ExcessUsageAssessmentViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    excessUsageAssessment: IExcessUsageAssessment = {} as IExcessUsageAssessment;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private excessUsageAssessmentService: ExcessUsageAssessmentService, 
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
        this.excessUsageAssessmentService.getById(this.selectedId).subscribe({
            next: data => {
                this.excessUsageAssessment = data.data;
                this.permission = data.permission; 
                this.populateUI(this.excessUsageAssessment);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IExcessUsageAssessment): void { 
        this.Caption = "ExcessUsageAssessment Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/eol-disposal/assessments/excess-usage/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

