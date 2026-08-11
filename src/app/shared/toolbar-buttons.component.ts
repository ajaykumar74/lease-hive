import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { IPermission } from './IPermission';



@Component({
    selector: 'app-toolbar-buttons',
    templateUrl: './toolbar-buttons.component.html',
    standalone: false,
    styleUrl: './toolbar-buttons.component.css',
    providers: [ConfirmationService, MessageService]
})
export class ToolbarButtonsComponent implements OnInit {

    @Input() form: any;
    @Input() Entity: string;
    @Input() buttons: any[] = [];
    @Input() permission: IPermission;
    @Input() IsHideCreate: boolean = false;
    @Input() IsShowDelete: boolean;
    @Input() IsHideBack: boolean;
    @Input() IsHandleBack: boolean = false;
    @Input() PageType: string = 'List';
    @Input() Caption: string = 'Loading...';
    @Output()
    onItemClicked: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        private confirmationService: ConfirmationService,
        private _location: Location
    ) {
    }

    acceptLabel: string = 'Save';
    IsShowLoader: boolean;

    ngOnInit(): void {
    }

    IsSaveDisabled(): boolean {
        return this.form == null || !this.form.dirty || !this.form.valid;
    }

    confirmSave() {
        this.acceptLabel = 'Save';
        this.confirmationService.confirm({
            key: 'confirm1',
            message: 'Are you sure to perform this action?',
            accept: () => {
                this.IsShowLoader = true;
                this.onButtonClicked('Save');
            },
            reject: () => { }
        });
    }


    confirmDelete() {
        this.acceptLabel = 'Delete';
        this.confirmationService.confirm({
            key: 'confirm1',
            message: 'Are you sure you want to delete this?',
            accept: () => {
                this.IsShowLoader = true;
                this.onButtonClicked('Delete');
            },
            reject: () => { }
        });
    }

    confirmBack() {
        if (this.form == null || !this.form.isDirty) {
            this.onButtonClicked('Back');
            return;
        }
        this.acceptLabel = 'Go Back';
        this.confirmationService.confirm({
            key: 'confirm1',
            message: 'Do you want to leave page?',
            accept: () => {
                this.IsShowLoader = true; this.onButtonClicked('Back');
            },
            reject: () => { }
        });

    }


    confirmCancel() {
        this.acceptLabel = 'Yes';
        if (this.form != null && this.form.dirty) {
            this.confirmationService.confirm({
                key: 'confirm1',
                message: 'Do you want to discard the changes?',
                accept: () => {
                    this.IsShowLoader = true; this.onButtonClicked('Cancel');
                },
                reject: () => { }
            });
        }

    }

    viewModelData() {
        console.log('Form Data:', this.form.value);
        console.log('Form:', this.form);
    }


    onButtonClicked(event: string): void {
        if (event == 'Save') {

        }
        else if (event == 'Delete') {

        }
        else if (event == 'Cancel') {

        }
        else if (event == 'Back') {
            if (this.IsHandleBack == false) { 
                this._location.back();
            }
        }

        this.onItemClicked.emit(event);
    }


}
