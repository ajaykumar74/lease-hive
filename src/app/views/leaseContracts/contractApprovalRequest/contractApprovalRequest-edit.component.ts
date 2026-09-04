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
import { IContractApprovalRequest } from './contractApprovalRequest';
import { ContractApprovalRequestService } from './contractApprovalRequest.service';


@Component({
  selector: 'app-contractApprovalRequest-edit',
  standalone: false,
  templateUrl: './contractApprovalRequest-edit.component.html',
  providers: [ MessageService]
})
export class ContractApprovalRequestEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  contractApprovalRequest: IContractApprovalRequest = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  referencetypeOptions: ISelectItem[] = [];
workflowdefinitionidOptions: ISelectItem[] = [];
approvalstatuscodeOptions: ISelectItem[] = [];
requestedbyOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IContractApprovalRequest = {} as IContractApprovalRequest;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private contractApprovalRequestService: ContractApprovalRequestService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.contractApprovalRequest };

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

   this.referencetypeOptions.push({Text: 'CONTRACT', Value: 'CONTRACT' });
this.referencetypeOptions.push({Text: 'ACTIVATION', Value: 'ACTIVATION' });
this.referencetypeOptions.push({Text: 'AMENDMENT', Value: 'AMENDMENT' });
this.referencetypeOptions.push({Text: 'TERMINATION', Value: 'TERMINATION' });
this.referencetypeOptions.push({Text: 'WAIVER', Value: 'WAIVER' });
this.workflowdefinitionidOptions.push({Text: 'WorkflowDefinitionId1', Value: 'WorkflowDefinitionId1' });
this.workflowdefinitionidOptions.push({Text: 'WorkflowDefinitionId2', Value: 'WorkflowDefinitionId2' });
this.approvalstatuscodeOptions.push({Text: 'PENDING', Value: 'PENDING' });
this.approvalstatuscodeOptions.push({Text: 'APPROVED', Value: 'APPROVED' });
this.approvalstatuscodeOptions.push({Text: 'REJECTED', Value: 'REJECTED' });
this.approvalstatuscodeOptions.push({Text: 'RETURNED', Value: 'RETURNED' });
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
    this.contractApprovalRequestService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.contractApprovalRequest = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.contractApprovalRequest };
        this.populateUI(this.contractApprovalRequest);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IContractApprovalRequest): void {  
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
   
	 this.Caption = "ContractApprovalRequest Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contracts/approvals/contracts/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.contractApprovalRequest = { ...this.objMaster };
	var obj  = this.contractApprovalRequest;
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
ReferenceId:  formValues.ReferenceId || null,
WorkflowDefinitionId:  formValues.WorkflowDefinitionId || null,
ApprovalStatusCode:  formValues.ApprovalStatusCode || null,
RequestedBy:  formValues.RequestedBy || null,
RequestedOn:  formValues.RequestedOn || null,
CompletedOn:  formValues.CompletedOn || null,

    } as IContractApprovalRequest ;
	
	this.spinner.show();  	   
    this.contractApprovalRequestService.update(this.contractApprovalRequest.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(ContractApprovalRequest +  'Details Updated sucessfully.');
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
