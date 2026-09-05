import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
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
  private readonly entityLookupDestroyRef = inject(DestroyRef);

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

   this.loggedInUserService.bindEntityLookup(this.editForm, 'ContractApprovalRequestId', 'contract-approval-requests',
      options => this.contractapprovalrequestidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ApproverUserId', 'application-users',
      options => this.approveruseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.actioncodeOptions = this.loggedInUserService.getPicklistOptions('ContractApprovalActionActionCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'DelegatedFromUserId', 'application-users',
      options => this.delegatedfromuseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);

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
      this.router.navigate(['/contracts/approvals/actions/create', { id: -1 }]);
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
