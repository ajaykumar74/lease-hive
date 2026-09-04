import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { ReturnAssessmentDamageService } from './returnAssessmentDamage.service';
import { IReturnAssessmentDamage } from './returnAssessmentDamage';

@Component({
    templateUrl: './returnAssessmentDamage-view.component.html', 
standalone: false,
    providers: [MessageService]
})
export class ReturnAssessmentDamageViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    returnAssessmentDamage: IReturnAssessmentDamage = {} as IReturnAssessmentDamage;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private returnAssessmentDamageService: ReturnAssessmentDamageService, 
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
        this.returnAssessmentDamageService.getById(this.selectedId).subscribe({
            next: data => {
                this.returnAssessmentDamage = data.data;
                this.permission = data.permission; 
                this.populateUI(this.returnAssessmentDamage);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IReturnAssessmentDamage): void { 
        this.Caption = "ReturnAssessmentDamage Details #" + obj.Id;
    }

    onOptionItemClicked(key: string): void {
        if (key == "Create") {
            this.router.navigate(['/eol-disposal/assessments/damages/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

