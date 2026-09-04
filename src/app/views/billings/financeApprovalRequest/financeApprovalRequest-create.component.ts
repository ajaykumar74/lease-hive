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
import { IFinanceApprovalRequest } from './financeApprovalRequest';
import { FinanceApprovalRequestService } from './financeApprovalRequest.service';

@Component({
  selector: 'app-financeApprovalRequest-create',
  standalone: false,
  templateUrl: './financeApprovalRequest-create.component.html' ,
   providers: [ MessageService]
})
export class FinanceApprovalRequestCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  financeApprovalRequest: IFinanceApprovalRequest = null;
  referencetypeOptions: ISelectItem[] = [];
workflowinstanceidOptions: ISelectItem[] = [];
requestedbyuseridOptions: ISelectItem[] = [];
approvalstatusOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IFinanceApprovalRequest = {} as IFinanceApprovalRequest;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private financeApprovalRequestService: FinanceApprovalRequestService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.financeApprovalRequest };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ReferenceType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
ReferenceId: new FormControl(0, [Validators.required, ]),
WorkflowInstanceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
RequestedByUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RequestedAtUtc: new FormControl(new Date(), [Validators.required]),
ApprovalStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Amount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create FinanceApprovalRequest';
    this.referencetypeOptions.push({Text: 'BILLING_RUN', Value: 'BILLING_RUN' });
this.referencetypeOptions.push({Text: 'CREDIT_NOTE', Value: 'CREDIT_NOTE' });
this.referencetypeOptions.push({Text: 'REFUND', Value: 'REFUND' });
this.referencetypeOptions.push({Text: 'WRITE_OFF', Value: 'WRITE_OFF' });
this.referencetypeOptions.push({Text: 'JOURNAL', Value: 'JOURNAL' });
this.workflowinstanceidOptions.push({Text: 'WorkflowInstanceId1', Value: 'WorkflowInstanceId1' });
this.workflowinstanceidOptions.push({Text: 'WorkflowInstanceId2', Value: 'WorkflowInstanceId2' });
this.requestedbyuseridOptions.push({Text: 'RequestedByUserId1', Value: 'RequestedByUserId1' });
this.requestedbyuseridOptions.push({Text: 'RequestedByUserId2', Value: 'RequestedByUserId2' });
this.approvalstatusOptions.push({Text: 'PENDING', Value: 'PENDING' });
this.approvalstatusOptions.push({Text: 'APPROVED', Value: 'APPROVED' });
this.approvalstatusOptions.push({Text: 'REJECTED', Value: 'REJECTED' });
this.approvalstatusOptions.push({Text: 'CANCELLED', Value: 'CANCELLED' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.financeApprovalRequestService.getById(this.selectedId).subscribe({
      next: data => {
        this.financeApprovalRequest = data;
        this.objMaster = { ...this.financeApprovalRequest };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IFinanceApprovalRequest): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
WorkflowInstanceId: obj.WorkflowInstanceId || 0,
RequestedByUserId: obj.RequestedByUserId || 0,
RequestedAtUtc:  obj.RequestedAtUtc || new Date(),
ApprovalStatus: obj.ApprovalStatus || '',
Amount: obj.Amount || 0,
CurrencyCode: obj.CurrencyCode || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/financeApprovalRequests/create']);
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
    this.financeApprovalRequest = { ...this.objMaster };
    var obj  = this.financeApprovalRequest;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
WorkflowInstanceId: obj.WorkflowInstanceId || 0,
RequestedByUserId: obj.RequestedByUserId || 0,
RequestedAtUtc:  obj.RequestedAtUtc || new Date(),
ApprovalStatus: obj.ApprovalStatus || '',
Amount: obj.Amount || 0,
CurrencyCode: obj.CurrencyCode || '',
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
     ReferenceType: formValues.ReferenceType || null,
ReferenceId: formValues.ReferenceId || null,
WorkflowInstanceId: formValues.WorkflowInstanceId || 0,
RequestedByUserId: formValues.RequestedByUserId || 0,
RequestedAtUtc: formValues.RequestedAtUtc || null,
ApprovalStatus: formValues.ApprovalStatus || null,
Amount: formValues.Amount || 0,
CurrencyCode: formValues.CurrencyCode || null,
RecordStatus: formValues.RecordStatus || null,

    } as IFinanceApprovalRequest ; 
	
	  this.spinner.show(); 
    this.financeApprovalRequestService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(FinanceApprovalRequest +  'Details Updated sucessfully.');
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



