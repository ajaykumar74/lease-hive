import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IStateData, LoggedInUserService } from '@/shared/LoggedInUserService';
import { SettingsService } from './settings.service';
import { ISettings } from './settings';

import { environment } from '../../../environments/environment';
import { IBrandPartner } from '../brandPartner/brandPartner';

@Component({
    templateUrl: './settings-view.component.html',
    standalone: false,
    providers: [MessageService]
})
export class SettingsViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanUpdate: true } as IPermission;
    Caption: string = 'Loading...';
    editForm: any;
    settings: ISettings;
    objMaster: ISettings = {} as ISettings;
    IsSettingsUser: boolean;

    emailId: string = "";
    testCode: string = "";
    showTestTab: boolean = false;
    constructor(
        private router: Router,
        private settingsService: SettingsService,
        public loggedInUserService: LoggedInUserService,
        private _location: Location,
        private activatedRouter: ActivatedRoute,
        private fb: FormBuilder,


    ) { }

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;


    recordsPerPageOptions: any[] = [];
    gridSizeOptions: any[] = [];

    brandPartner: IBrandPartner;

    ngOnInit(): void {
        this.showTestTab = (environment.envName == 'qa' || environment.envName == 'dev');



        this.objMaster = { ...this.settings };
        this.recordsPerPageOptions = [
            { text: '10', value: 10 },
            { text: '20', value: 20 },
            { text: '30', value: 30 },
            { text: '40', value: 40 },
            { text: '50', value: 50 }
        ];

        this.gridSizeOptions = [
            { text: 'Small', value: 'small' },
            { text: 'Medium', value: 'medium' },
            { text: 'Large', value: 'large' }
        ];
        this.editForm = this.fb.group({
            RecordsPerPage: new FormControl(this.settingsService.Settings.RecordsPerPage, []),
            GridSize: new FormControl(this.settingsService.Settings.GridSize),

        });

        this.testCode = this.generateCode();
    }


    ngAfterViewInit(): void {
        setTimeout(() => {
            this.Caption = "Setting Details";
        }, 500);
    }

    loadUI(): void {
        this.isLoading = true;
        this.settingsService.getById(this.selectedId).subscribe({
            next: data => {
                this.settings = data;
                this.objMaster = { ...this.settings };
                this.populateUI(data);
            },
            error: err => { this.messageService.showSuccess(err); },
            complete: () => { this.isLoading = false; }
        });
    }


    populateUI(obj: ISettings): void {
        this.editForm.patchValue(
            {
                RecordsPerPage: obj.RecordsPerPage || '',
                GridSize: obj.GridSize || ''
            }
        );
    }

    onOptionItemClicked(key: string): void {
        if (key == "Save") {
            this.Save();
        }
        else if (key == "Refresh") {
            this.loadUI();
        }
    }



    Save(): void {
        if (!this.editForm.valid) {
            this.messageService.showError('One or more validation failed. Please clear error to continue...');
            return;
        }
        const formValues = this.editForm.value;
        var createdObj = {
            RecordsPerPage: formValues.RecordsPerPage || 10,
            GridSize: formValues.GridSize || 'small',
        } as ISettings;

        this.settingsService.Settings = createdObj;
        /* this.spinner.show();
        this.settingsService.create(createdObj).subscribe({
        next: data => {
            this.settingsService.CacheData.IsLoaded = false;
            this._location.back();
        },
        error: err => {
            this.messageService.showError(err);
            this.spinner.hide();
        },
        complete: () => { this.spinner.hide(); }
        }); */
    }

    generateCode() {
        // First 2 uppercase letters
        const letters = String.fromCharCode(
            65 + Math.floor(Math.random() * 26),
            65 + Math.floor(Math.random() * 26)
        );

        // Last 2 digits (00–99, always 2 digits)
        const digits = String(Math.floor(Math.random() * 100)).padStart(2, "0");

        return letters + '-' + digits;
    }

    SendTestEmail(): void {
        this.spinner.show();
        let data = this.emailId + ":" + this.testCode;
        data = JSON.stringify(data);

        this.settingsService.SendTestEmail(data).subscribe({
            next: data => {
                this.messageService.showSuccess('Test email sent successfully.');
            },
            error: err => {
                this.messageService.showError(err);
                this.spinner.hide();
            },
            complete: () => { this.spinner.hide(); }
        });
    }

    TestTaskworker(): void {
        this.spinner.show();
        this.settingsService.TestTaskworker().subscribe({
            next: data => {
                this.messageService.showSuccess('Task worker method executed successfully.');
            },
            error: err => {
                this.messageService.showError(err);
                this.spinner.hide();
            },
            complete: () => { this.spinner.hide(); }
        });
    }

}
