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
import { IApprovalRequest } from './approvalRequest';
import { ApprovalRequestService } from './approvalRequest.service';


@Component({
  selector: 'app-approvalRequest-edit',
  standalone: false,
  templateUrl: './approvalRequest-edit.component.html',
  providers: [ MessageService]
})
export class ApprovalRequestEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  approvalRequest: IApprovalRequest = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  referencetypeOptions: ISelectItem[] = [];
workflowdefinitionidOptions: ISelectItem[] = [];
approvalstatuscodeOptions: ISelectItem[] = [];
requestedbyOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IApprovalRequest = {} as IApprovalRequest;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private approvalRequestService: ApprovalRequestService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.approvalRequest };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
ReferenceType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
ReferenceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
WorkflowDefinitionId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ApprovalStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RequestedBy: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RequestedOn: new FormControl(new Date(), [Validators.required]),
CompletedOn: new FormControl(new Date(), []),

    });

   this.referencetypeOptions = this.loggedInUserService.getPicklistOptions('ApprovalRequestReferenceType');
this.workflowdefinitionidOptions.push({Text: 'WorkflowDefinitionId1', Value: 'WorkflowDefinitionId1' });
this.workflowdefinitionidOptions.push({Text: 'WorkflowDefinitionId2', Value: 'WorkflowDefinitionId2' });
this.approvalstatuscodeOptions = this.loggedInUserService.getPicklistOptions('ApprovalStatusCode');
this.requestedbyOptions.push({Text: 'RequestedBy1', Value: 'RequestedBy1' });
this.requestedbyOptions.push({Text: 'RequestedBy2', Value: 'RequestedBy2' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.approvalRequestService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.approvalRequest = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.approvalRequest };
        this.populateUI(this.approvalRequest);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "ApprovalRequest Details #" + obj.Id;
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     ReferenceType:  formValues.ReferenceType || null,
ReferenceId:  formValues.ReferenceId || 0,
WorkflowDefinitionId:  formValues.WorkflowDefinitionId || 0,
ApprovalStatusCode:  formValues.ApprovalStatusCode || null,
RequestedBy:  formValues.RequestedBy || 0,
RequestedOn:  formValues.RequestedOn || null,
CompletedOn:  formValues.CompletedOn || null,

    } as IApprovalRequest ;
	
	this.spinner.show();  	   
    this.approvalRequestService.update(this.approvalRequest.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(ApprovalRequest +  'Details Updated sucessfully.');
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
