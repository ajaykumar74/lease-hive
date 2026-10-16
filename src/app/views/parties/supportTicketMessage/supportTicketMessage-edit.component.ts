import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
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
  selector: 'app-supportTicketMessage-edit',
  standalone: false,
  templateUrl: './supportTicketMessage-edit.component.html',
  providers: [ MessageService]
})
export class SupportTicketMessageEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  supportTicketMessage: ISupportTicketMessage = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  supportticketidOptions: ISelectItem[] = [];
senderapplicationuseridOptions: ISelectItem[] = [];
sendertypecodeOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ISupportTicketMessage = {} as ISupportTicketMessage;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private supportTicketMessageService: SupportTicketMessageService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.supportTicketMessage };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
SupportTicketId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SenderApplicationUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SenderTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Message: new FormControl('', [Validators.required, Validators.maxLength(4000), ]),
IsInternalNote: new FormControl(false, [Validators.required]),

    });

   this.supportticketidOptions.push({Text: 'SupportTicketId1', Value: 'SupportTicketId1' });
this.supportticketidOptions.push({Text: 'SupportTicketId2', Value: 'SupportTicketId2' });
this.senderapplicationuseridOptions.push({Text: 'SenderApplicationUserId1', Value: 'SenderApplicationUserId1' });
this.senderapplicationuseridOptions.push({Text: 'SenderApplicationUserId2', Value: 'SenderApplicationUserId2' });
this.sendertypecodeOptions.push({Text: '', Value: '' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.supportTicketMessageService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.supportTicketMessage = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.supportTicketMessage };
        this.populateUI(this.supportTicketMessage);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "SupportTicketMessage Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/supportTicketMessage/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     SupportTicketId:  formValues.SupportTicketId || null,
SenderApplicationUserId:  formValues.SenderApplicationUserId || null,
SenderTypeCode:  formValues.SenderTypeCode || null,
Message:  formValues.Message || null,
IsInternalNote:  formValues.IsInternalNote || null,

    } as ISupportTicketMessage ;
	
	this.spinner.show();  	   
    this.supportTicketMessageService.update(this.supportTicketMessage.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(SupportTicketMessage +  'Details Updated sucessfully.');
		//this.editForm.reset();
		this._location.back();
      },
      error: err => { 
       this.messageService.showError(err);
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide();}
    });
  }
}
