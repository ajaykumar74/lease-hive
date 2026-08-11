import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { AppConstants } from '@/shared/constants/AppConstants';
import { ISupportTicket } from './supportTicket';
import { SupportTicketService } from './supportTicket.service';


@Component({
  selector: 'app-supportTicket-edit',
  standalone: false,
  templateUrl: './supportTicket-edit.component.html',
  providers: [MessageService]
})
export class SupportTicketEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  supportTicket: ISupportTicket = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';

  editForm: any;
  objMaster: ISupportTicket = {} as ISupportTicket;


  constructor(
    private activatedRouter: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private supportTicketService: SupportTicketService,
    private loggedInUserService: LoggedInUserService,
    private readonly appConstants: AppConstants,
  ) {
  }

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;



  ngOnInit(): void {
    this.objMaster = { ...this.supportTicket };

    this.editForm = this.fb.group({
      Id: new FormControl(0, []),
      Title: new FormControl('', [Validators.required, Validators.maxLength(100),]),
      Description: new FormControl('', [Validators.required, Validators.maxLength(2000),]),
      Status: new FormControl(''),
      AssignedTo: new FormControl(null),
      ClosedAt: new FormControl(null),
      Priority: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      Category: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      RequestType: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      TicketClosed: new FormControl(false),
    });


    this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500);
  }


  loadUI(): void {
    this.isLoading = true;
    this.supportTicketService.getById(this.selectedId).subscribe({
      next: data => {
        this.supportTicket = data.data;
        this.permission = data.permission;
        this.objMaster = { ...this.supportTicket };
        this.populateUI(this.supportTicket);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    });
  }

  populateUI(obj: ISupportTicket): void {
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        Title: obj.Title || '',
        Description: obj.Description || '',
        Status: obj.Status || '',
        AssignedTo: obj.AssignedTo || 0,
        ClosedAt: obj.ClosedAt || null,
        Priority: obj.Priority || '',
        Category: obj.Category || '',
        RequestType: obj.RequestType || '',
        TicketClosed: obj.TicketClosed || false,

      }
    );

    this.Caption = "SupportTicket Details #" + obj.Id;
  }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/supportTicket/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.editForm.reset(); this.editForm.reset();
    this.supportTicket = { ...this.objMaster };
    this.populateUI(this.supportTicket);
    this.editForm.markAsPristine();
    this.editForm.markAsUntouched();
    this.editForm.updateValueAndValidity();
  }



  Save(): void {

    if (!this.editForm.valid) {
      this.messageService.showError('One or more validation failed. Please clear error to continue...');
      return;
    }

    const formValues = this.editForm.value;
    var updatedObj = {
      Id: this.objMaster.Id,
      RowVersionStr: this.objMaster.RowVersionStr,
      Title: formValues.Title || null,
      Description: formValues.Description || null,
      Status: this.appConstants.SupportTicketStatus.Open,
      AssignedTo: 0,
      ClosedAt: null,
      Priority: formValues.Priority || null,
      Category: formValues.Category || null,
      RequestType: formValues.RequestType || null,
      TicketClosed: formValues.TicketClosed

    } as ISupportTicket;

    this.spinner.show();
    this.supportTicketService.update(this.supportTicket.Id, updatedObj).subscribe({
      next: data => {
        this.supportTicketService.CacheData.IsLoaded = false;
        this._location.back();
      },
      error: err => {
        this.messageService.showError(err);
        this.spinner.hide();
      },
      complete: () => { this.spinner.hide(); }
    });
  }
}
