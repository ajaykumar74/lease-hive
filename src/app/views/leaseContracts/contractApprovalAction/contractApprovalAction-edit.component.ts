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
import { IContractApprovalAction } from './contractApprovalAction';
import { ContractApprovalActionService } from './contractApprovalAction.service';


@Component({
  selector: 'app-contractApprovalAction-edit',
  standalone: false,
  templateUrl: './contractApprovalAction-edit.component.html',
  providers: [ MessageService]
})
export class ContractApprovalActionEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  contractApprovalAction: IContractApprovalAction = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  contractapprovalrequestidOptions: ISelectItem[] = [];
approveruseridOptions: ISelectItem[] = [];
actioncodeOptions: ISelectItem[] = [];
delegatedfromuseridOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IContractApprovalAction = {} as IContractApprovalAction;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private contractApprovalActionService: ContractApprovalActionService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.contractApprovalAction };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
ContractApprovalRequestId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
StepNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
ApproverUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ActionCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ActionDateTime: new FormControl(new Date(), [Validators.required]),
Comments: new FormControl('', [Validators.maxLength(1000), ]), 
DelegatedFromUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),

    });

   this.contractapprovalrequestidOptions.push({Text: 'ContractApprovalRequestId1', Value: 'ContractApprovalRequestId1' });
this.contractapprovalrequestidOptions.push({Text: 'ContractApprovalRequestId2', Value: 'ContractApprovalRequestId2' });
this.approveruseridOptions.push({Text: 'ApproverUserId1', Value: 'ApproverUserId1' });
this.approveruseridOptions.push({Text: 'ApproverUserId2', Value: 'ApproverUserId2' });
this.actioncodeOptions.push({Text: 'APPROVE', Value: 'APPROVE' });
this.actioncodeOptions.push({Text: 'REJECT', Value: 'REJECT' });
this.actioncodeOptions.push({Text: 'RETURN', Value: 'RETURN' });
this.actioncodeOptions.push({Text: 'DELEGATE', Value: 'DELEGATE' });
this.delegatedfromuseridOptions.push({Text: 'DelegatedFromUserId1', Value: 'DelegatedFromUserId1' });
this.delegatedfromuseridOptions.push({Text: 'DelegatedFromUserId2', Value: 'DelegatedFromUserId2' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.contractApprovalActionService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.contractApprovalAction = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.contractApprovalAction };
        this.populateUI(this.contractApprovalAction);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IContractApprovalAction): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ContractApprovalRequestId: obj.ContractApprovalRequestId || 0,
StepNo: obj.StepNo || 0,
ApproverUserId: obj.ApproverUserId || 0,
ActionCode: obj.ActionCode || '',
ActionDateTime:  obj.ActionDateTime || new Date(),
Comments: obj.Comments || '',
DelegatedFromUserId: obj.DelegatedFromUserId || 0,
 
      }
    );
   
	 this.Caption = "ContractApprovalAction Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contractApprovalAction/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.contractApprovalAction = { ...this.objMaster };
	var obj  = this.contractApprovalAction;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ContractApprovalRequestId: obj.ContractApprovalRequestId || 0,
StepNo: obj.StepNo || 0,
ApproverUserId: obj.ApproverUserId || 0,
ActionCode: obj.ActionCode || '',
ActionDateTime:  obj.ActionDateTime || new Date(),
Comments: obj.Comments || '',
DelegatedFromUserId: obj.DelegatedFromUserId || 0,
 
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
     ContractApprovalRequestId:  formValues.ContractApprovalRequestId || null,
StepNo:  formValues.StepNo || null,
ApproverUserId:  formValues.ApproverUserId || null,
ActionCode:  formValues.ActionCode || null,
ActionDateTime:  formValues.ActionDateTime || null,
Comments:  formValues.Comments || null,
DelegatedFromUserId:  formValues.DelegatedFromUserId || null,

    } as IContractApprovalAction ;
	
	this.spinner.show();  	   
    this.contractApprovalActionService.update(this.contractApprovalAction.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(ContractApprovalAction +  'Details Updated sucessfully.');
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
