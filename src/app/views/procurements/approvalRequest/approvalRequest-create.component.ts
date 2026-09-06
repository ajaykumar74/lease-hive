import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IApprovalRequest } from './approvalRequest';
import { ApprovalRequestService } from './approvalRequest.service';

@Component({
  selector: 'app-approvalRequest-create',
  standalone: false,
  templateUrl: './approvalRequest-create.component.html' ,
   providers: [ MessageService]
})
export class ApprovalRequestCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  approvalRequest: IApprovalRequest = null;
  referencetypeOptions: ISelectItem[] = [];
workflowdefinitionidOptions: ISelectItem[] = [];
approvalstatuscodeOptions: ISelectItem[] = [];
requestedbyOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IApprovalRequest = {} as IApprovalRequest;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private approvalRequestService: ApprovalRequestService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.approvalRequest };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ReferenceType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
ReferenceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
WorkflowDefinitionId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ApprovalStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RequestedBy: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RequestedOn: new FormControl(new Date(), [Validators.required]),
CompletedOn: new FormControl(new Date(), []),

    });
    this.Caption = 'Create ApprovalRequest';
    this.referencetypeOptions = this.loggedInUserService.getPicklistOptions('ApprovalRequestReferenceType');
this.loggedInUserService.bindEntityLookup(this.editForm, 'RequestedBy', 'application-users',
      options => this.requestedbyOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'WorkflowDefinitionId', 'workflow-definitions',
      options => this.workflowdefinitionidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.approvalstatuscodeOptions = this.loggedInUserService.getPicklistOptions('ApprovalStatusCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.approvalRequestService.getById(this.selectedId).subscribe({
      next: data => {
        this.approvalRequest = data;
        this.objMaster = { ...this.approvalRequest };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IApprovalRequest): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
WorkflowDefinitionId: obj.WorkflowDefinitionId || 0,
ApprovalStatusCode: obj.ApprovalStatusCode || '',
RequestedBy: obj.RequestedBy || 0,
RequestedOn:  obj.RequestedOn || new Date(),
CompletedOn:  obj.CompletedOn || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/approvals/pending/create']);
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
    this.approvalRequest = { ...this.objMaster };
    var obj  = this.approvalRequest;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
WorkflowDefinitionId: obj.WorkflowDefinitionId || 0,
ApprovalStatusCode: obj.ApprovalStatusCode || '',
RequestedBy: obj.RequestedBy || 0,
RequestedOn:  obj.RequestedOn || new Date(),
CompletedOn:  obj.CompletedOn || new Date(),
 
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
     ReferenceType: formValues.ReferenceType || null,
ReferenceId: formValues.ReferenceId || 0,
WorkflowDefinitionId: formValues.WorkflowDefinitionId || 0,
ApprovalStatusCode: formValues.ApprovalStatusCode || null,
RequestedBy: formValues.RequestedBy || 0,
RequestedOn: formValues.RequestedOn || null,
CompletedOn: formValues.CompletedOn || null,

    } as IApprovalRequest ; 
	
	  this.spinner.show(); 
    this.approvalRequestService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ApprovalRequest +  'Details Updated sucessfully.');
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



