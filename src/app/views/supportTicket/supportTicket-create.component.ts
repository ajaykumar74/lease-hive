import { Component,  OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  selector: 'app-supportTicket-create',
  standalone: false,
  templateUrl: './supportTicket-create.component.html',
  providers: [MessageService]
})
export class SupportTicketCreateComponent implements OnInit {


  selectedId: number;
  isLoading: boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  supportTicket: ISupportTicket = null;

  editForm: any;
  objMaster: ISupportTicket = {} as ISupportTicket;

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private supportTicketService: SupportTicketService,
    private loggedInUserService: LoggedInUserService,
    private readonly appConstants: AppConstants,

  ) {
  }





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

    });

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.Caption = "Create Support Ticket";
    }, 500);
  }

  loadUI(): void {
    this.isLoading = true;
    this.supportTicketService.getById(this.selectedId).subscribe({
      next: data => {
        this.supportTicket = data;
        this.objMaster = { ...this.supportTicket };
        this.populateUI(data);
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
        ClosedAt: obj.ClosedAt || new Date(),
        Priority: obj.Priority || '',
        Category: obj.Category || '',
        RequestType: obj.RequestType || '',

      }
    );
  }


  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['supportTickets/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }
    else if (key == "Refresh") {
      this.loadUI();
    }
  }

  onCancel(): void {
    this.supportTicket = { ...this.objMaster };
    var obj = this.supportTicket;
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        Title: obj.Title || '',
        Description: obj.Description || '',
        Status: obj.Status || '',
        AssignedTo: obj.AssignedTo || 0,
        ClosedAt: obj.ClosedAt || new Date(),
        Priority: obj.Priority || '',
        Category: obj.Category || '',
        RequestType: obj.RequestType || '',

      }
    );
    this.editForm.reset();
  }

  Save(): void {

    if (!this.editForm.valid) {
      this.messageService.showError('One or more validation failed. Please clear error to continue...');
      return;
    }


    const formValues = this.editForm.value;
    var createdObj = {
      Id: 0,
      CustomerId: this.loggedInUserService.loggedInUser.Customer.Id,
      Title: formValues.Title || null,
      Description: formValues.Description || null,
      Status: this.appConstants.SupportTicketStatus.Open,
      AssignedTo: 0,
      ClosedAt: null,
      Priority: formValues.Priority || null,
      Category: formValues.Category || null,
      RequestType: formValues.RequestType || null,
      LoggedInUserJson: JSON.stringify(this.loggedInUserService.loggedInUser),

    } as ISupportTicket;
    this.spinner.show();
    this.supportTicketService.create(createdObj).subscribe({
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



