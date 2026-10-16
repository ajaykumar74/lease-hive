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
import { ISupportTicketMessage } from './supportTicketMessage';
import { SupportTicketMessageService } from './supportTicketMessage.service';

@Component({
  selector: 'app-supportTicketMessage-create',
  standalone: false,
  templateUrl: './supportTicketMessage-create.component.html' ,
   providers: [ MessageService]
})
export class SupportTicketMessageCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  supportTicketMessage: ISupportTicketMessage = null;
  supportticketidOptions: ISelectItem[] = [];
senderapplicationuseridOptions: ISelectItem[] = [];
sendertypecodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ISupportTicketMessage = {} as ISupportTicketMessage;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private supportTicketMessageService: SupportTicketMessageService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.supportTicketMessage };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
SupportTicketId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SenderApplicationUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SenderTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Message: new FormControl('', [Validators.required, Validators.maxLength(4000), ]),
IsInternalNote: new FormControl(false, [Validators.required]),

    });
    this.Caption = 'Create SupportTicketMessage';
    this.supportticketidOptions.push({Text: 'SupportTicketId1', Value: 'SupportTicketId1' });
this.supportticketidOptions.push({Text: 'SupportTicketId2', Value: 'SupportTicketId2' });
this.senderapplicationuseridOptions.push({Text: 'SenderApplicationUserId1', Value: 'SenderApplicationUserId1' });
this.senderapplicationuseridOptions.push({Text: 'SenderApplicationUserId2', Value: 'SenderApplicationUserId2' });
this.sendertypecodeOptions.push({Text: '', Value: '' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.supportTicketMessageService.getById(this.selectedId).subscribe({
      next: data => {
        this.supportTicketMessage = data;
        this.objMaster = { ...this.supportTicketMessage };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ISupportTicketMessage): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  SupportTicketId: obj.SupportTicketId || 0,
SenderApplicationUserId: obj.SenderApplicationUserId || 0,
SenderTypeCode: obj.SenderTypeCode || '',
Message: obj.Message || '',
IsInternalNote:  obj.IsInternalNote || false,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/supportTicketMessages/create']);
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
    this.supportTicketMessage = { ...this.objMaster };
    var obj  = this.supportTicketMessage;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  SupportTicketId: obj.SupportTicketId || 0,
SenderApplicationUserId: obj.SenderApplicationUserId || 0,
SenderTypeCode: obj.SenderTypeCode || '',
Message: obj.Message || '',
IsInternalNote:  obj.IsInternalNote || false,
 
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
SenderApplicationUserId: formValues.SenderApplicationUserId || 0,
SenderTypeCode: formValues.SenderTypeCode || null,
Message: formValues.Message || null,
IsInternalNote: formValues.IsInternalNote || false,

    } as ISupportTicketMessage ; 
	
	  this.spinner.show(); 
    this.supportTicketMessageService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(SupportTicketMessage +  'Details Updated sucessfully.');
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



