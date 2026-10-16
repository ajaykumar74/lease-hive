import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { ISupportTicketStatusHistory } from './supportTicketStatusHistory';
import { SupportTicketStatusHistoryService } from './supportTicketStatusHistory.service';

@Component({
  selector: 'app-supportTicketStatusHistory-create',
  standalone: false,
  templateUrl: './supportTicketStatusHistory-create.component.html' ,
   providers: [ MessageService]
})
export class SupportTicketStatusHistoryCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  supportTicketStatusHistory: ISupportTicketStatusHistory = null;
  supportticketidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ISupportTicketStatusHistory = {} as ISupportTicketStatusHistory;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private supportTicketStatusHistoryService: SupportTicketStatusHistoryService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.supportTicketStatusHistory };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
SupportTicketId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),

    });
    this.Caption = 'Create SupportTicketStatusHistory';
    this.supportticketidOptions.push({Text: 'SupportTicketId1', Value: 'SupportTicketId1' });
this.supportticketidOptions.push({Text: 'SupportTicketId2', Value: 'SupportTicketId2' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.supportTicketStatusHistoryService.getById(this.selectedId).subscribe({
      next: data => {
        this.supportTicketStatusHistory = data;
        this.objMaster = { ...this.supportTicketStatusHistory };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ISupportTicketStatusHistory): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  SupportTicketId: obj.SupportTicketId || 0,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/supportTicketStatusHistorys/create']);
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
    this.supportTicketStatusHistory = { ...this.objMaster };
    var obj  = this.supportTicketStatusHistory;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  SupportTicketId: obj.SupportTicketId || 0,
 
      }
    );
    this.editForm.reset(); 
  } 

  Save(): void {    
   
        if (!this.editForm.valid) {
            this.messageService.showError('One or more validation failed. Please clear error to continue...');
            return;
        }	
  
  
	const formValues  = this.editForm.value ;
	var createdObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
     SupportTicketId: formValues.SupportTicketId || 0,

    } as ISupportTicketStatusHistory ; 
	
	  this.spinner.show(); 
    this.supportTicketStatusHistoryService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(SupportTicketStatusHistory +  'Details Updated sucessfully.');
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



