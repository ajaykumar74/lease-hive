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
import { IFinanceApprovalAction } from './financeApprovalAction';
import { FinanceApprovalActionService } from './financeApprovalAction.service';

@Component({
  selector: 'app-financeApprovalAction-create',
  standalone: false,
  templateUrl: './financeApprovalAction-create.component.html' ,
   providers: [ MessageService]
})
export class FinanceApprovalActionCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  financeApprovalAction: IFinanceApprovalAction = null;
  financeapprovalrequestidOptions: ISelectItem[] = [];
actionbyuseridOptions: ISelectItem[] = [];
actioncodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IFinanceApprovalAction = {} as IFinanceApprovalAction;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private financeApprovalActionService: FinanceApprovalActionService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.financeApprovalAction };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
FinanceApprovalRequestId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ActionByUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ActionCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ActionAtUtc: new FormControl(new Date(), [Validators.required]),
Comments: new FormControl('', [Validators.maxLength(1000), ]), 
AuthoritySnapshot: new FormControl('', [Validators.maxLength(500), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create FinanceApprovalAction';
    this.financeapprovalrequestidOptions.push({Text: 'FinanceApprovalRequestId1', Value: 'FinanceApprovalRequestId1' });
this.financeapprovalrequestidOptions.push({Text: 'FinanceApprovalRequestId2', Value: 'FinanceApprovalRequestId2' });
this.actionbyuseridOptions.push({Text: 'ActionByUserId1', Value: 'ActionByUserId1' });
this.actionbyuseridOptions.push({Text: 'ActionByUserId2', Value: 'ActionByUserId2' });
this.actioncodeOptions.push({Text: 'APPROVE', Value: 'APPROVE' });
this.actioncodeOptions.push({Text: 'REJECT', Value: 'REJECT' });
this.actioncodeOptions.push({Text: 'RETURN', Value: 'RETURN' });
this.actioncodeOptions.push({Text: 'WAIVE', Value: 'WAIVE' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.financeApprovalActionService.getById(this.selectedId).subscribe({
      next: data => {
        this.financeApprovalAction = data;
        this.objMaster = { ...this.financeApprovalAction };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IFinanceApprovalAction): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  FinanceApprovalRequestId: obj.FinanceApprovalRequestId || 0,
ActionByUserId: obj.ActionByUserId || 0,
ActionCode: obj.ActionCode || '',
ActionAtUtc:  obj.ActionAtUtc || new Date(),
Comments: obj.Comments || '',
AuthoritySnapshot: obj.AuthoritySnapshot || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/financeApprovalActions/create']);
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
    this.financeApprovalAction = { ...this.objMaster };
    var obj  = this.financeApprovalAction;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  FinanceApprovalRequestId: obj.FinanceApprovalRequestId || 0,
ActionByUserId: obj.ActionByUserId || 0,
ActionCode: obj.ActionCode || '',
ActionAtUtc:  obj.ActionAtUtc || new Date(),
Comments: obj.Comments || '',
AuthoritySnapshot: obj.AuthoritySnapshot || '',
RecordStatus: obj.RecordStatus || '',
 
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
     FinanceApprovalRequestId: formValues.FinanceApprovalRequestId || 0,
ActionByUserId: formValues.ActionByUserId || 0,
ActionCode: formValues.ActionCode || null,
ActionAtUtc: formValues.ActionAtUtc || null,
Comments: formValues.Comments || null,
AuthoritySnapshot: formValues.AuthoritySnapshot || null,
RecordStatus: formValues.RecordStatus || null,

    } as IFinanceApprovalAction ; 
	
	  this.spinner.show(); 
    this.financeApprovalActionService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(FinanceApprovalAction +  'Details Updated sucessfully.');
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



